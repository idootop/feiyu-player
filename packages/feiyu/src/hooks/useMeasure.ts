import { useLayoutEffect, useRef } from 'react';

import { isNotEqual } from '@/utils/diff';

import { useInterval } from './useInterval';

export interface Size {
  width: number;
  height: number;
}
export const useMeasure = (props: {
  onResize: (size: Size) => void;
  useInterval?: boolean;
}) => {
  const { onResize, useInterval: _useInterval = true } = props;
  const elRef = useRef<HTMLElement>();
  const sizeRef = useRef({
    width: 0,
    height: 0,
  });

  // 使用轮训的方式，监听尺寸变化
  useInterval(
    () => {
      if (_useInterval && elRef.current) {
        const currentSize = {
          width: elRef.current.clientWidth,
          height: elRef.current.clientHeight,
        };
        if (isNotEqual(sizeRef.current, currentSize)) {
          onResize(currentSize);
          sizeRef.current = currentSize;
        }
      }
    },
    _useInterval ? 100 : 1000 * 60 * 60 * 24,
  );

  // 只在初始化时获取一次
  useLayoutEffect(() => {
    if (elRef.current) {
      onResize({
        width: elRef.current.clientWidth,
        height: elRef.current.clientHeight,
      });
    }
  }, []);

  return elRef;
};
