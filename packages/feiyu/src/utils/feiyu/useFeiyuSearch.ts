import { useSearchDatas } from '@/hooks/useSearchDatas';

import { feiyu, FeiyuMovie } from '.';

export const useFeiyuSearch = () => {
  return useSearchDatas<string, FeiyuMovie>({
    onlyCallback: true,
    onSearch(config) {
      const { query, signal, callback } = config;
      return feiyu.search(query, {
        callback,
        signal,
      });
    },
    isEqual: (a, b) => (a?.trim() ?? '') === b.trim(),
  });
};
