import { useRef } from 'react';

import { useInit, useRebuild, useRebuildRef } from '@/services/store/useStore';
import { colors } from '@/styles/colors';

import { Box } from '../Box';
import { Center } from '../Flex';
import { Loading } from '../Loading';
import { Stack } from '../Stack';
import { Position } from '../Stack/position';
import { TabPageController } from './state';

export const TabPages = (props: {
  controller: TabPageController;
  currentPage?: string;
}) => {
  const { controller, currentPage } = props;
  const rebuild = useRebuild();
  controller.rebuild = rebuild;
  const _currentPage = currentPage ?? controller.currentPage.key;
  const pages = controller.pages;
  return (
    <Stack size="100%">
      <Box size="100%" />
      {pages.map((e) => {
        const isActive = _currentPage === e.key;
        return (
          <Position
            key={e.key}
            size="100%"
            zIndex={isActive ? 2 : 1}
            visibility={isActive ? 'visible' : 'hidden'}
          >
            <AsyncBuilder builder={e.pageBuilder} inited={e.inited} />
          </Position>
        );
      })}
    </Stack>
  );
};

export const AsyncBuilder = (props: {
  builder: () => any;
  inited?: boolean;
}) => {
  const { builder, inited } = props;
  const pageRef = useRef();
  const rebuildRef = useRebuildRef();
  useInit(async () => {
    const page = await builder();
    pageRef.current = page;
    rebuildRef.current.rebuild();
  }, [builder]);
  return inited ? (
    pageRef.current ?? <Box />
  ) : (
    <Center size="100%" background={colors.bg}>
      <Loading />
    </Center>
  );
};
