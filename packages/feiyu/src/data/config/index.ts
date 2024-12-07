import { XSta } from 'xsta';

import { http } from '@/services/http';
import { storage } from '@/services/storage/storage';
import { jsonDecode, timestamp } from '@/utils/base';
import { clipboard } from '@/utils/clipborad';
import { deepClone } from '@/utils/clone';
import { isArray, isNotEmpty, isObject, isValidUrl } from '@/utils/is';

import { version } from '../../../package.json';
import defaultConfig from '../default';
import { subscribeStorage } from './storage';
import { Subscribe } from './types';

export interface SubscribesStore {
  current: string; // 当前选中的订阅名称
  subscribes: Record<string, Subscribe>; //订阅列表
  adultContent: boolean; // 展示伦理片
  movieCommentaries: boolean; // 展示电影解说
}

export const kSubscribesKey = 'kSubscribesKey';

export const isValidSubscribe = (subscribe: any) => {
  return (
    isNotEmpty(subscribe?.version) &&
    isNotEmpty(subscribe?.name) &&
    isObject(subscribe.feiyu) &&
    isArray(subscribe.feiyu.videoSources) &&
    subscribe.feiyu.videoSources.length > 0 // 至少需要一个视频源才能正常使用
  );
};

export const kDefaultSubscribeName = '默认订阅';
export class APPConfig {
  static version = version;

  updateStore(data: Partial<SubscribesStore>) {
    const old = XSta.get<SubscribesStore>(kSubscribesKey) ?? {};
    XSta.set(kSubscribesKey, { ...old, ...data });
  }

  get adultContent() {
    return storage.get('adultContent');
  }
  get movieCommentaries() {
    return storage.get('movieCommentaries');
  }

  toggleAllowAdultContent() {
    const flag = !this.adultContent;
    storage.set('adultContent', flag);
    this.updateStore({
      adultContent: flag,
    });
  }

  toggleAllowMovieCommentaries() {
    const flag = !this.movieCommentaries;
    storage.set('movieCommentaries', flag);
    this.updateStore({
      movieCommentaries: flag,
    });
  }

  getSubscribes() {
    const origin = XSta.get<SubscribesStore>(kSubscribesKey)?.subscribes ?? {};
    return deepClone<Record<string, Subscribe>>(origin);
  }

  get currentSubscribeName() {
    return (
      XSta.get<SubscribesStore>(kSubscribesKey)?.current ??
      kDefaultSubscribeName
    );
  }

  async currentSubscribe() {
    await this.init();
    return this.getSubscribes()[subscribeStorage.current()!];
  }

  async get() {
    const config = await this.currentSubscribe();
    return config.feiyu;
  }

  /**
   * 获取默认订阅配置
   */
  private async getDefaultSubscribe(): Promise<Subscribe> {
    let defaultSubscribe = await subscribeStorage.get(kDefaultSubscribeName);
    if (defaultSubscribe) {
      return defaultSubscribe;
    }
    const server = window.location.origin + '/feiyu.json';
    const res = await http.get(server, undefined, { timeout: 1000 });
    if (isValidSubscribe(res)) {
      defaultSubscribe = {
        ...res,
        name: kDefaultSubscribeName,
        lastUpdate: timestamp(),
      };
    } else {
      defaultSubscribe = {
        version: APPConfig.version,
        name: kDefaultSubscribeName,
        lastUpdate: timestamp(),
        feiyu: defaultConfig,
      };
    }
    await subscribeStorage.set(kDefaultSubscribeName, defaultSubscribe!);
    return defaultSubscribe!;
  }

  /**
   * 初始化订阅列表
   */
  initialized = false;
  private _initializationPromise;
  async init() {
    if (this.initialized) {
      return; // 只从本地初始化一次
    }
    if (!this._initializationPromise) {
      this._initializationPromise = new Promise((resolve) => {
        this._init().then((data) => {
          resolve(data);
          this.initialized = true;
        });
      });
    }
    return this._initializationPromise;
  }
  async _init() {
    // 初始化默认配置
    await this.getDefaultSubscribe();
    // 加载本地订阅配置
    let current = subscribeStorage.current();
    if (!current) {
      current = kDefaultSubscribeName;
      await subscribeStorage.setCurrent(current);
    }
    const subscribes = (await subscribeStorage.getAll()).reduce((pre, s) => {
      return { ...pre, [s.name]: s };
    }, {});
    // 初始化依赖
    this.updateStore({
      current,
      subscribes,
      adultContent: this.adultContent,
      movieCommentaries: this.movieCommentaries,
    });
    // 异步刷新所有订阅
    this.refreshAll();
  }

