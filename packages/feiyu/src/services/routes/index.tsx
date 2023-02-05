import { useEffect } from 'react';
import { Router } from 'wouter';

import { BoxProps } from '@/components/Box';
import { AsyncBuilder, TabPages } from '@/components/Tab';
import { TabPageController } from '@/components/Tab/state';
import { store, useInit, useProvider } from '@/services/store/useStore';
import { flattenChildren } from '@/utils/flatten';

import { useRouterInit } from './listener';
import { multipathMatcher, useLLocation } from './location';
import { router } from './router';

const _lRoutesKey = (key: string, id = '0') => `LRoutes-${key}-${id}`;
/**
 * key 为当前 LRoutes 的 parent
 */
export const getLRoutesController = (key: string, id = '0') =>
  store.get<TabPageController>(_lRoutesKey(key, id));

export const LRouter = (
  props: BoxProps & { base?: string; hash?: boolean },
) => {
  const { base = '/', hash = true } = props;
  router.base = base;
  router.hash = hash;
  // 初始化 router
  useRouterInit();
  return (
    <Router hook={useLLocation as any} matcher={multipathMatcher as any}>
      {props.children}
    </Router>
  );
};

export const LRoutes = (props: {
  children: any[];
  /**
   * /path/of/parent/
   */
  parent?: string;
  id?: string;
  keepalive?: boolean;
}) => {
  const { parent: _parent = '/', id, keepalive = true, children } = props;
  let parent = _parent;
  if (!_parent.endsWith('/')) {
    parent = _parent + '/';
  }
  // 合并子元素中的嵌套列表
  const items = flattenChildren(children);
  const pages: { key: string; pageBuilder: () => any }[] = items.map((e) => ({
    key: e.props.path,
    pageBuilder: e.props.builder,
  }));
  // 解析当前 match 的页面（默认 fallback 到第一个页面）
  const [location] = useLLocation();
  const current =
    pages.find((e) => location.startsWith(parent + e.key)) ?? pages[0];
  if (!keepalive) {
    return <AsyncBuilder builder={current.pageBuilder} inited={true} />;
  }
  // 创建 Tab Controller
  const key = _lRoutesKey(parent, id);
  const controller = useInit(
    () =>
      new TabPageController({
        key,
        pages,
      }),
  );
  useProvider(key, controller);
  useEffect(() => {
    controller.jumpTo(current.key);
  }, [current.key]);
  return <TabPages controller={controller} currentPage={current.key} />;
};

export const LRoute = (_p: { path: string; builder: () => any }) => {
  return <div />;
};
