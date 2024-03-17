import { LRoute, LRoutes } from '@/services/routes';
import {
  getPageBuilder,
  RoutePage,
  useFallbackToIndex,
} from '@/services/routes/page';

// @ts-ignore
const modules = import.meta.glob(['./**/index.tsx']) as any;

const pages: RoutePage[] = [
  // 子页面
  'hot',
  'search',
  'play',
].map((page) => ({
  key: page,
  pageBuilder: getPageBuilder(modules, page),
}));

const parent = '/home/';
const index = pages[0].key;

export const useHomeIndexFallback = () => {
  return useFallbackToIndex(pages, { parent, index });
};

const Home = () => {
  useHomeIndexFallback();
  return (
    <LRoutes parent={parent}>
      {pages.map((e) => {
        return <LRoute key={e.key} path={e.key} builder={e.pageBuilder} />;
      })}
    </LRoutes>
  );
};

export default <Home />;
