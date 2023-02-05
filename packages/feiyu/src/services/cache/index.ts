let localStore;

let _caches: Record<string, { expiredTime: number; data: any }> = {};

export const cache = {
  cacheDuration: 24 * 60 * 60 * 1000,
  async init() {
    if (!localStore) {
      const localforage = (await import('localforage')).default;
      localStore = localforage.createInstance({
        name: 'feiyu',
        storeName: 'cache',
        driver: localforage.INDEXEDDB,
      });
    }
  },
  async get<T = any>(key: string): Promise<T | undefined> {
    await cache.init();
    const _cache =
      _caches[key] ?? (await localStore.getItem(key).catch(() => undefined));
    if (!_cache) return undefined;
    const expired = Date.now() > _cache.expiredTime;
    if (!expired) return _cache.data;
  },
  /**
   * 默认 data 为空时不更新值，可使用 force 强制更新空值
   */
  async set(
    key: string,
    data: any,
    config?: { force?: boolean; cacheDuration?: number },
  ) {
    await cache.init();
    const { force, cacheDuration = cache.cacheDuration } = config ?? {};
    if (force || data) {
      _caches[key] = {
        data: data,
        expiredTime: Date.now() + cacheDuration,
      };
      await localStore.setItem(key, _caches[key]).catch(() => undefined);
    }
  },
  /**
   * 清除已过期的缓存
   */
  async clearExpired() {
    await cache.init();
    let keys = await localStore.keys().catch(() => []);
    const expiredKeys: string[] = [];
    // 找到内存中已过期的 key
    const currentKeys = Object.keys(_caches);
    currentKeys.forEach((key) => {
      const _cache = _caches[key];
      if (Date.now() > (_cache?.expiredTime ?? 0)) {
        expiredKeys.push(key);
      }
    });
    // 找到本地存储中已过期的 key
    keys = keys.filter((e) => !currentKeys.includes(e));
    await Promise.all(
      keys.map((key) => {
        (async () => {
          const _cache: any = await localStore
            .getItem(key)
            .catch(() => undefined);
          if (Date.now() > (_cache?.expiredTime ?? 0)) {
            expiredKeys.push(key);
          }
        })();
      }),
    );
    // 清空本地和内存中过期的 key
    await Promise.all(
      expiredKeys.map((key) =>
        (async () => {
          delete _caches[key];
          await localStore.removeItem(key).catch(() => undefined);
        })(),
      ),
    );
  },
  /**
   * 清除缓存
   */
  async reset() {
    await cache.init();
    _caches = {};
    await localStore.clear().catch(() => undefined);
  },

  async readOrWrite<R = any>(
    cacheKey: string,
    onWrite: () => Promise<R | undefined>,
    cacheEmpty?: boolean,
  ): Promise<R | undefined> {
    const cacheData = await cache.get(cacheKey);
    if (cacheEmpty ? cacheData : cacheData?.data) {
      return cacheData.data;
    }
    const data = await onWrite();
    cache.set(cacheKey, { data });
    return data;
  },
};
