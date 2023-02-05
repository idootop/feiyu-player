import { Box } from '@/components/Box';

import { PageBuilder } from '../app';

const Favorite = () => {
  return (
    <Box
      width="100%"
      height="80vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontSize="36px"
      fontWeight="bold"
      color="var(--color-text-1)"
    >
      Favorite
    </Box>
  );
};

export default (
  <PageBuilder>
    <Favorite />
  </PageBuilder>
);
