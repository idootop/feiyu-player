import { Button, Empty } from '@arco-design/web-react';
import { IconLeft, IconSort } from '@arco-design/web-react/icon';
import { useEffect } from 'react';

import { Box } from '@/components/Box';
import { Center, Column, Expand, Row } from '@/components/Flex';
import { LazyImage } from '@/components/LazyImage/LazyImage';
import { Loading } from '@/components/Loading';
import { Stack } from '@/components/Stack';
import { Position } from '@/components/Stack/position';
import { Text } from '@/components/Text';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { PageBuilder } from '@/pages/app';
import { usePage } from '@/services/routes/page';
import { router } from '@/services/routes/router';
import { newId, store, useConsumer, useInit } from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { isEqual } from '@/utils/diff';
import { FeiyuMovie } from '@/utils/feiyu';
import { useFeiyuSearch } from '@/utils/feiyu/useFeiyuSearch';

import { useHomePages } from '..';

export const kCurrentSearchMovies = 'kCurrentSearchMovies';

const Search = () => {
  const { query } = usePage('/home/search');
  const { isDarkMode } = useDarkMode();
  const { jumpToIndex, jumpToPage } = useHomePages();
  const { isMobile } = useBreakpoint();

  const {
    search,
    initial,
    searching,
    datas: movies,
    noData,
    sort,
  } = useFeiyuSearch();
  useInit(() => {
    search(query.movie ?? '爱的迫降');
  }, [query.movie]);

  // 更新当前的搜索结果（透传数据给播放页面）
  useEffect(() => {
    store.set(kCurrentSearchMovies, {
      searching,
      movies,
      sort,
    });
  }, [movies.length, searching]);

  const [pageData] = useConsumer(kPlayPageId);
  const { movie: currentMovie } = pageData ?? {};

  const body = initial ? (
    <Box />
  ) : searching && noData ? (
    <Column width="100%" height="calc(80vh - 60px)" justifyContent="center">
      <Loading />
    </Column>
  ) : noData ? (
    <Column
      width="100%"
      height="calc(80vh - 60px)"
      justifyContent="center"
      onClick={() => {
        if (noData) {
          search('refresh');
        }
      }}
    >
      <Empty description="空空如也，喵呜 ฅ'ω'ฅ" />
    </Column>
  ) : (
    <>
      <Box className="movie-grid">
        {[...movies].map((movie, idx) => (
          <MovieItem
            key={`${movie.name}-${idx}`}
            movie={movie}
            jumpToPage={jumpToPage}
            isActive={isEqual(currentMovie, movie)}
          />
        ))}
      </Box>
      <Row
        width="100%"
        height="65px"
        marginTop="20px"
        justifyContent="center"
        color={colors.text3}
      >
        {searching ? <Loading size={18} /> : <Box />}
        <Box marginLeft={searching ? '8px' : '0px'}>
          {searching ? '搜索中...' : "没有更多了，喵呜 ฅ'ω'ฅ"}
        </Box>
      </Row>
    </>
  );

  return (
    <PageBuilder
      background={isMobile ? colors.bg : isDarkMode ? colors.bg3 : colors.gray}
    >
      {isMobile ? (
        <Box />
      ) : (
        <Row justifyContent="space-between">
          <Button
            icon={<IconLeft />}
            onClick={() => {
              jumpToIndex();
            }}
          >
            返回
          </Button>
          <Expand justifyContent="center">
            <Text fontWeight="500" maxLines={1} width="100%" textAlign="center">
              「 {query.movie} 」
            </Text>
          </Expand>
          <Button
            icon={<IconSort />}
            style={{ visibility: !noData ? 'visible' : 'hidden' }}
            onClick={() => {
              sort((a, b) => {
                return a.name.localeCompare(b.name, undefined, {
                  numeric: true,
                  sensitivity: 'base',
                });
              });
            }}
          >
            排序
          </Button>
        </Row>
      )}
      <Box
        background={colors.bg}
        padding={isMobile ? '0px' : '20px'}
        marginTop={isMobile ? '0px' : '20px'}
        minHeight={isMobile ? undefined : '100vh'}
      >
        {body}
      </Box>
    </PageBuilder>
  );
};

export default <Search />;

export const kPlayPageId = 'kPlayPageId';
export const MovieItem = (props: {
  movie: FeiyuMovie;
  isActive?: boolean;
  jumpToPage?: (page: string, options?: { data: any; query?: any }) => void;
}) => {
  const { movie, jumpToPage, isActive } = props;

  const onClick = async () => {
    store.set(kPlayPageId, { movie, pageId: newId() });
    if (router.current !== '/home/play') {
      jumpToPage?.('play');
    }
  };

  return (
    <Column
      className="no-scale"
      width="100%"
      cursor="pointer"
      onClick={onClick}
    >
      <Stack size="100%">
        <LazyImage src={movie.image} />
        <Position width="100%" align="bottomLeft">
          <Center
            className="glass-header"
            padding="4px 10px"
            margin="10px"
            borderRadius="4px"
            width="fit-content"
            maxWidth="calc(100% - 2 * 10px)"
            overflow="hidden"
          >
            <Text
              cssEllipsis
              maxLines={1}
              style={{
                maxWidth: '100%',
                color: '#fff',
                fontWeight: '400',
                fontSize: '12px',
              }}
            >
              {movie.site}
            </Text>
          </Center>
        </Position>
      </Stack>
      <Text
        maxLines={1}
        style={{
          width: '100%',
          textAlign: 'center',
          color: isActive ? colors.primary : colors.text3,
          fontWeight: '500',
          marginTop: '10px',
        }}
      >
        {movie.name}
      </Text>
    </Column>
  );
};
