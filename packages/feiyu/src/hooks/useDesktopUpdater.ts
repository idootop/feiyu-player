import { FeiyuDesktop } from 'feiyu-desktop';
import { useXState } from 'xsta';

import { useInit } from './useInit';

const kDesktopUpdater = 'kDesktopUpdater';
export const useDesktopUpdater = () => {
  const [needUpdate, setNeedUpdate] = useXState(kDesktopUpdater);
  useInit(async () => {
    const needUpdate = await FeiyuDesktop.updater?.needUpdate();
    setNeedUpdate(needUpdate);
  });

  return {
    needUpdate,
    async update() {
      await FeiyuDesktop.updater?.update();
    },
  };
};
