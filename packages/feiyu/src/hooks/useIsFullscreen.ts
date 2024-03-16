import { FeiyuDesktop } from 'feiyu-desktop';
import { useXState, XSta } from 'xsta';

import { useInit } from './useInit';

const kIsFullscreen = 'kIsFullscreen';
const kSetPlayerFullScreenCallback = 'kSetPlayerFullScreenCallback';
export const setPlayerFullScreenCallback = (cb) => {
  // 在 XSta 中存放 function 的时候，需要以 () => target function 的形式返回
  XSta.set(kSetPlayerFullScreenCallback, () => cb);
};

export const useInitDesktopFullscreen = () => {
  useInit(() => {
    FeiyuDesktop.window?.onResized(() => {
      const isFullscreen = XSta.get(kIsFullscreen) ?? false;
      const setFullscreen = (v) => XSta.set(kIsFullscreen, v);
      const setPlayerFullScreen = XSta.get(kSetPlayerFullScreenCallback);
      const maybeIsFullscreen = window.innerWidth === window.screen.availWidth;
      if (maybeIsFullscreen) {
        FeiyuDesktop.window?.isFullscreen().then((v) => {
          setFullscreen(v);
        });
      } else if (isFullscreen) {
        setFullscreen(false);
        setPlayerFullScreen?.(false);
      }
    });
  }, []);
};

export const useIsFullscreen = () => {
  const [isFullscreen] = useXState(kIsFullscreen, false);
  const showTitleBar = FeiyuDesktop.isDesktop && !isFullscreen;
  return { showTitleBar, isFullscreen };
};
