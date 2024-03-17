import {
  Button,
  Divider,
  Empty,
  Image,
  Input,
  Link,
  List,
  Modal,
  Rate,
} from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import { useCallback, useEffect } from 'react';
import { useXState } from 'xsta';

import { Box } from '@/components/Box';
import { Column, Expand, Row } from '@/components/Flex';
import { InputKey } from '@/components/InputKey';
import { Loading } from '@/components/Loading';
import { LongText } from '@/components/LongText';
import { Text } from '@/components/Text';
import { APPConfig } from '@/data/config';
import { randomMovie } from '@/data/movies';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useRefCallback } from '@/hooks/useRefCallback';
import { useScreen } from '@/hooks/useScreen';
import { colors } from '@/styles/colors';
import { DoubanSearchDetail } from '@/utils/douban';
import { useSearchKeywords } from '@/utils/douban/useSearchKeywords';
import { isEmpty } from '@/utils/is';

import { useHomePages } from '../pages/home/useHomePages';

const kShowSearchModal = 'showSearchModal';
export const SearchButton = () => {
  const { isXS } = useBreakpoint();
  const [_, setShowSearchModal] = useXState(kShowSearchModal, false);
  const openSearchModalRef = useRefCallback(() => {
    setShowSearchModal(true);
  });

  const onKeyDown = useCallback((event) => {
    if (event.metaKey && event.key === 'k') {
      // command + K
      event.preventDefault();
      openSearchModalRef.current();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <>
      <SearchModal />
      {isXS ? (
        <Expand>
          <Button
            shape="round"
            type="secondary"
            onClick={openSearchModalRef.current}
            style={{ margin: '0 16px', width: '100%', color: colors.text3 }}
            icon={<IconSearch style={{ color: colors.text3 }} />}
          >
            搜索
          </Button>
        </Expand>
      ) : (
        <div
          className="ac-navbar-search-input"
          onClick={openSearchModalRef.current}
        >
          <div className="ac-navbar-search-input-left">
            <IconSearch style={{ color: colors.text, verticalAlign: '-1px' }} />
            <span className="ac-navbar-search-input-placeholder">搜索</span>
          </div>
          <Row>
            <InputKey>⌘</InputKey>
            <InputKey>K</InputKey>
          </Row>
        </div>
      )}
    </>
  );
};

const SearchModal = () => {
  const [showSearchModal, setShowSearchModal] = useXState(kShowSearchModal);
  const { jumpToPage } = useHomePages();
  const { isMobile } = useBreakpoint();

  const {
    initial,
    searching,
    search,
    reset,
    query: movie,
    datas: movies,
    noData,
  } = useSearchKeywords();

  const closeModal = () => {
    setShowSearchModal(false);
    reset();
  };

  const searchMovie = (name: string) => {
    closeModal();
    jumpToPage('search', {
      query: {
        movie: name,
      },
    });
  };

  const onClickItem = (movie: DoubanSearchDetail) => searchMovie(movie.title);

  const onSearch = (s: string, props?: { isSubmit: boolean }) => {
    const isSubmit = props?.isSubmit;
    if (isEmpty(s.trim())) {
      reset();
      if (isSubmit) {
        closeModal();
      }
    } else {
      if (isSubmit) {
        searchMovie(s.trim());
      } else {
        search(s.trim());
      }
    }
  };

  const $SearchHeader = (
    <Row minHeight="60px" width="100%" padding="0 20px">
      <IconSearch
        style={{
          width: '20px',
          height: '20px',
        }}
      />
      <Expand
        style={{
          padding: '0 4px',
        }}
      >
        <Input
          allowClear
          placeholder={`👀 看点什么？「 ${randomMovie()} 」`}
          value={movie}
          onChange={onSearch}
          onPressEnter={(event: any) => {
            onSearch(event.target.value, { isSubmit: true });
          }}
          style={{
            border: 'none',
            background: 'transparent',
          }}
        />
      </Expand>
      <InputKey onClick={closeModal}>{isMobile ? '关闭' : 'ESC'}</InputKey>
    </Row>
  );

  const _scale = isMobile ? 0.8 : 0.6;
  const _imgWidth = `${80 * _scale}px`;
  const _imgHeight = `${112 * _scale}px`;

  const $SearchResults = initial ? (
    <Box />
  ) : searching && noData ? (
    <Column width="100%" height="300px" justifyContent="center">
      <Loading />
    </Column>
  ) : noData ? (
    <Column width="100%" height="300px" justifyContent="center">
      <Empty
        description={
          <>
            暂无相关影片, 按
            {
              <InputKey
                style={{
                  display: 'inline-block',
                  margin: '0 4px',
                }}
                onClick={() => {
                  onSearch(movie!, { isSubmit: true });
                }}
              >
                Enter
              </InputKey>
            }
            键继续搜索
          </>
        }
      />
    </Column>
  ) : (
    <ModalBodyHeight isMobile={isMobile}>
      {(maxHeight) => (
        <List
          style={{ maxHeight }}
          dataSource={
            searching ? [...movies, 'searching'] : [...movies, 'noData']
          }
          render={(movie: any) => (
            <List.Item key={movie.id ?? movie}>
              {movie === 'noData' ? (
                <Row
                  width="100%"
                  height="65px"
                  justifyContent="center"
                  color={colors.text3}
                >
                  {searching ? <Loading size={18} /> : <Box />}
                  <Box marginLeft={searching ? '8px' : '0px'}>
                    {searching ? '搜索中...' : "没有更多了，喵呜 ฅ'ω'ฅ"}
                  </Box>
                </Row>
              ) : movie === 'searching' ? (
                <Row width="100%" height="65px" justifyContent="center">
                  <Loading />
                </Row>
              ) : (
                <SearchItem
                  movie={movie}
                  key={movie.id}
                  width={_imgWidth}
                  height={_imgHeight}
                  onClickItem={onClickItem}
                />
              )}
            </List.Item>
          )}
        />
      )}
    </ModalBodyHeight>
  );

  const $Feiyu = initial ? (
    <Column width="100%" height="300px" justifyContent="center">
      <Empty
        icon={
          <Box fontSize="64px" color={colors.text} margin="20px">
            <img
              src="/logo.gif"
              style={{
                objectFit: 'cover',
                width: '64px',
                height: '64px',
                borderRadius: '10px',
              }}
            />
          </Box>
        }
        description={
          <>
            <Box
              fontSize="16px"
              fontWeight="bold"
              color={colors.text2}
              margin="20px"
            >
              飞鱼 v{APPConfig.version}
            </Box>
            Made with ❤️ by
            <Link
              href="https://github.com/idootop/feiyu-player"
              target="_blank"
            >
              {' '}
              Del.Wang{' '}
            </Link>
          </>
        }
      />
    </Column>
  ) : (
    <Box />
  );

  return (
    <Modal
      className="arco-modal-search"
      autoFocus
      visible={showSearchModal}
      onCancel={closeModal}
      closeIcon={null}
      footer={null}
      alignCenter={false}
      mountOnEnter
      unmountOnExit
    >
      <Column
        minHeight="382px"
        width={isMobile ? '100vw' : '520px'}
        height={isMobile ? '100vh' : 'auto'}
        maxHeight={isMobile ? 'auto' : '680px'}
        borderRadius={isMobile ? '0px' : '10px'}
        background={colors.bg3}
        overflow="hidden"
      >
        {$SearchHeader}
        <Divider style={{ margin: '0' }} />
        <Expand width="100%">
          <>
            {$SearchResults}
            {$Feiyu}
          </>
        </Expand>
      </Column>
    </Modal>
  );
};

const ModalBodyHeight = (props: {
  isMobile: boolean;
  children: (maxHeight: string) => any;
}) => {
  const { isMobile } = props;
  const { height: modalHeight } = useScreen();
  const maxHeight = `${(isMobile ? modalHeight : 680) - 60}px`;
  return props.children(maxHeight);
};

const SearchItem = (props: {
  movie: DoubanSearchDetail;
  onClickItem: (movie: DoubanSearchDetail) => void;
  width: string;
  height: string;
}) => {
  const { movie, width, height, onClickItem } = props;
  return (
    <Box
      onClick={() => {
        onClickItem(movie);
      }}
    >
      <List.Item.Meta
        style={{
          cursor: 'pointer',
        }}
        avatar={
          <Image
            preview={false}
            src={movie.img}
            width={width}
            height={height}
            style={{
              objectFit: 'cover',
            }}
            referrerPolicy="no-referrer"
          />
        }
        title={
          <>
            <Text maxLines={1}>{movie.longTitle ?? movie.title}</Text>
            <LongText />
          </>
        }
        description={
          <>
            {movie.longDesc ?? movie.desc ? (
              <Rate
                style={{
                  padding: '5px 0',
                }}
                defaultValue={parseFloat(movie.rating) / 2}
                allowHalf
                readonly
              />
            ) : (
              <Text
                style={{
                  padding: '5px 0',
                  fontWeight: 'bold',
                  color: colors.primaryHover,
                }}
              >
                {movie.year}
              </Text>
            )}
            <Text
              maxLines={2}
              style={{
                color: colors.text2,
              }}
            >
              {movie.longDesc ?? movie.desc ?? movie.comment ?? movie.subTilte}
            </Text>
          </>
        }
      />
    </Box>
  );
};
