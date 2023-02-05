import { getHotMovies } from '@/utils/douban/useSearchHotMovies';

import { pickOne } from '../utils/base';

export const randomMovie = () => {
  // 推荐前 50 个热门电影
  const hotMovies = getHotMovies()
    ?.slice(0, 50)
    ?.map((e) => e.title);
  return pickOne(
    hotMovies ?? [
      '请回答1988',
      '白色巨塔',
      '非自然死亡',
      '半泽直树',
      '孤独又灿烂的神鬼怪',
      '想见你',
      '我们与恶的距离',
      '俗女养成记',
      '爱的迫降',
      '恶作剧之吻',
      '悠长假期',
      '东京爱情故事',
    ],
  );
};
