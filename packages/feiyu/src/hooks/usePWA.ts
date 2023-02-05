import { useRegisterSW } from 'virtual:pwa-register/react';

import { useStore } from '@/services/store/useStore';

const kInstalledPWA = 'kInstalledPWA';
export const usePWA = () => {
  const [installed, setInstalled] = useStore(kInstalledPWA);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW() {
      setInstalled(true);
    },
  });

  return {
    installed,
    offlineReady,
    needUpdate: needRefresh,
    update() {
      updateServiceWorker(true);
    },
    cancel() {
      setOfflineReady(false);
      setNeedRefresh(false);
    },
  };
};
