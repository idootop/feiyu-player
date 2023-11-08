import fetch from 'isomorphic-unfetch';

import { configs } from '@/data/config/manager';
import { AbortConfig } from '@/utils/abort';
import { jsonDecode, jsonEncode } from '@/utils/base';
import { isNotEmpty, isObject } from '@/utils/is';
import pTimeout from '@/utils/p-timeout';

import { cache } from '../cache';

const kProxyKey = 'x-proxy-target';
const kProxyHeadersKey = 'x-proxy-headers';
const kBaseHeaders = {
  [kProxyHeadersKey]: jsonEncode({
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0',
  })!,
};

const _buildURL = (url: string, query?: Record<string, any>) => {
  const _url = new URL(url);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (isNotEmpty(value)) {
      _url.searchParams.append(key, value.toString());
    }
  }
  return _url.href;
};

type HttpConfig = {
  timeout?: number;
  headers?: Record<string, string>;
  cache?: boolean;
  /**
   * 是否缓存空值
   */
  cacheEmpty?: boolean;
  cacheDuration?: number;
  cacheKey?: string;
  blob?: boolean;
} & AbortConfig;

const get = async (
  url: string,
  query?: Record<string, any>,
  config?: HttpConfig,
) => {
  const {
    timeout = http.timeout,
    headers = {},
    signal,
    cache: _cache = true,
    cacheEmpty,
    cacheDuration,
    cacheKey: _cacheKey,
  } = config ?? {};
  const newUrl = _buildURL(url, query);
  const cacheKey =
    _cacheKey ??
    jsonEncode({
      url: newUrl,
      headers,
    }) ??
    '404';
  if (_cache) {
    const cacheData = await cache.get(cacheKey);
    if (cacheEmpty ? cacheData : cacheData?.data) {
      return cacheData.data;
    }
  }
  const response = await pTimeout(
    fetch(newUrl, {
      method: 'GET',
      headers: {
        ...headers,
      },
      signal,
    }).catch((e) => {
      if (!e.message?.includes('aborted')) {
        console.error('❌ 网络异常：', e);
      }
      return undefined;
    }),
    timeout,
  ).catch(() => {
    console.error('🕙 请求超时');
    return undefined;
  });
  let result = await response?.text();
  result = jsonDecode(result) ?? result;
  if (_cache) {
    cache.set(cacheKey, { data: result }, { cacheDuration });
  }
  return result;
};

const post = async (url: string, data?: any, config?: HttpConfig) => {
  const {
    timeout = http.timeout,
    headers = {},
    signal,
    cache: _cache = true,
    cacheEmpty,
    cacheDuration,
    blob,
    cacheKey: _cacheKey,
  } = config ?? {};
  const body = !blob && isObject(data) ? jsonEncode(data) : data;
  const cacheKey =
    _cacheKey ??
    jsonEncode({
      url,
      headers,
      body,
    }) ??
    '404';
  if (_cache) {
    const cacheData = await cache.get(cacheKey);
    if (cacheEmpty ? cacheData : cacheData?.data) {
      return cacheData.data;
    }
  }
  const response = await pTimeout(
    fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body,
      signal,
    }).catch((e) => {
      if (!e.message?.includes('aborted')) {
        console.error('❌ 网络异常：', e);
      }
      return undefined;
    }),
    timeout,
  ).catch(() => {
    console.error('🕙 请求超时');
    return undefined;
  });
  let result = await response?.text();
  result = jsonDecode(result) ?? result;
  if (_cache) {
    cache.set(cacheKey, { data: result }, { cacheDuration });
  }
  return result;
};

export const isValidProxy = async () => {
  return configs.current.httpProxy
    ? isNotEmpty(await http.get(configs.current.httpProxy))
    : false;
};

export const http = {
  /**
   * 默认超时：5s
   */
  timeout: 5 * 1000,
  get,
  post,
  proxy: {
    /**
     * Proxy 请求默认开启 cache
     */
    get(url: string, query?: Record<string, any>, config?: HttpConfig): any {
      const { headers = {}, cache = true, signal } = config ?? {};
      if (!configs.current.httpProxy) {
        return get(url, query, config);
      }
      return get(configs.current.httpProxy, query, {
        ...config,
        headers: { ...kBaseHeaders, ...headers, [kProxyKey]: url },
        signal,
        cache,
      });
    },
    /**
     * Proxy 请求默认开启 cache
     */
    post(url: string, data?: any, config?: HttpConfig): any {
      const { headers = {}, cache = true, signal } = config ?? {};
      if (!configs.current.httpProxy) {
        return post(url, data, config);
      }
      return post(configs.current.httpProxy, data, {
        ...config,
        headers: { ...kBaseHeaders, ...headers, [kProxyKey]: url },
        signal,
        cache,
      });
    },
  },
};
