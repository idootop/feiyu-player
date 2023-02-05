import { VoidCallback } from '@/utils/types';

export interface TabPageConfig {
  key: string;
  inited?: boolean;
  pageBuilder: () => any;
}

export class TabPageController {
  private _key: string;
  private _pages: TabPageConfig[];

  private _currentPage: string;

  constructor(p: { key: string; pages: TabPageConfig[]; initPage?: string }) {
    const { key, pages, initPage = pages[0].key } = p;
    this._key = key;
    this._pages = pages.map((e) => {
      return {
        key: e.key,
        inited: e.key === initPage,
        pageBuilder: e.pageBuilder,
      };
    });
    this._currentPage = initPage;
  }

  get key() {
    return this._key;
  }

  get pages() {
    return this._pages;
  }

  get currentPage() {
    return this.getPage(this._currentPage)!;
  }

  rebuild?: VoidCallback;
  jumpTo(key: string): void {
    const targetPage = this.getPage(key);
    if (targetPage !== undefined) {
      this._currentPage = targetPage.key;
      targetPage.inited = true;
      this.rebuild?.();
    }
  }

  getPage(key: string): TabPageConfig | undefined {
    return this._pages.find((e) => e.key === key);
  }
}
