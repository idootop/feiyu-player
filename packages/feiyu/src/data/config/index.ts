import { XSta } from 'xsta';

import { http } from '@/services/http';
import { ipfs, ipfsURL } from '@/services/ipfs';
import { storage } from '@/services/storage/storage';
import { jsonDecode, timestamp } from '@/utils/base';
import { deepClone } from '@/utils/clone';
import { isArray, isNotEmpty, isObject, isValidUrl } from '@/utils/is';

import defaultConfig from '../default';
import { subscribeStorage } from './storage';
import { FeiyuConfig, Subscribe } from './types';

export interface SubscribesStore {
  currentSubscribe: string;
  subscribes: Record<string, Subscribe>;
  allowSexy: boolean; // 不过滤伦理片
  allowMovieCommentary: boolean; // 不过滤电影解说
}

export const kSubscribesKey = 'kSubscribesKey';

export const isValidSubscribe = (subscribe: any) => {
  return (
    isNotEmpty(subscribe?.version) &&
    isNotEmpty(subscribe?.name) &&
    isObject(subscribe.feiyu) &&
    isArray(subscribe.feiyu.searchProviders) &&
    subscribe.feiyu.searchProviders.length > 0 // 至少需要一个搜索源才能正常使用
  );
};

export class APPConfig {
  static version = '1.0.0';
  static defaultName = '默认订阅';
  static defaultConfig: Subscribe = {
    version: APPConfig.version,
    name: APPConfig.defaultName,
    feiyu: defaultConfig as any,
    lastUpdate: 1709781073831,
  };

  private get _subscribes() {
    const origin = XSta.get<SubscribesStore>(kSubscribesKey)?.subscribes ?? {};
    return deepClone<Record<string, Subscribe>>(origin);
  }

  get subscribes() {
    return this._subscribes;
  }

  private get _currentSubscribe() {
    return (
      XSta.get<SubscribesStore>(kSubscribesKey)?.currentSubscribe ??
      APPConfig.defaultName
    );
  }

  private _updateStore(data: Partial<SubscribesStore>) {
    const old = XSta.get<SubscribesStore>(kSubscribesKey) ?? {};
    XSta.set(kSubscribesKey, {
      ...old,
      ...data,
    });
  }

