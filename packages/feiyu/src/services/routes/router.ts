import { delay, firstOf, lastOf } from '@/utils/base';

import { getLocation, lNavigate } from './location';

export interface NavigateOption {
  data?: any;
  query?: Record<string, any>;
  action?: boolean;
  replace?: boolean;
}

class Router {
  /**
   * 网页 /base/
   */
  base = '/';
  /**
   * 是否使用 hashRoute
   */
  hash = false;
  /**
   * 获取当前页面路径
   *
   * /pages/page
   */
  get current(): string {
    return getLocation();
  }

  /**
   * 获取上个页面传递给当前页面的参数
   */
  get currentData(): any {
    return lastOf(this._pages)?.data;
  }

  /**
   * 当前页面的 query 参数
   */
  get currentQuery(): Record<string, string> {
    const url = new URL(window.location.href.replace('#/', ''));
    const query = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }

  /**
   * 根路由
   */
  get root(): string {
    return firstOf(this._pages)?.path ?? this.current;
  }

  /**
   * 当前是否为根路由
   */
  get isRoot(): boolean {
    return this._pages.length < 1 || this.root === this.current;
  }

  /**
   * 当前路由堆栈
   */
  private _pages: {
    path: string;
    query?: Record<string, string>;
    data: any;
    resolve: any;
  }[] = [];

  get pages() {
    return this._pages;
  }

  get history(): string[] {
    return this._pages.map((e) => e.path);
  }

  get currentPage() {
    return lastOf(this._pages);
  }

  get prePage(): string | undefined {
    return this._pages.length > 1
      ? this._pages[this._pages.length - 2].path
      : undefined;
  }

  init(): void {
    this._pages = [];
    this.push(this.current, {
      query: this.currentQuery,
      action: false,
      init: true,
    });
  }

  /**
   * 打开新页面
   */
  push<R = any>(
    to: string,
    options?: NavigateOption & { init?: boolean },
  ): Promise<R> {
    const { query = {}, action = true, replace, init, data } = options ?? {};
    if (!action && !replace && !init && to === lastOf(this.history)) {
      // 非手动触发的路由变更
      return delay(0) as any;
    }
    // 拼接带 query 的 path
    const origin = window.location.origin;
    const toURL = new URL(origin + to);
    Object.entries(query).forEach(([key, value]) => {
      toURL.searchParams.append(key, value);
    });
    // 解析 query
    const _query = {};
    toURL.searchParams.forEach((value, key) => {
      _query[key] = value;
    });
    const newPathWithQuery = toURL.href.replace(origin, '');
    // 等待下个页面返回数据
    return new Promise((resolve) => {
      this._pages.push({
        path: to,
        query: _query,
        data,
        resolve,
      });
      if (action) {
        // 跳转到新页面
        lNavigate(newPathWithQuery, { replace });
      }
    });
  }

  /**
   * 返回上一页
   */
  pop<T = any>(data?: T, options?: { action?: boolean }): void {
    const { action = true } = options ?? {};
    if (action) {
      // 返回上一页
      window.history.back();
    }
    // 找到最后一页
    const prePage = lastOf(this._pages);
    // 将 data 返回给上一页
    prePage?.resolve(data);
    // 删除最后一页
    this._pages.splice(this._pages.length - 1, 1);
  }

  /**
   * 替换页面
   */
  replace<R = any>(
    to: string,
    options?: Pick<NavigateOption, 'data' | 'query'>,
  ): Promise<R> {
    this.pop(undefined, { action: false });
    return this.push(to, {
      ...options,
      replace: true,
      action: true,
    });
  }

  /**
   * 连续返回多层页面
   */
  pops(times = 1): void {
    for (let i = 0; i < times; i++) {
      this.pop();
    }
  }
}

export const router = new Router();
