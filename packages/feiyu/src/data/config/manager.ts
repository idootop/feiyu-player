import { http } from '@/services/http';
import { ipfs, ipfsGateway } from '@/services/ipfs';
import { storage } from '@/services/storage/storage';
import { store } from '@/services/store/useStore';
import { timestamp } from '@/utils/base';
import { deepClone } from '@/utils/clone';
import { isNotEmpty } from '@/utils/is';

import { kDefaultConfig } from '../default';
import { subscribeStorage } from './storage';
import { FeiyuConfig, Subscribe } from './types';

export interface SubscribesStore {
  currentSubscribe: string;
  subscribes: Record<string, Subscribe>;
  allowSexy: boolean; // 不过滤伦理片
  allowMovieCommentary: boolean; // 不过滤电影解说
}

export const kSubscribesKey = 'kSubscribesKey';

export class ConfigManager {
  static defaultKey = '默认订阅';
  static defaultConfig: Subscribe = {
    feiyu: 'subscribe',
    key: ConfigManager.defaultKey,
    link: undefined,
    lastUpdate: 1676205769619,
    config: kDefaultConfig,
  };

  private get _subscribes() {
    const origin = store.get<SubscribesStore>(kSubscribesKey)?.subscribes ?? {};
    return deepClone<Record<string, Subscribe>>(origin);
  }

  private get _currentSubscribe() {
    return (
      store.get<SubscribesStore>(kSubscribesKey)?.currentSubscribe ??
      ConfigManager.defaultKey
    );
  }

  private _updateStore(data: Partial<SubscribesStore>) {
    const old = store.get<SubscribesStore>(kSubscribesKey) ?? {};
    store.set(kSubscribesKey, {
      ...old,
      ...data,
    });
  }

  get current(): FeiyuConfig {
    this.init(); // 被动初始化
    return this._subscribes[this._currentSubscribe]?.config ?? kDefaultConfig;
  }

  get allowSexy() {
    return storage.get('allowSexy');
  }
  get allowMovieCommentary() {
    return storage.get('allowMovieCommentary');
  }

  toggleAllowSexy() {
    const flag = !this.allowSexy;
    storage.set('allowSexy', flag);
    this._updateStore({
      allowSexy: flag,
    });
  }

  toggleAllowMovieCommentary() {
    const flag = !this.allowMovieCommentary;
    storage.set('allowMovieCommentary', flag);
    this._updateStore({
      allowMovieCommentary: flag,
    });
  }

  inited = false;
  /**
   * 初始化订阅列表
   */
  async init() {
    const _subscribes = this._subscribes;
    if (this.inited) {
      return; // 只从本地初始化一次
    }
    this.inited = true;
    // 添加默认配置
    _subscribes[ConfigManager.defaultKey] = ConfigManager.defaultConfig;
    // 加载本地订阅配置
    const subscribes = await subscribeStorage.getAll();
    subscribes.forEach((e) => {
      _subscribes[e.key] = e;
    });
    // 从本地读取当前使用的配置记录
    let _currentSubscribe = ConfigManager.defaultKey;
    const current = subscribeStorage.current();
    if (current) {
      _currentSubscribe = current;
    }
    // 初始化依赖
    this._updateStore({
      subscribes: _subscribes,
      currentSubscribe: _currentSubscribe,
      allowSexy: this.allowSexy,
      allowMovieCommentary: this.allowMovieCommentary,
    });
    // 刷新订阅
    this.refreshAll();
  }

  /**
   * 批量导出订阅
   */
  async exportSubscribes() {
    await this.init();
    // 逆向导出订阅列表（导入时恢复原顺序）
    const datas = Object.values(this._subscribes).reverse();
    const cid = await ipfs.writeJson({ feiyu: 'subscribes', datas }, true);
    return cid ? ipfsGateway() + cid : undefined;
  }

  /**
   * 导出单个订阅
   */
  async exportSubscribe(key: string) {
    await this.init();
    if (!this._subscribes[key]) return false;
    const data = this._subscribes[key].config; // 只导出订阅 config
    const cid = await ipfs.writeJson(data, true);
    return cid ? ipfsGateway() + cid : undefined;
  }

  /**
   * 批量导入订阅(返回导入成功个数)
   */
  async importSubscribes(url: string) {
    await this.init();
    const _datas = await http.proxy.get(url, undefined, { cache: false });
    let successItems = 0;
    if (_datas?.feiyu !== 'subscribes') {
      return 0;
    }
    const datas: Subscribe[] = _datas.datas ?? [];
    const _subscribes = this._subscribes;
    for (const subscribe of datas) {
      if (
        subscribe.feiyu !== 'subscribe' ||
        subscribe.config?.feiyu !== 'config'
      ) {
        // 未知参数
        continue;
      }
      const link = subscribe.link;
      // 不能重名
      let newKey = subscribe.key ?? '未知订阅';
      if (_subscribes[newKey]) {
        while (_subscribes[newKey]) {
          newKey = newKey + '(重名)';
        }
      }
      subscribe.key = newKey;
      // 不能重复添加相同的订阅源
      const subscribeKeys = Object.values(_subscribes);
      const sameLink =
        isNotEmpty(link) && subscribeKeys.find((e) => e.link === link);
      if (sameLink) {
        continue; // 跳过已添加的订阅源
      }
      // 导入订阅
      const success = await subscribeStorage.set(newKey, subscribe);
      if (success) {
        _subscribes[newKey] = subscribe;
        successItems += 1;
      }
    }
    if (successItems > 0) {
      // 更新状态
      this._updateStore({
        subscribes: _subscribes,
      });
    }
    return successItems;
  }

