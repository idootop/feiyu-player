import { XSta } from 'xsta';

import { configs } from '@/data/config';
import { useSearchDatas } from '@/hooks/useSearchDatas';
import { http } from '@/services/http';

import { isString } from '../is';
import { DoubanHotMovie } from '.';

export const kHotMoviesKey = 'kHotMovies';
export const getHotMovies = () => XSta.get<DoubanHotMovie[]>(kHotMoviesKey);

export const useSearchHotMovies = () => {
  return useSearchDatas<any, DoubanHotMovie>({
    isEqual: () => false,
    async onSearch() {
      const currenHotMovies = XSta.get(kHotMoviesKey);
      if (currenHotMovies) return currenHotMovies;
      const hotMovies = configs.current.hotMovies;
      const movies = isString(hotMovies)
        ? await http.get(hotMovies as string)
        : hotMovies;
      if (isString(movies)) {
        return []; // 非预期数据
      }
      XSta.set(kHotMoviesKey, movies);
      return movies;
    },
  });
};
