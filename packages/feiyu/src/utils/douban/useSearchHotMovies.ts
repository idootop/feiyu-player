import { useSearchDatas } from '@/hooks/useSearchDatas';
import { configs } from '@/pages/app/configs';
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
      const movies = await http.get(configs.hotMovies);
      if (isString(movies)) {
        return [];
      }
      store.set(kHotMoviesKey, movies);
      return movies;
    },
  });
};
