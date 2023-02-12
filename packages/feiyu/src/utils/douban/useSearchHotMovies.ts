import { configs } from '@/data/config/manager';
import { useSearchDatas } from '@/hooks/useSearchDatas';
import { http } from '@/services/http';
import { store } from '@/services/store/useStore';

import { isString } from '../is';
import { DoubanHotMovie } from '.';

export const kHotMoviesKey = 'kHotMovies';
export const getHotMovies = () => store.get<DoubanHotMovie[]>(kHotMoviesKey);

export const useSearchHotMovies = () => {
  return useSearchDatas<any, DoubanHotMovie>({
    isEqual: () => false,
    async onSearch() {
      const currenHotMovies = store.get(kHotMoviesKey);
      if (currenHotMovies) return currenHotMovies;
      const hotMovies = configs.current.hotMovies;
      const movies = isString(hotMovies)
        ? await http.get(hotMovies as string)
        : hotMovies;
      if (isString(movies)) {
        return []; // 非预期数据
      }
      store.set(kHotMoviesKey, movies);
      return movies;
    },
  });
};
