import { useEffect } from 'react';

import { useInit } from '@/hooks/useInit';
import { useLLocation } from '@/services/routes/location';
import { NavigateOption, router } from '@/services/routes/router';
import { lastOf } from '@/utils/base';
import { isNotEqual } from '@/utils/diff';
import { isNotEmpty } from '@/utils/is';

export interface RoutePage {
  key: string;
  pageBuilder: () => any;
  icon?: any;
  title?: string;
}

export interface IndexPageOption {
  /**
   * /path/to/parent/
   */
  parent?: string;
  /**
   * 首页
   */
  index?: string;
}

export const getPageBuilder = (modules: any, page: string) => async () =>
  (await modules[`./${page}/index.tsx`]()).default;

/**
 * 获取上个页面传递给当前页面的路由参数
 *
 * /path/to/page
 */
export const usePage = (path: string) => {
  // 监听 location 变化时，刷新界面
  const [location] = useLLocation();
  const page = useInit(() => {
    return router.pages
      .slice()
      .reverse()
      .find((e) => e.path === path);
  }, [...router.history]);
  const query =
    location === path
      ? router.currentQuery // 当前页面使用新 query
      : page?.query ?? {}; // 历史 query
  return { query, data: page?.data, isActive: location === path };
};

export const usePages = (
  props?: IndexPageOption & {
    keepHistory?: boolean;
  },
) => {
  const { parent = '/', keepHistory = true, index } = props ?? {};
  let _parent = parent;
  if (!parent.endsWith('/')) {
    _parent = parent + '/';
  }
  const layers = _parent.split('/').length - 1;
  const location = useLLocation()[0];
  let currentPage = location.split('/')[layers] ?? '/';
  // 当前页面不在 parent 页面时
  if (keepHistory && !lastOf(router.history)?.startsWith(_parent)) {
    // 找到 parent 页面最后一个浏览的子页面（确保最后一个 tab 始终激活）
    const lastSubPage = router.history
      .slice()
      .reverse()
      .find((e) => e.startsWith(_parent));
    if (lastSubPage) {
      currentPage = lastSubPage;
    }
  }

  function jumpToPage<R = any>(
    key: string,
    options?: Pick<NavigateOption, 'data' | 'query' | 'replace'> & {
      keepHistory?: boolean;
    },
  ) {
    const {
      replace,
      data: _data,
      query: _query = {},
      keepHistory = true,
    } = options ?? {};
    let path = _parent + key;
    let data = _data;
    let query = _query;
    // 当从其他父页面跳转回 parent
    if (
      keepHistory &&
      !(isNotEmpty(data) || isNotEmpty(query)) && // 不能携带参数给上次浏览的子页面（因为不知道是哪个页面）
      !lastOf(router.history)?.startsWith(_parent) // 不在当前父页面的子页面
    ) {
      // 找到当前页面最后一个浏览的子页面
      const lastSubPage = router.pages
        .slice()
        .reverse()
        .find((e) => e.path.startsWith(_parent));
      if (lastSubPage) {
        path = lastSubPage.path;
        data = lastSubPage.data;
        query = lastSubPage.query as any;
      }
    }
    const currentConfig = {
      path: router.current,
      data: router.currentData,
      query: router.currentQuery,
    };
    const jumpConfig = {
      path,
      data,
      query,
    };
    if (isNotEqual(currentConfig, jumpConfig)) {
      if (replace) {
        return router.replace<R>(path, {
          data,
          query,
        });
      } else {
        return router.push<R>(path, {
          data,
          query,
        });
      }
    }
  }

  return {
    location,
    currentPage,
    jumpToPage,
    isIndexPage: currentPage === index,
    jumpToIndex<R = any>(
      options?: Pick<NavigateOption, 'data' | 'query' | 'replace'> & {
        keepHistory?: boolean;
      },
    ) {
      if (!index) return; // 没有设置主页
      return jumpToPage<R>(index, options);
    },
  };
};

/**
 * 当没有在其他子页面时，默认转到首页
 */
export const useFallbackToIndex = (
  pages: RoutePage[],
  props?: IndexPageOption,
) => {
  const { parent = '/', index } = props ?? {};
  const { jumpToIndex, location, currentPage } = usePages({
    ...props,
    index: index ?? pages[0].key,
  });
  useEffect(() => {
    let _location = location;
    if (!_location.endsWith('/')) {
      _location = _location + '/';
    }
    if (
      _location.startsWith(parent) &&
      !pages.find((e) => e.key === currentPage)
    ) {
      jumpToIndex({ replace: true });
    }
  }, [location]);
};
