import { pickOne } from '../utils/base';
import { configs } from './config/manager';

export const randomMovie = () => {
  return pickOne(
    configs.current.recommendMovies ?? [
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
