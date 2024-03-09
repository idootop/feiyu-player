/**
 * IPFS 配置（用于生成分享链接，导入导出配置文件）
 */
interface IPFSConfig {
  /**
   * https://nft.storage/ API key
   */
  token?: string;
  /**
   * IPFS gateway
   */
  gateway?: string;
}

/**
 * 资源站
 */
interface SearchProvider {
  /**
   * 资源站名称
   */
  key: string;
  /**
   * 资源站接口
   */
  api: string;
}

/**
 * 热门电影
 */
export interface HotMovie {
  id: string; //      '26302614'
  isNew: boolean; //   false
  title: string; //   '请回答1988'
  cover: string; //   'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg'
  rate: string; //    '9.7'
}

/**
 * 订阅配置
 */
export interface Subscribe {
  /**
   * 配置版本号 (1.0.0)
   */
  version: string;
  /**
   * 订阅名称（不可编辑）
   */
  name: string;
  /**
   * 订阅链接（本地配置无此参数）
   */
  server?: string;
  /**
   * 最后更新时间
   */
  lastUpdate: number;
  /**
   * 完整配置
   */
  feiyu: FeiyuConfig;
}

export type FeiyuConfig = {
  /**
   * 资源站列表
   */
  videoSources?: SearchProvider[];
  /**
   * 首页热门电影
   */
  hotMovies?: HotMovie[] | string;
  /**
   * 网络请求代理地址
   */
  proxy?: string;
  /**
   * IPFS 配置（用于生成分享链接，导入导出配置文件）
   */
  ipfs?: IPFSConfig;
};
