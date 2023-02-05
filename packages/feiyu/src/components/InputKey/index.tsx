import './style.css';

import { Box, BoxProps } from '../Box';

export const InputKey = (props?: BoxProps) => {
  return (
    <Box {...props} className="ac-navbar-search-input-key">
      {props?.children}
    </Box>
  );
};
