import { Button } from '@arco-design/web-react';
import { IconLeft, IconSort } from '@arco-design/web-react/icon';
import { useEffect } from 'react';
import { useXConsumer, XSta } from 'xsta';

import { Box } from '@/components/Box';
import { Center, Column, Expand, Row } from '@/components/Flex';
import { LazyImage } from '@/components/LazyImage/LazyImage';
import { Loading } from '@/components/Loading';
import { SearchEmpty } from '@/components/SearchEmpty';
import { Stack } from '@/components/Stack';
import { Position } from '@/components/Stack/position';
import { Text } from '@/components/Text';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { newID } from '@/hooks/useID';
import { useInit } from '@/hooks/useInit';
import { showAPPConfigModal } from '@/overlays/APPConfigModal';
import { PageBuilder } from '@/pages/app';
import { isValidProxy } from '@/services/http';
import { usePage } from '@/services/routes/page';
import { router } from '@/services/routes/router';
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
    refresh,
    initial,
    searching,
    datas: movies,
    noData,
    sort,
  } = useFeiyuSearch();

  useInit(() => {
    search(query.movie ?? '爱的迫降');
  }, [query.movie]);

  useInit(async () => {
    if (!initial && !searching && noData) {
      const valid = await isValidProxy();
      if (!valid) {
        showAPPConfigModal();
      }
    }
  }, [initial, searching, noData]);

  // 更新当前的搜索结果（透传数据给播放页面）
  useEffect(() => {
    XSta.set(kCurrentSearchMovies, {
      searching,
      movies,
      sort,
    });
  }, [movies.length, searching]);

  const [pageData] = useXConsumer(kPlayPageId);
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
      onClick={refresh}
      cursor="pointer"
    >
      <SearchEmpty />
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
    XSta.set(kPlayPageId, { movie, pageId: newID() });
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
            padding="4px 10px"
            margin="10px"
            borderRadius="4px"
            width="max-content"
            maxWidth="calc(100% - 2 * 10px)"
            overflow="hidden"
            background="rgba(0, 0, 0, 0.8)"
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
