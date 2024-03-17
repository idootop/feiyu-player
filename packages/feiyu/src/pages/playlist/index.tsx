import { Box } from '@/components/Box';

import { PageBuilder } from '../../app';

const Playlist = () => {
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
      Playlist
    </Box>
  );
};

export default (
  <PageBuilder>
    <Playlist />
  </PageBuilder>
);
