import { Typography } from '@arco-design/web-react';
import { forwardRef } from 'react';

import { BoxProps, getBoxProps } from './Box';

interface TextProps extends BoxProps {
  maxLines?: number;
  /**
   * 是否展示折叠展开
   */
  expandable?: boolean;
  /**
   * 使用 css 计算省略符号
   */
  cssEllipsis?: boolean;
}

export const Text = forwardRef((props: TextProps, _ref: any) => {
  const { children, maxLines, expandable, cssEllipsis } = props;
  const boxProps = getBoxProps(props);
  return (
    <Typography.Paragraph
      {...boxProps}
      spacing="close"
      ellipsis={
        maxLines
          ? {
              rows: maxLines,
              expandable,
              cssEllipsis,
            }
          : undefined
      }
    >
      {children}
    </Typography.Paragraph>
  );
});
