export default {
  /**
   * 资源站
   */
  searchProviders: [
    {
      key: '资源站1',
      api: 'https://api1.example.com/api.php/provide/vod/at/xml',
    },
    {
      key: '资源站2',
      api: 'https://api2.example.com/api.php/provide/vod/at/xml',
    },
  ],
  /**
   * 在首页展示的热门影视
   *
   * 也可以是返回 HotMovie[] 数据的 JSON 接口
   * 
   * 比如：https://example.com/hotMovies.json，返回值：[{"title":"漫长的季节",...}, ...]
   */
  hotMovies: [
    {
      id: '26302614',
      isNew: false,
      title: '请回答1988',
      cover:
        'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg',
      rate: '9.7',
    },
  ],
  /**
   * 代理接口
   * 
   * 用于解决网页端搜索接口 CORS 的问题
   * 
   * 注意：需要使用飞鱼专用的代理云函数，非常规的 http_proxy 
   */
  proxy: 'https://example.com/release/proxy',
  /**
   * 去中心化存储
   * 
   * 用于生成分享链接，导出订阅信息
   */
  ipfs: {
    /**
     * 请到 https://nft.storage/ 自己申请 API key（免费）
     */
    token: 'xxxxxxxx',
    /**
     * IPFS 网关，用于通过 cid 获取文件
     */
    gateway: 'https://nftstorage.link/ipfs/{{cid}}',
  },
};
