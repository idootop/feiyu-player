import { kRoutePages } from '@/pages';
import { LRoute, LRoutes } from '@/services/routes';

export const RootPages = () => {
  return (
    <LRoutes parent="/">
      {kRoutePages.map((e) => {
        return <LRoute key={e.key} path={e.key} builder={e.pageBuilder} />;
      })}
    </LRoutes>
  );
};
