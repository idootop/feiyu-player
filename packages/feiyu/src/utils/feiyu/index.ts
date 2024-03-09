import { appConfig } from '@/data/config';
import { http } from '@/services/http';

import { withAbort } from '../abort';
import { isObject } from '../is';
import { isValidM3U8 } from '../m3u8/valid';
import { parseXML } from '../xml';

interface SearchProvider {
  key: string;
  api: string;
}

interface MovieBasic {
  id: string;
  name: string;
}

interface Movie {
  site: string; // 资源站
  name: string; // 电影名称
  desc: string; //简介
  image: string; //封面
  videos: Video[]; //播放列表
}

interface Video {
  name: string;
  url: string;
}

export type FeiyuMovie = Movie & { videos: Video[] };
type SearchCallback = (data: FeiyuMovie) => void;

const _clearDesc = (str?: string) => {
  return (str ?? '暂无简介')
    .replace(/\s+/g, ' ') // 多个连续空格，替换成单个空格
    .replace(/\n/g, '')
    .replace(/<.*?>/g, '');
};

class Feiyu {
  /**
   * 搜索电影
   */
  async search(
    name: string,
    config?: {
      callback?: SearchCallback;
      signal?: AbortSignal;
      concurrent?: boolean;
    },
  ) {
    const { callback, signal, concurrent = false } = config ?? {};
    const results: FeiyuMovie[] = [];
    const sites: any = (await appConfig.get()).videoSources ?? [];
    if (!concurrent) {
      for (const site of sites) {
        // 搜索电影列表
        const movies = await this._search(site, name, signal);
        for (const movie of movies) {
          const result = await this._detail(site, movie.id, signal);
          const isValid =
            result.videos[0] &&
            (await withAbort(isValidM3U8(result.videos[0].url), signal));
          if (isValid) {
            callback?.(result);
            results.push(result);
          }
        }
      }
    } else {
      await Promise.all(
        sites.map((site) =>
          (async () => {
            // 搜索电影列表
            const movies = await this._search(site, name, signal);
            await Promise.all(
              movies.map((movie) =>
                (async () => {
                  const result = await this._detail(site, movie.id, signal);
                  const isValid =
                    result.videos[0] &&
                    (await withAbort(
                      isValidM3U8(result.videos[0].url),
                      signal,
                    ));
                  if (isValid) {
                    callback?.(result);
                    results.push(result);
                  }
                })(),
              ),
            );
          })(),
        ),
      );
    }
    // 排序最终结果
    return results.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
  }

  /**
   * 搜索资源
   */
  private async _search(
    site: SearchProvider,
    videoName: string,
    signal?: AbortSignal,
  ): Promise<MovieBasic[]> {
    const url = `${site.api}?wd=${encodeURI(videoName)}`;
    const result = await http.proxy.get(url, undefined, { signal });
    const json = await parseXML(result);
    let videoList = json?.rss?.list?.video ?? [];
    if (isObject(videoList)) {
      videoList = [videoList];
    }
    // 序列化
    videoList = videoList
      .map((e) => ({
        id: e.id, // 资源ID
        name: e.name, // 名称
        type: e.type ?? '', //分类
      }))
      .filter((e) => e.id && e.name);

    if (!appConfig.movieCommentaries) {
      // 去掉电影解说
      videoList = videoList.filter(
        (e) =>
          !(
            e.type.includes('解说') || // 电影解说
            e.name.includes('电影解说') || // 钢铁侠[电影解说]
            ((e.name.includes('，') || // 11年前的《钢铁侠》，它凭什么成为漫威最好的电影   漫威终局之战系列
              e.name.includes('！') || // 钢铁侠妮妮新片《多力特的奇幻冒险》口碑票房扑街！真的有那么不堪吗！？
              e.name.includes('？') || // 钢铁侠妮妮新片《多力特的奇幻冒险》口碑票房扑街！真的有那么不堪吗！？
              e.name.includes('《') || // 11年前的《钢铁侠》，它凭什么成为漫威最好的电影   漫威终局之战系列
              e.name.includes('[')) && // 钢铁侠[电影解说]
              e.name.length > 10)
          ),
      );
    }

    if (!appConfig.adultContent) {
      // 去掉伦理片
      videoList = videoList.filter((e) => !e.type.includes('伦理'));
    }
    return videoList;
  }

  /**
   * 获取播放列表
   */
  private async _detail(
    site: SearchProvider,
    videoId: string,
    signal?: AbortSignal,
  ): Promise<Movie> {
    const url = `${site.api}?ac=videolist&ids=${videoId}`;
    const result = await http.proxy.get(url, undefined, { signal });
    const json = await parseXML(result);
    const video = json?.rss?.list?.video;
    let videoList = video?.dl?.dd ?? [];
    if (isObject(videoList)) {
      videoList = [videoList];
    }
    // 解析电影详细信息
    const videoInfo: Movie = {
      site: site.key,
      name: video?.name,
      desc: _clearDesc(video?.des),
      image: video?.pic,
      videos: [],
    };
    // 解析 m3u8 播放列表
    videoList = videoList.find((e) => e?._t?.includes('.m3u8'))?._t ?? '';
    videoList = videoList
      .replace(/\$+/g, '$')
      .split('#')
      .map((e) => {
        const v = e?.split('$') ?? [];
        return {
          name: v[0] ?? '未知',
          url: v[1] ?? '未知',
        };
      })
      .filter((e) => e.url.startsWith('http'));
    // 排序
    videoList = videoList.sort((a, b) => {
      const c = a.name;
      const d = b.name;
      return c.localeCompare(d, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
    videoInfo.videos = videoList;
    return videoInfo;
  }
}

export const feiyu = new Feiyu();
