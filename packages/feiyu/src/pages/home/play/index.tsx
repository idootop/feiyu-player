import { Button, Message, Modal } from '@arco-design/web-react';
import {
  IconLeft,
  IconShareExternal,
  IconSort,
  IconSwap,
} from '@arco-design/web-react/icon';
import { useEffect, useRef, useState } from 'react';

import { Box } from '@/components/Box';
import { Column, Expand, Row } from '@/components/Flex';
import { Loading } from '@/components/Loading';
import { SearchEmpty } from '@/components/SearchEmpty';
import { Text } from '@/components/Text';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Size, useMeasure } from '@/hooks/useMeasure';
import { PageBuilder } from '@/pages/app';
import { ipfs } from '@/services/ipfs';
import { addSearchParams } from '@/services/routes/location';
import { usePage } from '@/services/routes/page';
import { router } from '@/services/routes/router';
import {
  useConsumer,
  useInit,
  useRebuild,
  useRebuildRef,
} from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { clipboard } from '@/utils/clipborad';
import { isEqual } from '@/utils/diff';
import { FeiyuMovie } from '@/utils/feiyu';
import { isEmpty, isNotEmpty } from '@/utils/is';

import { useHomePages } from '..';
import { kCurrentSearchMovies, kPlayPageId, MovieItem } from '../search';
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
      // ??? cid ?????????????????????????????? cid ????????????
      data = await ipfs.readJson(cid);
      dataRef.current.data = data;
      dataRef.current.loading = false;
      // ????????????
      rebuildRef.current.rebuild();
    } else if (!cid && !data) {
      // fallback ?????????
      setTimeout(() => {
        router.replace('/home/hot');
      });
    }
  }, [props]);
  return dataRef.current;
};

const Play = () => {
  /**
   * query: cid[??????????????????ipfs cid], ep[??????????????????]
   * data: movie[??????????????????]
   */
  const { query, isActive } = usePage('/home/play');
  const { cid, ep: _ep } = query;
  const ep = parseInt(_ep ?? '1', 10);
  const [pageData] = useConsumer(kPlayPageId);
  const { pageId, movie: currentData } = pageData ?? {};

  const { isDarkMode } = useDarkMode();
  const { isMobile } = useBreakpoint();
  const { jumpToPage } = useHomePages();

  const {
    loading: _loading,
    noData: _noData,
    data: ipfsData,
  } = usePlayIPFSData({ cid, data: currentData });
  const movie: FeiyuMovie | undefined = currentData ?? ipfsData;
  const playList = movie?.videos.map((e) => e.url) ?? [];
  const loading = movie ? false : _loading;
  const noData = movie ? movie.videos.length < 1 : _noData;
  const title = movie?.name ?? (loading ? '?????????' : '????????????');

  const [sharing, setSharing] = useState(false);
  const [shareURL, setShareURL] = useState<string>('');

  const $ShareModal = (
    <Modal
      title="??????????????? ????"
      visible={isNotEmpty(shareURL)}
      onCancel={() => setShareURL('')}
      footer={null}
      style={{
        width: 'auto',
        maxWidth: '400px',
        margin: '20px',
      }}
    >
      <Text style={{ padding: '20px', color: '#3d7ff6' }}>{shareURL}</Text>
    </Modal>
  );

  // ????????????
  const share = async () => {
    if (sharing) {
      Message.info('?????????????????????????????????');
      return;
    }
    setSharing(true);
    const _cid = isEmpty(cid) ? await ipfs.writeJson(movie) : cid;
    if (_cid) {
      const shareUrl = new URL(window.location.href.replace('#/', ''));
      shareUrl.searchParams.set('cid', _cid);
      const url = shareUrl.href.replace('/home', '/#/home');
      const success = await clipboard.write(url);
      if (success) {
        Message.info('?????????????????????');
      } else {
        setShareURL(url);
      }
    } else {
      Message.info('????????????');
    }
    setSharing(false);
  };

  // ???????????????
  const back = async () => {
    const searchPage = router.pages
      .slice()
      .reverse()
      .find((e) => e.path === '/home/search');
    if (searchPage) {
      // ??????????????????
      jumpToPage('search', { query: searchPage.query, data: searchPage.data });
    } else {
      // ????????????
      jumpToPage('hot');
    }
  };

  const [reverseEPs, setReverseEPs] = useState(false);
  let videos = movie?.videos ?? [];
  if (reverseEPs) {
    videos = videos.slice().reverse();
  }

  // ??????????????????
  const [currentIdx, setCurrentIdx] = useState(ep - 1);
  const startPlay = (idx: number) => {
    if (idx !== currentIdx) {
      setCurrentIdx(idx);
      // ??????????????????(?????????????????????)
      addSearchParams({ ep: idx + 1 });
    }
  };
  useEffect(() => {
    // ?????????????????????????????????????????????????????????????????????
    startPlay(0);
    // ????????????????????????
    setReverseEPs(false);
  }, [pageId]);
  useEffect(() => {
    // ???query?????? ep ???????????????????????????
    if (currentIdx !== ep - 1) {
      setCurrentIdx(ep - 1);
    }
  }, [ep]);
  const currentVideo = movie?.videos?.[currentIdx];

  // ??????????????????
  const titleRef = useRef(document.title);
  if (currentVideo && isActive) {
    document.title = `${movie.name}???${currentVideo.name}`;
  }
  useEffect(() => {
    if (!isActive) {
      document.title = titleRef.current;
    }
  }, [isActive]);

  // PC ????????????????????????
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
      ??????
    </Button>
  );

  const $PlayList = (
    <Column
      width={isMobile ? '100%' : '320px'}
      height={isMobile ? undefined : playerSize?.height}
      maxHeight={isMobile ? undefined : playerSize?.height}
      alignItems="start"
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
          ? `${movie!.site}???${currentVideo!.name}`
          : movie?.site}
      </Text>
      {isNotEmpty(movie?.desp) ? (
        <Text width="100%" maxLines={2} expandable padding="5px 0">
          {movie?.desp}
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
            ??????({videos.length})
          </Text>
          <Button
            icon={<IconSwap />}
            onClick={() => {
              setReverseEPs(!reverseEPs);
            }}
          >
            {!reverseEPs ? '??????' : '??????'}
          </Button>
        </Row>
      ) : (
        <Box />
      )}
      <Expand className="hide-scollbar" overflowY="scroll" margin="10px 0 0 0">
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
            ??????
          </Button>
          <Expand justifyContent="center">
            <Text fontWeight="500" maxLines={1} width="100%" textAlign="center">
              {currentVideo
                ? `????????????: ${currentVideo.name}`
                : `??? ${title} ???`}
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
  const [data] = useConsumer<any>(kCurrentSearchMovies);
  const { movies = [], searching, sort } = data ?? {};
  const [pageData] = useConsumer(kPlayPageId);
  const { movie: currentMovie } = pageData ?? {};
  const rebuild = useRebuild();
  // ??????????????????????????????1?????????????????????????????????
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
            ????????????({movies.length})
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
          ??????
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
          {searching ? '?????????...' : "???????????????????????? ???'??'???"}
        </Box>
      </Row>
    </Column>
  ) : (
    <Box />
  );
};

export default <Play />;
