import { http } from '@/services/http';

import { jsonDecode } from '../base';
import { isEmpty, isString } from '../is';

export interface DoubanHotMovie {
  id: string;
  isNew: boolean;
  title: string;
  cover: string;
  rate: string;
}

export interface DoubanSearchResult {
  id: string;
  title: string;
  img: string;
  /**
   * 副标题（原语言标题）
   */
  subTilte?: string;
  /**
   * 集数（10集）
   */
  episode?: string;
  year?: string;
}

export interface DoubanMovieDetail {
  /**
   * 评分（9.1）
   */
  rating: string;
  /**
   * 上映日期/年份（2003-09-07）
   */
  date: string;
  /**
   * 长标题：爱的迫降 사랑의 불시착 (2019)
   */
  longTitle?: string;
  /**
   * 长介绍：李政孝 / 玄彬 / 孙艺珍 / 韩国 / 8.3分
   */
  longDesp?: string;
  /**
   * 简介
   */
  desp?: string;
  /**
   * 标签（剧情 / 喜剧 / 爱情）
   */
  tags?: string;
  /**
   * 集数（10集）
   */
  episode?: string;
  /**
   * 短评：就高个子，脸发白的那个，他扛不动……哈哈哈😁😁 @婷婷
   */
  comment?: string;
  /**
   * 地区（韩国）
   */
  region?: string;
  /**
   * 导演
   */
  directors?: string[];
  /**
   * 演员
   */
  actors?: string[];
  /**
   * 时长（120分钟）
   */
  duration?: string;
}

export type DoubanSearchDetail = DoubanSearchResult & DoubanMovieDetail;

export const douban = {
  async getDetail(
    name: string,
    signal?: AbortSignal,
  ): Promise<DoubanSearchDetail | undefined> {
    const movies = await douban.search(name, signal);
    if (movies.length < 1) return;
    const detail = await douban.detail(movies[0].id, signal);
    return {
      ...movies[0],
      ...detail,
    };
  },

  async getHotMovies(signal?: AbortSignal): Promise<DoubanHotMovie[]> {
    let movies: any = [];
    await Promise.all(
      [
        'https://movie.douban.com/j/search_subjects?type=movie&tag=热门&page_limit=50&page_start=0',
        'https://movie.douban.com/j/search_subjects?type=tv&tag=热门&page_limit=50&page_start=0',
      ].map((url) =>
        (async () => {
          const result = await http.proxy.get(url, undefined, { signal });
          const datas = result?.subjects;
          if (datas) {
            movies = [...movies, ...datas];
          }
        })(),
      ),
    );
    let finalMovies: DoubanHotMovie[] = movies.map((e) => ({
      id: e.id,
      isNew: e.is_new,
      title: e.title,
      cover: e.cover,
      rate: isEmpty(e.rate) ? '0' : e.rate,
    }));
    const getRate = (a: DoubanHotMovie) => {
      return (
        a.rate +
        (a.rate.includes('.') ? (a.isNew ? '1' : '0') : a.isNew ? '.1' : '.0')
      );
    };
    // 排序
    finalMovies = finalMovies.sort((a, b) => {
      return getRate(b).localeCompare(getRate(a), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
    return finalMovies;
  },

  async searchMovies(
    name: string,
    config?: { callback?: (DoubanSearchDetail) => void; signal?: AbortSignal },
  ): Promise<DoubanSearchDetail[] | undefined> {
    const { callback, signal } = config ?? {};
    const results: DoubanSearchDetail[] = [];
    const movies = await douban.search(name, signal);
    if (movies.length < 1) return [];
    await Promise.all(
      movies.map((movie) =>
        (async () => {
          // 查询电影详情
          const detail = await douban.detail(movie.id, signal);
          const result = {
            ...movie,
            ...detail,
          };
          results.push(result);
          callback?.(result);
        })(),
      ),
    );
    return results;
  },

  async search(
    name: string,
    signal?: AbortSignal,
  ): Promise<DoubanSearchResult[]> {
    const url =
      'https://movie.douban.com/j/subject_suggest?q=' +
      encodeURIComponent(name);
    const results = (await http.proxy.get(url, undefined, { signal })) ?? [];
    return (results as any[])
      .filter((e) => e.type === 'movie')
      .map((e) => ({
        id: e.id,
        title: e.title,
        img: e.img,
        year: e.year,
        episode: isEmpty(e.episode) ? '暂无' : '',
        subTilte: e.sub_title,
      }));
  },

  async detailHTML(
    id: string,
    signal?: AbortSignal,
  ): Promise<DoubanMovieDetail> {
    const result: string =
      (await http.proxy.get(
        `https://movie.douban.com/subject/${id}/`,
        undefined,
        {
          signal,
        },
      )) ?? '';
    const dataStr = result
      .replace(/\s/g, '')
      .match(/ld\+json">(.*?)<\/script>/)?.[1];
    const data = jsonDecode(dataStr) ?? {};
    const longTitle = result.match(
      /<input type="hidden" name="title" value="(.*?)">/,
    )?.[1];
    let longDesp = result.match(
      /<input type="hidden" name="desc" value="(.*?)">/,
    )?.[1];
    const ratingPeople = longDesp?.match(/\(.*评价\)/)?.[0];
    longDesp = longDesp
      ?.replace('导演 ', '')
      .replace(' 主演 ', ' / ')
      .replace(ratingPeople ?? '', '');
    if (longDesp?.startsWith(' / ')) {
      longDesp = longDesp.replace(' / ', '');
    }
    const date = data['datePublished'] ?? '未知';
    const tags = data['genre']?.join(' / ') ?? '未知';
    const desp = data['description'];
    const rating = data['aggregateRating']?.['ratingValue'] ?? '未知';
    return {
      longTitle,
      longDesp,
      date: isString(date) ? date : date[0],
      tags,
      desp,
      rating,
    };
  },

  async detail(id: string, signal?: AbortSignal): Promise<DoubanMovieDetail> {
    const result = await http.proxy.get(
      `https://movie.douban.com/j/subject_abstract?subject_id=${id}`,
      undefined,
      {
        signal,
      },
    );
    const data = result?.subject;
    const date = data?.release_year ?? '未知';
    const rating = data?.rate ?? '未知';
    const tags = data?.types?.join(' / ');
    const episode = data?.episodes_count
      ? data.episodes_count + '集'
      : undefined;
    const comment = data?.short_comment?.content
      ? `${data.short_comment.content}${
          data.short_comment.author ? ' @' + data.short_comment.author : ''
        }`
      : undefined;
    const longTitle = data?.title;
    const directors = data?.directors;
    const actors = data?.actors;
    const region = data?.region;
    const duration = data?.duration;
    const peoples = [...(directors ?? []), ...(actors ?? [])].slice(0, 3);
    let longDesp: any = [
      ...peoples,
      ...(region ? [region] : []),
      ...(data?.rate ? [data.rate + '分'] : ['暂无评分']),
    ].join(' / ');
    if (!longDesp?.includes('/')) {
      longDesp = undefined;
    }
    return {
      longTitle,
      longDesp,
      date,
      tags,
      comment,
      rating,
      episode,
      directors,
      actors,
      region,
      duration,
    };
  },
};
