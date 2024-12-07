import { Button } from '@arco-design/web-react';
import {
  IconLeft,
  IconShareExternal,
  IconSort,
  IconSwap,
} from '@arco-design/web-react/icon';
import { useEffect, useRef, useState } from 'react';
import { useXConsumer } from 'xsta';

import { PageBuilder } from '@/app';
import { Box } from '@/components/Box';
import { Column, Expand, Row } from '@/components/Flex';
import { Loading } from '@/components/Loading';
import { SearchEmpty } from '@/components/SearchEmpty';
import { Text } from '@/components/Text';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Size, useMeasure } from '@/hooks/useMeasure';
import { useRebuild } from '@/hooks/useRebuild';
import { useScreen } from '@/hooks/useScreen';
import { usePage } from '@/services/routes/page';
import { router } from '@/services/routes/router';
import { colors } from '@/styles/colors';
import { clamp } from '@/utils/base';
import { clipboard } from '@/utils/clipborad';
import { isEqual } from '@/utils/diff';
import { FeiyuMovie } from '@/utils/feiyu';
import { isNotEmpty } from '@/utils/is';

import { kCurrentSearchMovies, kPlayPageId, MovieItem } from '../search';
import { useHomePages } from '../useHomePages';
import { Player } from './player';

export const isPlayPage = () => router.current === '/home/play';