  get current(): FeiyuConfig {
    this.init(); // 被动初始化
    return this._subscribes[this._currentSubscribe]?.feiyu ?? defaultConfig;
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

  initialized = false;
  /**
   * 初始化订阅列表
   */
  async init() {
    const _subscribes = this._subscribes;
    if (this.initialized) {
      return; // 只从本地初始化一次
    }
    this.initialized = true;
    // 添加默认配置
    _subscribes[APPConfig.defaultName] = APPConfig.defaultConfig;
    // 加载本地订阅配置
    const subscribes = await subscribeStorage.getAll();
    subscribes.forEach((e) => {
      _subscribes[e.name] = e;
    });
    // 从本地读取当前使用的配置记录
    let _currentSubscribe = APPConfig.defaultName;
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
   * 导出单个订阅
   */
  async exportSubscribe(name: string) {
    await this.init();
    const subscribe = this._subscribes[name];
    if (!subscribe) return false;
    const cid = await ipfs.writeJson([subscribe], true);
    return cid ? ipfsURL(cid) : undefined;
  }

  /**
   * 批量导出订阅
   */
  async exportSubscribes() {
    await this.init();
    // 逆向导出订阅列表（导入时恢复原顺序）
    const subscribes = Object.values(this._subscribes).reverse();
    const cid = await ipfs.writeJson(subscribes, true);
    return cid ? ipfsURL(cid) : undefined;
  }

  /**
   * 导入订阅 (返回导入成功个数)
   */
  async importSubscribes(data: string) {
    await this.init();
    let subscribes: Subscribe[] = [];
    const url = isValidUrl(data) ? data : undefined;
    if (url) {
      const res = await http.proxy.get(url, undefined, {
        cache: false,
      });
      if (isArray(res)) {
        subscribes = res;
      }
    } else {
      subscribes = [jsonDecode(data)];
    }
    subscribes = subscribes.filter(isValidSubscribe);
    let successItems = 0;
    const _subscribes = this._subscribes;
    for (const subscribe of subscribes) {
      const upstream = subscribe.upstream;
      // 不能重名
      let newName = subscribe.name ?? '未知订阅';
      while (_subscribes[newName]) {
        newName = newName + '(重名)';
      }
      subscribe.name = newName;
      // 不重复添加相同的订阅源
      const subscribeKeys = Object.values(_subscribes);
      const alreadySubscribed =
        isNotEmpty(upstream) &&
        subscribeKeys.find((e) => e.upstream === upstream);
      if (alreadySubscribed) {
        continue; // 跳过已添加的订阅源
      }
      // 导入订阅
      const success = await subscribeStorage.set(newName, subscribe);
      if (success) {
        _subscribes[newName] = subscribe;
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
   * 刷新单个订阅
   */
  async refreshSubscribe(name: string) {
    await this.init();
    const old = this._subscribes[name];
    if (old) {
      const upstream = old.upstream;
      if (!upstream) {
        // 本地配置，无需刷新
        return true;
      }
      let subscribe = await http.proxy.get(upstream, undefined, {
        cache: false,
      });
      if (isValidSubscribe(subscribe)) {
        // 更新订阅
        subscribe = {
          ...subscribe,
          name: old.name, // 不更新原来的名称
          lastUpdate: timestamp(),
        };
        const success = await subscribeStorage.set(name, subscribe);
        if (success) {
          const _subscribes = this._subscribes;
          _subscribes[name] = subscribe;
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
  async editSubscribe(oldSubscribe: Subscribe, newSubscribe: Subscribe) {
    await this.init();
    const currentSubscribe = subscribeStorage.current();
    // 当订阅名称发生变化时，需要更新当前的订阅的
    const needUpdateCurrent =
      oldSubscribe.name != newSubscribe.name &&
      currentSubscribe === newSubscribe.name;
    newSubscribe = {
      ...newSubscribe,
      lastUpdate: timestamp(),
    };
    await subscribeStorage.remove(oldSubscribe.name);
    const success = await subscribeStorage.set(newSubscribe.name, newSubscribe);
    if (success) {
      const _subscribes = this._subscribes;
      delete _subscribes[oldSubscribe.name];
      _subscribes[newSubscribe.name] = newSubscribe;
      // 更新状态
      if (needUpdateCurrent) {
        const flag = await this.setCurrent(newSubscribe.name);
        if (flag) {
          this._updateStore({
            subscribes: _subscribes,
          });
          return true;
        }
      } else {
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
      Object.keys(this._subscribes).map((name) => this.refreshSubscribe(name)),
    );
  }

  /**
   * 删除订阅
   */
  async remove(name: string) {
    await this.init();
    const success = await subscribeStorage.remove(name);
    if (success) {
      const _subscribes = this._subscribes;
      delete _subscribes[name];
      if (!_subscribes[APPConfig.defaultName]) {
        _subscribes[APPConfig.defaultName] = APPConfig.defaultConfig;
      }
      // 重置为默认值
      const flag = await this.setCurrent(APPConfig.defaultName);
      if (flag) {
        // 更新状态
        this._updateStore({
          subscribes: _subscribes,
          currentSubscribe: APPConfig.defaultName,
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
      const flag = await this.setCurrent(APPConfig.defaultName);
      if (flag) {
        // 更新状态
        this._updateStore({
          subscribes: {
            [APPConfig.defaultName]: APPConfig.defaultConfig,
          },
          currentSubscribe: APPConfig.defaultName,
        });
        return true;
      }
    }
    return false;
  }

  /**
   * 选择当前订阅
   */
  async setCurrent(name: string) {
    await this.init();
    // 确保本地存在当前订阅
    if (this._subscribes[name]) {
      const success = await subscribeStorage.setCurrent(name);
      if (success) {
        // 更新状态
        this._updateStore({
          currentSubscribe: name,
        });
        return true;
      }
    }
    return false;
  }
}

export const appConfig = new APPConfig();
