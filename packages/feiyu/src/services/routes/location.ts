import makeMatcher from 'wouter/matcher';
import { navigate, useLocationProperty } from 'wouter/use-location';
import { useXConsumer, XSta } from 'xsta';

import { useInit } from '@/hooks/useInit';
import { useInterval } from '@/hooks/useInterval';
import { isEmpty } from '@/utils/is';

import { router } from './router';

const defaultMatcher = makeMatcher();

/*
 * A custom routing matcher function that supports multipath routes
 */
export const multiPathMatcher = (patterns, path) => {
  for (const pattern of [patterns].flat()) {
    const [match, params] = defaultMatcher(pattern, path);
    if (match) return [match, params];
  }

  return [false, null];
};

const _getLocation = (hash: string | undefined) =>
  isEmpty(hash) ? '/' : hash!.replace(/^#/, '').split('?')[0];

/**
 * /path/to/page
 */
export const getLocation = (path?: string, hash?: string) => {
  let _path = router.hash
    ? _getLocation(isEmpty(hash) ? window.location.hash : hash)
    : path ?? window.location.pathname;
  if (_path?.startsWith(router.base)) {
    // 替换 base path
    const base = router.base.replace(/\/$/, '');
    _path = _path!.replace(base, '');
  }
  return isEmpty(_path) ? '/' : _path;
};

/**
 * to: /path/to/page
 */
export const lNavigate = (
  to: string,
  options?: {
    replace?: boolean;
  },
) => {
  // 去掉 basepath 最后的 /
  const base = router.base.replace(/\/$/, '');
  const path = base + (router.hash ? '/#' : '') + to;
  navigate(path, options);
};

export const addSearchParams = (query: Record<string, any>) => {
  const url = new URL(window.location.href.replace('#/', ''));
  const currentQuery = {};
  url.searchParams.forEach((value, key) => {
    currentQuery[key] = value;
  });
  const currentPage = router.currentPage!;
  router.replace(currentPage.path, {
    query: { ...currentQuery, ...query },
    data: currentPage.data,
  });
};

let oldPath;
export const useInitLocationListener = () => {
  useInterval(() => {
    const currentPath = window.location.href;
    if (oldPath !== currentPath) {
      // 路径变更，刷新路由
      refreshLocation();
    }
    oldPath = currentPath;
  }, 100);
};

const kLocationRefresh = 'kLocationRefresh';
export const refreshLocation = () => {
  XSta.set(kLocationRefresh, !XSta.get(kLocationRefresh));
};
export const useLLocation = (): [
  string,
  (
    to: string,
    options?: {
      replace?: boolean | undefined;
    },
  ) => void,
] => {
  useInit(() => {
    if (isEmpty(XSta.get(kLocationRefresh))) {
      XSta.set(kLocationRefresh, false);
    }
  });
  useXConsumer(kLocationRefresh);
  const location = useLocationProperty(getLocation);
  return [location, lNavigate];
};
