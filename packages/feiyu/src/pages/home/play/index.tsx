import { Button, Link, Message, Modal } from '@arco-design/web-react';
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
import { useInit } from '@/hooks/useInit';
import { Size, useMeasure } from '@/hooks/useMeasure';
import { useRebuild, useRebuildRef } from '@/hooks/useRebuild';
import { useScreen } from '@/hooks/useScreen';
import { ipfs } from '@/services/ipfs';
import { addSearchParams } from '@/services/routes/location';
import { usePage } from '@/services/routes/page';
import { router } from '@/services/routes/router';
import { colors } from '@/styles/colors';
import { clamp } from '@/utils/base';
import { isEqual } from '@/utils/diff';
import { FeiyuMovie } from '@/utils/feiyu';
import { isEmpty, isNotEmpty } from '@/utils/is';

import { kCurrentSearchMovies, kPlayPageId, MovieItem } from '../search';
import { useHomePages } from '../useHomePages';
import { Player } from './player';

export const isPlayPage = () => router.current === '/home/play';

const usePlayIPFSData = (props: { cid?: string; data?: any }) => {
  // eslint-disable-next-line prefer-const
  let { cid, data } = props;
  const dataRef = useRef({
    ...props,
    loading: true,
    noData: true,
    inited: false,
    preData: undefined as any,
  });
  const rebuildRef = useRebuildRef();
  if (dataRef.current.cid) {
    dataRef.current.inited = true;
  }
  if (dataRef.current.cid && !dataRef.current.data) {
    dataRef.current.loading = true;
    dataRef.current.noData = true;
  }
  if (dataRef.current.data) {
    dataRef.current.loading = false;
    dataRef.current.noData = false;
  }

  useInit(async () => {
    if (!isPlayPage()) return;
    if (cid && !data) {
      // 有 cid 但是没有数据，重新从 cid 获取数据
      data = await ipfs.readJson(cid);
      dataRef.current.data = data;
      dataRef.current.loading = false;
      // 刷新界面
      rebuildRef.current.rebuild();
    } else if (!cid && !data) {
      // fallback 到首页
      setTimeout(() => {
        router.replace('/home/hot');
      });
    }
  }, [props]);
  return dataRef.current;
};

const PlayerPage = () => {
  /**
   * query: cid[电影详情数据ipfs cid], ep[当前播放集数]
   * data: movie[电影详情数据]
   */
  const { query, isActive } = usePage('/home/play');
  const { cid, ep: _ep } = query;
  const ep = parseInt(_ep ?? '1', 10);
  const [pageData] = useXConsumer(kPlayPageId);
  const { pageId, movie: currentData } = pageData ?? {};

  const { isDarkMode } = useDarkMode();
  const { jumpToPage } = useHomePages();

  const { width } = useScreen();
  const isMobile = width < 750;
  const descWidth = clamp(320 - (960 - width), 180, 320);

  const {
    loading: _loading,
    noData: _noData,
    data: ipfsData,
  } = usePlayIPFSData({ cid, data: currentData });
  const movie: FeiyuMovie | undefined = currentData ?? ipfsData;
  const playList = movie?.videos.map((e) => e.url) ?? [];
  const loading = movie ? false : _loading;
  const noData = movie ? movie.videos.length < 1 : _noData;
  const title = movie?.name ?? (loading ? '加载中' : '加载失败');

  const [sharing, setSharing] = useState(false);
  const [shareURL, setShareURL] = useState<string>('');

  const $ShareModal = (
    <Modal
      title="分享链接"
      visible={isNotEmpty(shareURL)}
      onCancel={() => setShareURL('')}
      footer={null}
      style={{
        width: 'auto',
        maxWidth: '400px',
        margin: '20px',
      }}
    >
      <Link
        style={{ padding: '20px', color: '#3d7ff6', wordBreak: 'break-all' }}
        href={shareURL}
        target="_blank"
      >
        {shareURL}
      </Link>
    </Modal>
  );

  // 分享影片
  const share = async () => {
    if (sharing) {
      Message.info('生成分享链接中，请稍等');
      return;
    }
    setSharing(true);
    const _cid = isEmpty(cid) ? await ipfs.writeJson(movie) : cid;
    if (_cid) {
      const shareUrl = new URL(window.location.href.replace('#/', ''));
      shareUrl.searchParams.set('cid', _cid);
      const url = shareUrl.href.replace('/home', '/#/home');
      setShareURL(url);
    } else {
      Message.info('分享失败');
    }
    setSharing(false);
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
  const [currentIdx, setCurrentIdx] = useState(ep - 1);
  const startPlay = (idx: number) => {
    if (idx !== currentIdx) {
      setCurrentIdx(idx);
      // 更新请求参数(当前播放的剧集)
      addSearchParams({ ep: idx + 1 });
    }
  };
  useEffect(() => {
    // 当重新从搜索页面打开播放页时，从第一集开始播放
    startPlay(0);
    // 选集恢复原始排序
    setReverseEPs(false);
  }, [pageId]);
  useEffect(() => {
    // 从query里的 ep 更新当前的播放集数
    if (currentIdx !== ep - 1) {
      setCurrentIdx(ep - 1);
    }
  }, [ep]);
  const currentVideo = movie?.videos?.[currentIdx];

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
      loading={sharing}
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
      {$ShareModal}
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
