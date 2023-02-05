import { useSearchDatas } from '@/hooks/useSearchDatas';

import { douban, DoubanSearchDetail } from '.';

export const useSearchKeywords = () => {
  return useSearchDatas<string, DoubanSearchDetail>({
    onlyCallback: true,
    onSearch(config) {
      const { query, signal, callback } = config;
      // return douban.search(query, signal) as any;
      return douban.searchMovies(query, {
        callback,
        signal,
      });
    },
    isEqual: (a, b) => (a?.trim() ?? '') === b.trim(),
  });
};
