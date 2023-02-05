import './style.css';

import { useEffect, useRef, useState } from 'react';

import { Box, BoxProps } from '../Box';

export const isSupportAspectRatio = () => CSS.supports('aspect-ratio', '3/4');

export const AspectRatio = (
  props: Omit<BoxProps, 'children' | 'className'> & {
    aspectRatio: number;
    children: (props: {
      width?: string;
      height?: string;
      isSupport: boolean;
    }) => any;
  },
) => {
  return isSupportAspectRatio() ? (
    props.children({ isSupport: true })
  ) : (
    <$AspectRatio {...props}>{props.children}</$AspectRatio>
  );
};

const $AspectRatio = (
  props: Omit<BoxProps, 'children' | 'className'> & {
    aspectRatio: number;
    children: (props: {
      width?: string;
      height?: string;
      isSupport: boolean;
    }) => any;
  },
) => {
  const {
    aspectRatio,
    children,
    style,
    width = '100px',
    height = '100px',
    ...restProps
  } = props;
  const [size, setSize] = useState({
    width,
    height,
  });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      setSize({
        width: ref.current.clientWidth + 'px',
        height: ref.current.clientWidth / aspectRatio + 'px',
      });
    }
  }, [ref]);

  return (
    <Box
      ref={ref}
      className={'aspect-ratio-box'}
      {...restProps}
      extStyle={{ ...size, ...style }}
    >
      {children({ ...size, isSupport: false } as any)}
    </Box>
  );
};