const PlayerPage = () => {
  const { isActive } = usePage('/home/play');
  const [pageData] = useXConsumer(kPlayPageId);
  const { pageId, movie } = pageData ?? {};

  const { isDarkMode } = useDarkMode();
  const { jumpToPage } = useHomePages();

  const { width } = useScreen();
  const isMobile = width < 750;
  const descWidth = clamp(320 - (960 - width), 180, 320);

  const loading = false;
  const title = movie?.name;
  const playList = movie?.videos.map((e) => e.url) ?? [];
  const noData = playList.length < 1;

  useEffect(() => {
    if (isActive && !movie) {
      // 回到首页
      jumpToPage('hot');
    }
  }, []);

  // 分享影片
  const share = () => {
    clipboard.write(
      `${window.location.origin}/#/home/search?movie=${encodeURIComponent(
        movie.name,
      )}`,
    );
  };

  // 返回上一页
  const back = async () => {
    const searchPage = router.pages
      .slice()
      .reverse()
      .find((e) => e.path === '/home/search');
    if (searchPage) {
      // 回到搜索页面
      jumpToPage('search', { query: searchPage.query, data: searchPage.data });
    } else {
      // 回到首页
      jumpToPage('hot');
    }
  };

  const [reverseEPs, setReverseEPs] = useState(false);
  let videos = movie?.videos ?? [];
  if (reverseEPs) {
    videos = videos.slice().reverse();
  }

  // 初始化剧集数
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentVideo = movie?.videos[currentIdx];
  const startPlay = (idx: number) => {
    if (idx !== currentIdx) {
      setCurrentIdx(idx);
    }
  };
  useEffect(() => {
    // 当重新从搜索页面打开播放页时，从第一集开始播放
    startPlay(0);
    // 选集恢复原始排序
    setReverseEPs(false);
  }, [pageId]);

  // 更新网页标题
  const titleRef = useRef(document.title);
  if (currentVideo && isActive) {
    document.title = `${movie.name}｜${currentVideo.name}`;
  }
  useEffect(() => {
    if (!isActive) {
      document.title = titleRef.current;
    }
  }, [isActive]);

  // PC 端获取播放器高度
  const [playerSize, setPlayerSize] = useState<Size>();
  const playerMeasureRef = useMeasure({
    onResize(size) {
      if (!isMobile) {
        setPlayerSize(size);
      }
    },
  });

  const $Share = (
    <Button
      icon={<IconShareExternal />}
      style={{ visibility: movie ? 'visible' : 'hidden' }}
      onClick={share}
    >
      分享
    </Button>
  );

  const $PlayList = (
    <Column
      alignItems="start"
      width={isMobile ? '100%' : descWidth + 'px'}
      height={isMobile ? undefined : playerSize?.height}
      maxHeight={isMobile ? undefined : playerSize?.height}
      padding={isMobile ? '10px 0 0 0' : '0 0 0 20px'}
    >
      <Row width="100%">
        <Expand>
          <Text
            width="100%"
            fontSize="22px"
            lineHeight="30px"
            maxLines={2}
            fontWeight="bold"
            padding="0 0 5px 0"
          >
            {movie?.name}
          </Text>
        </Expand>
        {isMobile ? $Share : <Box />}
      </Row>
      <Text width="100%" fontWeight="500" maxLines={1} padding="5px 0">
        {isNotEmpty(currentVideo?.name)
          ? `${movie!.site}｜${currentVideo!.name}`
          : movie?.site}
      </Text>
      {isNotEmpty(movie?.desc) ? (
        <Text
          className="normal-scrollbar"
          overflowX="hidden"
          overflowY="scroll"
          width="100%"
          maxLines={2}
          expandable
          padding="5px 0"
        >
          {movie?.desc}
        </Text>
      ) : (
        <Box />
      )}
      {videos.length > 1 ? (
        <Row width="100%" justifyContent="space-between" padding="10px 0 5px 0">
          <Text
            width="100%"
            fontSize="14px"
            fontWeight="500"
            maxLines={1}
            padding="5px 0"
          >
            选集({videos.length})
          </Text>
          <Button
            icon={<IconSwap />}
            onClick={() => {
              setReverseEPs(!reverseEPs);
            }}
          >
            {!reverseEPs ? '逆序' : '正序'}
          </Button>
        </Row>
      ) : (
        <Box />
      )}
      <Expand
        className="normal-scrollbar"
        width="100%"
        overflowX="hidden"
        overflowY="scroll"
        margin="10px 0 0 0"
      >
        <Box width="100%" height="100%">
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            {videos.map((e, idx) => {
              idx = reverseEPs ? videos.length - 1 - idx : idx;
              return (
                <Button
                  key={e.name + e.url + idx}
                  type={currentIdx === idx ? 'primary' : undefined}
                  onClick={() => startPlay(idx)}
                  style={{
                    margin: '5px',
                    maxWidth: '100%',
                    height: 'auto',
                    minHeight: '32px',
                    textWrap: 'wrap',
                  }}
                >
                  {e.name}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Expand>
    </Column>
  );

  const $Body =
    loading && noData ? (
      <Column width="100%" height="calc(80vh - 60px)" justifyContent="center">
        <Loading />
      </Column>
    ) : noData || !currentVideo ? (
      <Column width="100%" height="calc(80vh - 60px)" justifyContent="center">
        <SearchEmpty />
      </Column>
    ) : (
      <Column width="100%" justifyContent="center">
        <Row width="100%" alignItems="start">
          <Expand>
            <Player
              ref={playerMeasureRef}
              current={currentVideo.url}
              playList={playList}
              onPlayNext={(_url: string, idx: number) => startPlay(idx)}
              pause={!isActive}
            />
          </Expand>
          {isMobile ? <Box /> : $PlayList}
        </Row>
        {isMobile ? $PlayList : <Box />}
        <MovieList />
      </Column>
    );

  return (
    <PageBuilder
      background={isMobile ? colors.bg : isDarkMode ? colors.bg3 : colors.gray}
    >
      {isMobile ? (
        <Box />
      ) : (
        <Row justifyContent="space-between">
          <Button icon={<IconLeft />} onClick={back}>
            返回
          </Button>
          <Expand justifyContent="center">
            <Text fontWeight="500" maxLines={1} width="100%" textAlign="center">
              {currentVideo
                ? `正在播放: ${currentVideo.name}`
                : `「 ${title} 」`}
            </Text>
          </Expand>
          {$Share}
        </Row>
      )}
      <Box
        background={colors.bg}
        padding={isMobile ? '0px' : '20px'}
        marginTop={isMobile ? '0px' : '20px'}
        minHeight={isMobile ? undefined : '100vh'}
      >
        {$Body}
      </Box>
    </PageBuilder>
  );
};

const MovieList = () => {
  const [data] = useXConsumer<any>(kCurrentSearchMovies);
  const { movies = [], searching, sort } = data ?? {};
  const [pageData] = useXConsumer(kPlayPageId);
  const { movie: currentMovie } = pageData ?? {};
  const rebuild = useRebuild();
  // 电影列表搜索结果大于1个时，展示电影搜索列表
  return movies.length > 1 ? (
    <Column width="100%" alignItems="start">
      <Row width="100%">
        <Expand>
          <Text
            width="100%"
            fontSize="16px"
            fontWeight="bold"
            padding="20px 0"
            maxLines={1}
          >
            搜索结果({movies.length})
          </Text>
        </Expand>
        <Button
          icon={<IconSort />}
          style={{ visibility: movies.length > 1 ? 'visible' : 'hidden' }}
          onClick={() => {
            sort((a, b) => {
              return a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: 'base',
              });
            });
            rebuild();
          }}
        >
          排序
        </Button>
      </Row>
      <Box className="movie-grid" width="100%">
        {movies.map((movie: FeiyuMovie, idx) => (
          <MovieItem
            key={`${movie.name}-${idx}-play`}
            movie={movie}
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
    </Column>
  ) : (
    <Box />
  );
};

export default <PlayerPage />;
