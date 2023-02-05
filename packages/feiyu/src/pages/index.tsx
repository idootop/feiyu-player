import {
  IconFile,
  IconHome,
  IconSchedule,
  IconSettings,
  IconStar,
} from '@arco-design/web-react/icon';

import { getPageBuilder, RoutePage } from '@/services/routes/page';

// @ts-ignore
const modules = import.meta.glob(['./**/index.tsx']) as any;

export const kRoutePages: RoutePage[] = [
  {
    title: '首页',
    key: 'home',
    icon: <IconHome />,
  },
  {
    title: '播放列表',
    key: 'playlist',
    icon: <IconFile />,
  },
  {
    title: '我的收藏',
    key: 'favorite',
    icon: <IconStar />,
  },
  {
    title: '播放历史',
    key: 'history',
    icon: <IconSchedule />,
  },
  {
    title: '设置',
    key: 'settings',
    icon: <IconSettings />,
  },
].map((page) => ({
  ...page,
  pageBuilder: getPageBuilder(modules, page.key),
}));
