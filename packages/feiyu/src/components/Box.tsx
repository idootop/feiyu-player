import { CSSProperties, forwardRef, MouseEventHandler, ReactNode } from 'react';

import { isArray } from '@/utils/is';

export interface BaseStyles {
  size?: string | number;
}

export interface BaseProps extends BaseStyles {
  style?: CSSProperties;
  extStyle?: CSSProperties;
  children?: ReactNode;
  id?: string;
  className?: string | string[];
  onClick?: MouseEventHandler | undefined;
}

export type BoxProps = CSSProperties & BaseProps;

export const getBoxProps = (props: BoxProps) => {
  const {
    style,
    id,
    className: _class,
    onClick,
    extStyle = {},
    size,
    ...styles
  } = props ?? {};
  if (size) {
    extStyle.width = size;
    extStyle.height = size;
  }
  const className = isArray(_class) ? (_class as any)!.join(' ') : _class;
  return {
    id,
    onClick,
    className,
    style: {
      ...style,
      ...styles,
      ...extStyle,
    },
  };
};

export const Box = forwardRef((props: BoxProps, ref: any) => {
  const { children } = props;
  const boxProps = getBoxProps(props);
  return (
    <div ref={ref} {...boxProps}>
      {children}
    </div>
  );
});
