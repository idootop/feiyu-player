import { forwardRef } from 'react';

import { flattenChildren } from '@/utils/flatten';

import { Box, BoxProps } from '../Box';
import { PositionProps } from './position';

export const Stack = forwardRef((props: BoxProps, ref: any) => {
  const children = props.children as any[];
  if (!Array.isArray(props.children) || props.children.length < 1)
    return props.children;
  // 最底部的元素，撑起 Stack 的宽高
  const target = children![0];
  // 合并子元素中的嵌套列表
  let items = children.slice(1);
  items = flattenChildren(items);
  // 构造 Stack 内容
  const contents = items.map((item: any, index: number) => {
    const p = item.props ?? {};
    const position = _getStackPosition(p);
    const zIndex = p?.zIndex ?? 1;
    const props = { ...p, ...position, zIndex, position: 'absolute' };
    return (
      <Box key={index} {...props}>
        {item}
      </Box>
    );
  });
  return (
    <Box ref={ref} {...{ ...props, position: 'relative' }}>
      {contents}
      {target}
    </Box>
  ) as any;
});

const _getStackPosition = (p?: Partial<PositionProps>) => {
  switch (p?.align) {
    case 'topLeft':
      return {
        top: 0,
        left: 0,
      };
    case 'topRight':
      return {
        top: 0,
        right: 0,
      };
    case 'bottomLeft':
      return {
        bottom: 0,
        left: 0,
      };
    case 'bottomRight':
      return {
        bottom: 0,
        right: 0,
      };
    case 'center':
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    case 'topCenter':
      return {
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'bottomCenter':
      return {
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    case 'centerLeft':
      return {
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    case 'centerRight':
      return {
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
      };
    default:
      return {};
  }
};
