export const kAppConfig = {
  /**
   * 代理请求接口
   */
  httpProxy: 'https://xxx.example.com/release/proxy',
  /**
   * 热门电影榜单
   */
  hotMovies: 'https://xxx.example.com/hotMovies.json',
  /**
   * 资源站
   */
  movieSites: [
    {
      key: '测试资源站1',
      api: 'https://xxx.example1.com/api.php/provide/vod/at/xml',
    },
    {
      key: '测试资源站2',
      api: 'https://xxx.example2.com/api.php/provide/vod/at/xml',
    },
  ],
};