  /**
   * 导出单个订阅
   */
  async exportSubscribe(subscribe: Subscribe) {
    await this.init();
    return clipboard.writeJSON(subscribe);
  }

  /**
   * 批量导出订阅
   */
  async exportSubscribes() {
    await this.init();
    return clipboard.writeJSON(this.getSubscribes());
  }

  /**
   * 导入订阅 (返回导入成功个数)
   */
  async importSubscribes(data: string) {
    await this.init();
    let subscribes: Subscribe[] = [];
    let result: any;
    const url = isValidUrl(data) ? data : undefined;
    if (url) {
      result = await http.get(url, undefined, {
        cache: false,
      });
    } else {
      result = jsonDecode(data);
    }
    if (isArray(result)) {
      subscribes = result;
    } else {
      subscribes = [result];
    }
    subscribes = subscribes.filter(isValidSubscribe);
    let successItems = 0;
    const currentSubscribes = this.getSubscribes();
    for (const subscribe of subscribes) {
      const server = subscribe.server;
      // 不能重名
      let newName = subscribe.name ?? '未知订阅';
      while (currentSubscribes[newName]) {
        newName = newName + '(重名)';
      }
      subscribe.name = newName;
      // 不重复添加相同的订阅源
      const alreadySubscribed =
        isNotEmpty(server) &&
        Object.values(currentSubscribes).find((e) => e.server === server);
      if (alreadySubscribed) {
        continue; // 跳过已添加的订阅源
      }
      // 导入订阅
      const success = await subscribeStorage.set(newName, subscribe);
      if (success) {
        currentSubscribes[newName] = subscribe;
        successItems += 1;
      }
    }
    if (successItems > 0) {
      this.updateStore({ subscribes: currentSubscribes });
    }
    return successItems;
  }

  /**
   * 刷新单个订阅
   */
  async refreshSubscribe(name: string) {
    await this.init();
    const currentSubscribes = this.getSubscribes();
    const old = currentSubscribes[name];
    if (old) {
      let server = old.server;
      if (!server) {
        // 本地配置，无需刷新
        return true;
      }
      let subscribe = await http.get(server, undefined, {
        cache: false,
      });
      if (isValidSubscribe(subscribe)) {
        // 检查 server 是否需要更新（默认不更新）
        if (isNotEmpty(subscribe.server) && subscribe.server !== server) {
          if (
            isValidSubscribe(
              await http.get(subscribe.server, undefined, {
                cache: false,
              }),
            )
          ) {
            server = subscribe.server;
          }
        }
        // 更新订阅
        subscribe = {
          ...subscribe,
          server,
          name: old.name, // 使用原来的订阅名称
          lastUpdate: timestamp(),
        };
        const success = await subscribeStorage.set(name, subscribe);
        if (success) {
          currentSubscribes[name] = subscribe;
          this.updateStore({ subscribes: currentSubscribes });
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 编辑单个订阅
   */
  async editSubscribe(oldSubscribe: Subscribe, newSubscribe: Subscribe) {
    await this.init();
    newSubscribe = {
      ...newSubscribe,
      lastUpdate: timestamp(),
    };
    await subscribeStorage.remove(oldSubscribe.name);
    const success = await subscribeStorage.set(newSubscribe.name, newSubscribe);
    if (success) {
      const currentSubscribes = this.getSubscribes();
      delete currentSubscribes[oldSubscribe.name];
      currentSubscribes[newSubscribe.name] = newSubscribe;
      const flag = await this.setCurrent(newSubscribe.name);
      if (flag) {
        this.updateStore({ subscribes: currentSubscribes });
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
      Object.keys(this.getSubscribes()).map((name) =>
        this.refreshSubscribe(name),
      ),
    );
  }

  /**
   * 删除订阅
   */
  async remove(name: string) {
    await this.init();
    const success = await subscribeStorage.remove(name);
    if (success) {
      const currentSubscribes = this.getSubscribes();
      delete currentSubscribes[name];
      // 重置为默认订阅
      const flag = await this.setCurrent(kDefaultSubscribeName);
      if (flag) {
        this.updateStore({
          subscribes: currentSubscribes,
          current: kDefaultSubscribeName,
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
    // 确保存在当前订阅
    if (this.getSubscribes()[name]) {
      const success = await subscribeStorage.setCurrent(name);
      if (success) {
        this.updateStore({ current: name });
        return true;
      }
    }
    return false;
  }
}

export const appConfig = new APPConfig();
