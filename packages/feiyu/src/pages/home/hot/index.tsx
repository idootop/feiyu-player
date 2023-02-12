import './style.css';

import { Rate } from '@arco-design/web-react';

import { Box } from '@/components/Box';
import { Column, Row } from '@/components/Flex';
import { LazyImage } from '@/components/LazyImage/LazyImage';
import { Loading } from '@/components/Loading';
import { SearchEmpty } from '@/components/SearchEmpty';
import { Text } from '@/components/Text';
import { PageBuilder } from '@/pages/app';
import { useInit } from '@/services/store/useStore';
import { colors } from '@/styles/colors';
import { DoubanHotMovie } from '@/utils/douban';
import { useSearchHotMovies } from '@/utils/douban/useSearchHotMovies';

import { useHomePages } from '..';

const Hot = () => {
  const {
    search,
    initial,
    searching,
    datas: hotMovies,
    noData,
  } = useSearchHotMovies();
  const { jumpToPage } = useHomePages();
  useInit(() => {
    search('refresh');
  });
  return initial ? (
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
      <SearchEmpty />
    </Column>
  ) : (
    <>
      <Box className="movie-grid">
        {[...hotMovies].map((movie) => (
          <MovieItem key={movie.id} movie={movie} jumpToPage={jumpToPage} />
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
          {searching ? '加载中...' : "没有更多了，喵呜 ฅ'ω'ฅ"}
        </Box>
      </Row>
    </>
  );
};

export default (
  <PageBuilder>
    <Hot />
  </PageBuilder>
);

const MovieItem = (props: { movie: DoubanHotMovie; jumpToPage: any }) => {
  const { movie, jumpToPage } = props;

  const onClick = async () => {
    jumpToPage('search', {
      query: {
        movie: movie.title,
      },
    });
  };

  return (
    <Column width="100%" cursor="pointer" onClick={onClick}>
      <LazyImage src={movie.cover} />
      <Row
        className="star"
        style={{
          padding: '10px 0 5px 0',
          fontWeight: 'bold',
        }}
      >
        <Rate
          defaultValue={parseFloat(movie.rate) / 2}
          allowHalf
          readonly
          style={{
            marginRight: '4px',
          }}
        />
        {movie.rate === '0' ? '未知' : movie.rate}
      </Row>
      <Text
        maxLines={1}
        style={{
          width: '100%',
          textAlign: 'center',
          color: colors.text3,
          fontWeight: '500',
        }}
      >
        {movie.title}
      </Text>
    </Column>
  );
};
