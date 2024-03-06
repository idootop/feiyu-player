import { useXConsumer, XSta } from "xsta";

const __getBreakpoint = () => {
  const width = document.body.clientWidth;
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

const _getBreakpoint = () => {
  const res = __getBreakpoint();
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  return { ...res, width, height };
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
  width: number;
  height: number;
}

const kScreenReSizeListenerKey = 'kScreenReSizeListenerKey';
let _initScreenReSizeListener = false;
const initScreenReSizeListener = () => {
  if (!_initScreenReSizeListener) {
    // 全剧只初始化一次
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