  /**
   * 添加订阅
   */
  async addSubscribe(key: string, link: string) {
    await this.init();
    // 不能重名
    if (this._subscribes[key]) {
      return '订阅已存在，请重命名';
    }
    // 不能重复添加相同的订阅源
    const subscribes = Object.values(this._subscribes);
    const sameLink =
      isNotEmpty(link) && subscribes.find((e) => e.link === link);
    if (sameLink) {
      return `订阅已存在，请先删除：${sameLink.key}`;
    }
    // 查询订阅地址
    const config = await http.proxy.get(link, undefined, { cache: false });
    if (config?.feiyu === 'config') {
      // 更新订阅
      const newData = {
        feiyu: 'subscribe' as any,
        key,
        link,
        lastUpdate: timestamp(),
        config,
      };
      const success = await subscribeStorage.set(key, newData);
      if (success) {
        const _subscribes = this._subscribes;
        _subscribes[key] = newData;
        // 更新状态
        this._updateStore({
          subscribes: _subscribes,
        });
        return '添加成功';
      }
    }
    return '获取配置信息失败';
  }

  /**
   * 刷新单个订阅
   */
  async refreshSubscribe(key: string) {
    await this.init();
    const old = this._subscribes[key];
    if (old) {
      const link = old.link;
      if (!link) {
        // 本地配置，无需刷新
        return true;
      }
      const config = await http.proxy.get(link, undefined, { cache: false });
      if (config?.feiyu === 'config') {
        // 更新订阅
        const newData = {
          feiyu: 'subscribe' as any,
          key,
          link,
          lastUpdate: timestamp(),
          config,
        };
        const success = await subscribeStorage.set(key, newData);
        if (success) {
          const _subscribes = this._subscribes;
          _subscribes[key] = newData;
          // 更新状态
          this._updateStore({
            subscribes: _subscribes,
          });
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 编辑单个订阅（本地配置，暂不支持重命名）
   */
  async editSubscribe(subscribe: Subscribe) {
    await this.init();
    const key = subscribe.key;
    const old = this._subscribes[key];
    if (old) {
      const newData = {
        ...subscribe,
        lastUpdate: timestamp(),
      };
      const success = await subscribeStorage.set(key, newData);
      if (success) {
        const _subscribes = this._subscribes;
        _subscribes[key] = newData;
        // 更新状态
        this._updateStore({
          subscribes: _subscribes,
        });
        return true;
      }
    }
    return false;
  }

  /**
   * 刷新全部订阅
   */
  async refreshAll() {
    await this.init();
    await Promise.all(
      Object.keys(this._subscribes).map((key) => this.refreshSubscribe(key)),
    );
  }

  /**
   * 删除订阅
   */
  async remove(key: string) {
    await this.init();
    const success = await subscribeStorage.remove(key);
    if (success) {
      const _subscribes = this._subscribes;
      delete _subscribes[key];
      if (!_subscribes[ConfigManager.defaultKey]) {
        _subscribes[ConfigManager.defaultKey] = ConfigManager.defaultConfig;
      }
      // 重置为默认值
      const flag = await this.setCurrent(ConfigManager.defaultKey);
      if (flag) {
        // 更新状态
        this._updateStore({
          subscribes: _subscribes,
          currentSubscribe: ConfigManager.defaultKey,
        });
        return true;
      }
    }
    return false;
  }

  /**
   * 清空订阅
   */
  async clear() {
    await this.init();
    const success = await subscribeStorage.clear();
    if (success) {
      // 重置为默认值
      const flag = await this.setCurrent(ConfigManager.defaultKey);
      if (flag) {
        // 更新状态
        this._updateStore({
          subscribes: {
            [ConfigManager.defaultKey]: ConfigManager.defaultConfig,
          },
          currentSubscribe: ConfigManager.defaultKey,
        });
        return true;
      }
    }
    return false;
  }

  /**
   * 选择当前订阅
   */
  async setCurrent(key: string) {
    await this.init();
    // 确保本地存在当前订阅
    if (this._subscribes[key]) {
      const success = await subscribeStorage.setCurrent(key);
      if (success) {
        // 更新状态
        this._updateStore({
          currentSubscribe: key,
        });
        return true;
      }
    }
    return false;
  }
}

export const configs = new ConfigManager();
