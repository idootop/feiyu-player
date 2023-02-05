import { forwardRef } from 'react';

import { Box, BoxProps } from './Box';

export const Row = forwardRef((props: BoxProps, ref: any) => {
  return (
    <Box
      ref={ref}
      {...props}
      extStyle={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: props?.style?.alignItems ?? props?.alignItems ?? 'center',
      }}
    >
      {props?.children}
    </Box>
  );
});

export const Column = forwardRef((props: BoxProps, ref: any) => {
  return (
    <Box
      ref={ref}
      {...props}
      extStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: props?.style?.alignItems ?? props?.alignItems ?? 'center',
      }}
    >
      {props?.children}
    </Box>
  );
});

export const Expand = forwardRef((props: BoxProps, ref: any) => {
  const newProps = { flex: 1, display: 'flex', ...(props as any) };
  return (
    <Box ref={ref} {...newProps}>
      {props?.children}
    </Box>
  );
});

export const Center = forwardRef((props: BoxProps, ref: any) => {
  return (
    <Box
      ref={ref}
      {...props}
      extStyle={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {props?.children}
    </Box>
  );
});
