import { useXConsumer, XSta } from 'xsta';

const _getBreakpoint = () => {
  const width = window.innerWidth;
  if (width < 576) {
    return { isXS: true, isMobile: true };
  }
  if (width >= 576 && width < 768) {
    return { isSM: true, isMobile: true };
  }
  if (width >= 768 && width < 992) {
    return { isMD: true, isPad: true };
  }
  if (width >= 992 && width < 1200) {
    return { isLG: true, isPC: true };
  }
  if (width >= 1200 && width < 1600) {
    return { isXL: true, isPC: true };
  }
  if (width >= 1600 && width < 2000) {
    return { isXXL: true, isPC: true };
  }
  return { isXXXL: true, isPC: true };
};

interface DeviceSize {
  isMobile: boolean;
  isPC: boolean;
  isPad: boolean;
  isXS: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  isXXL: boolean;
  isXXXL: boolean;
}

const kScreenReSizeListenerKey = 'kScreenReSizeListenerKey';
let _initScreenReSizeListener = false;
const initScreenReSizeListener = () => {
  if (!_initScreenReSizeListener) {
    // 全局只初始化一次
    setInterval(() => {
      XSta.set(kScreenReSizeListenerKey, _getBreakpoint());
    }, 100);
    _initScreenReSizeListener = true;
  }
};

export const useBreakpoint = (): DeviceSize => {
  initScreenReSizeListener();
  const [breakpoint] = useXConsumer(kScreenReSizeListenerKey);
  return breakpoint ?? _getBreakpoint();
};
