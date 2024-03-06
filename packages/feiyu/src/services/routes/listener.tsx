import { useEffect } from 'react';

import { useInit } from '@/hooks/useInit';
import { ArrayElement } from '@/utils/types';

import { getLocation, useInitLocationListener } from './location';
import { router } from './router';

type RouteEvent = ArrayElement<
  ['popstate', 'pushState', 'replaceState', 'hashchange']
>;

export const kRoutEvents: RouteEvent[] = [
  'popstate',
  'pushState',
  'replaceState',
  'hashchange',
];

export const useListenLocationUpdates = (callback: (event: any) => void) => {
  useEffect(() => {
    for (const event of kRoutEvents) {
      addEventListener(event, callback);
    }
    return () => {
      for (const event of kRoutEvents) {
        removeEventListener(event, callback);
      }
    };
  }, []);
};

const getPath = (url: URL) => {
  return getLocation(url.pathname, url.hash);
};
export const useRouterInit = () => {
  useInit(() => {
    router.init();
  });
  // 路由变化监听（轮询）
  useInitLocationListener();
  // 路由变化监听（响应式）
  useListenLocationUpdates((event: any) => {
    let to: string | undefined = '/';
    switch (event.type) {
      case 'pushState':
        router.push(getLocation(event.arguments[2]), {
          query: router.currentQuery,
          action: false,
        });
        break;
      case 'replaceState':
        router.pop(undefined, { action: false });
        router.push(getLocation(event.arguments[2]), {
          query: router.currentQuery,
          action: false,
          replace: true,
        });
        break;
      case 'hashchange':
        to = getPath(new URL(event.newURL));
        if (to === router.prePage) {
          // 后退
          router.pop(undefined, { action: false });
        }
        if (to !== router.prePage) {
          // 前进
          router.push(to, {
            query: router.currentQuery,
            action: false,
          });
        }
        break;
      case 'popstate':
        if (router.hash) {
          // popstate 可能是页面前进或后退，都会造成 hashchange
          break;
        }
        to = getPath(new URL(event.target.location.href));
        if (to === router.prePage) {
          // 后退
          router.pop(undefined, { action: false });
        }
        if (to !== router.prePage) {
          // 前进
          router.push(to, {
            query: router.currentQuery,
            action: false,
          });
        }
        break;
      default:
        break;
    }
  });
};
