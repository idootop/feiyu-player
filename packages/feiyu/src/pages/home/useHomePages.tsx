import { usePages } from '@/services/routes/page';

export const useHomePages = () => {
  return usePages({
    parent: '/home/',
    index: 'hot',
  });
};
