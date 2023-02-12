import { storage } from '@/services/storage/storage';

import { Subscribe } from './types';

let localSubscribeStore;
const _currentSubscribeKey = 'currentSubscribe';
export const subscribeStorage = {
  current(): string | undefined {
    return storage.get(_currentSubscribeKey);
  },
  setCurrent(key: string) {
    return storage.set(_currentSubscribeKey, key);
  },
  async init() {
    if (!localSubscribeStore) {
      const localforage = (await import('localforage')).default;
      localSubscribeStore = localforage.createInstance({
        name: 'feiyu',
        storeName: 'subscribe',
        driver: localforage.INDEXEDDB,
      });
    }
  },
  async get(key: string): Promise<Subscribe | undefined> {
    await subscribeStorage.init();
    return await localSubscribeStore.getItem(key).catch(() => undefined);
  },
  async set(key: string, subscribe: Subscribe): Promise<boolean> {
    await subscribeStorage.init();
    const result = await localSubscribeStore
      .setItem(key, subscribe)
      .catch(() => 'failed');
    return result !== 'failed';
  },
  async getAll(): Promise<Subscribe[]> {
    await subscribeStorage.init();
    const keys = await localSubscribeStore.keys().catch(() => []);
    const results = await Promise.all(
      keys.map((key) => subscribeStorage.get(key)),
    );
    // 筛选非空的订阅
    return results.filter((e) => !e);
  },
  async remove(key: string): Promise<boolean> {
    await subscribeStorage.init();
    const result = await localSubscribeStore
      .removeItem(key)
      .catch(() => 'failed');
    return result !== 'failed';
  },
  async clear(): Promise<boolean> {
    await subscribeStorage.init();
    const result = await localSubscribeStore.clear().catch(() => 'failed');
    return result !== 'failed';
  },
};
