# 🐟 飞鱼

一个漂亮得不像实力派的在线视频播放器 ✨

![](screenshots/home-preview.jpg)

# ✨ 特性

- 🌛 ｜亮暗色模式
- 💅 ｜极简，高颜值
- ✅ ｜开源免费无广告
- 📱 ｜适配 PC、移动端
- 🔍 ｜支持多源聚合搜索
- 📃 ｜支持导入导出订阅配置
- 📶 ｜支持 PWA ，可离线访问
- 🕷️ ｜内置请求代理，无惧跨域
- 💎 ｜使用去中心化存储（IPFS）分享资源

# 🔥 预览

![](screenshots/mobile-preview.jpg)

![](screenshots/play-preview.jpg)

# ⚙️ 配置

## 配置示例（JSON）

```json
{
    "feiyu": "config",
    "httpProxy": "https://xxx.xxx.com/release/proxy",
    "movieSites": [
        {
            "key": "资源站1",
            "api": "https://api1.xxx.com/api.php/provide/vod/at/xml"
        },
        {
            "key": "资源站2",
            "api": "https://api2.xxx.com/api.php/provide/vod/at/xml"
        }
    ],
    "ipfs": {
        "gateway": "https://gateway.pinata.cloud/ipfs/{{cid}}",
        "token": "xxxxxxxx"
    },
    "randomEmojis": [
        "🐮",
        "🐰"
    ],
    "recommendMovies": [
        "请回答1988",
        "东京爱情故事"
    ],
    "hotMovies": [
        {
            "id": "26302614",
            "isNew": false,
            "title": "请回答1988",
            "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg",
            "rate": "9.7"
        },
        {
            "id": "36036719",
            "isNew": false,
            "title": "快乐再出发 第二季",
            "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2885581294.jpg",
            "rate": "9.5"
        }
    ]
}
```

## 参数说明

### 请求代理 (httpProxy)

为了使飞鱼网页正常运转，你需要自行部署或使用第三方请求代理，详见[飞鱼 Proxy](#-飞鱼-Proxy)。

### 搜索源 (movieSites)

飞鱼理论上支持 [苹果 CMS](https://magicblack.github.io/)、[飞飞 CMS](https://www.feifeicms.org/) 等搜索 API，请自行百度了解更多。

> 注意：要想正常使用飞鱼，你可能需要先配置可用的「搜索源」。搜索源之于飞鱼，就好比光盘之于影碟机，磁带之于播放器。飞鱼只是一个在线视频播放器，没有内置任何数据。

### IPFS（可选）

[IPFS（InterPlanetary File System）](https://ipfs.tech/)是一种点对点分布式文件存储和传输系统，旨在创建一个更加开放、高效、安全的网络，使用户可以更轻松地共享和访问数据。飞鱼使用 IPFS 作为去中心化存储，使数据的存储和传输更加安全、私密和高效。

#### Gateway

为了访问 IPFS 中的数据，你需要先配置 IPFS Gateway，常见的 IPFS 公共网关有 ipfs.io、dweb.link 等，你可以在此处查看更多信息：[https://ipfs.github.io/public-gateway-checker/](https://ipfs.github.io/public-gateway-checker/)

#### NFT.strorage

[NFT.strorage](https://nft.storage/) 提供免费的去中心化存储服务，同时支持 [IPFS](https://ipfs.tech/) 和 [Filecoin](https://filecoin.io/)。飞鱼内部默认使用 [NFT.strorage](https://nft.storage/) 向 IPFS 中写入数据。
当你需要导出并分享数据时，你需要先在 [NFT.strorage] (https://nft.storage/)注册账号，申请API Key，然后到飞鱼设置页面填写并保存 API Key。

# ⚡️ 部署

## 🐟 飞鱼主项目

```bash
# 切换到飞鱼主项目
cd packages/feiyu

# 安装依赖，打包项目（构建产物在 dist 目录下）
yarn && yarn build
```

## 🕷️ 飞鱼 Proxy

为了解决 Web 环境下，访问第三方资源跨域的问题，飞鱼内置了一个 Proxy 云函数，通过服务端转发网络请求。你可以将其部署至 [腾讯云函数](https://cloud.tencent.com/product/scf)（付费）或 [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart)（免费）。

### SCF 👉 [feiyu-proxy](packages/feiyu-proxy)

```bash
# 安装/更新 SCF 最新版本
yarn global add serverless-cloud-framework@latest

# 安装依赖，部署项目
yarn && yarn deploy
```

### Vercel 👉 [feiyu-proxy-vercel](packages/feiyu-proxy-vercel)

```bash
# 安装/更新 Vercel 最新版本
yarn global add vercel@latest

# 安装依赖，部署项目
yarn && yarn deploy
```

## 🔧 自定义配置

你可以在 [packages/feiyu/src/data/default.ts](packages/feiyu/src/data/default.ts) ，修改飞鱼内置的默认配置，如代理地址，搜索源等。 配置参数示例如下：

```typescript
export const kDefaultConfig = {
  feiyu: 'config',
  /**
   * 代理请求接口（必填）
   */
  httpProxy: 'https://xxx.xxx.com/release/proxy',
  /**
   * 资源站（必填）
   */
  movieSites: [
    {
      key: '资源站1',
      api: 'https://api1.xxx.com/api.php/provide/vod/at/xml',
    },
    {
      key: '资源站2',
      api: 'https://api2.xxx.com/api.php/provide/vod/at/xml',
    },
  ],
  /**
   * IPFS 配置（用于生成分享链接，导入导出配置文件）
   */
  ipfs: {
    gateway: 'https://gateway.pinata.cloud/ipfs/{{cid}}',
    token: 'xxxxxxxx', // 🔥 请到 https://nft.storage/ 自己申请 API key（免费）
  },
  /**
   * 随机表情列表
   */
  randomEmojis: [
    '🐰',
  ],
  /**
   * 推荐电影列表
   */
  recommendMovies: [
    '请回答1988',
  ],
  /**
   * 热门电影榜单
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
  // 也可以是返回JSON格式数据的接口，方便获取最新的热门榜单
  // hotMovies: 'https://xxx.xx/hotMovies.json',
};
```

# 🚨 免责声明

本项目（飞鱼）仅供内部学习和交流使用，请勿用于商业用途。请在遵守当地法律的前提下使用本项目。本项目没有内置任何数据，用户使用本项目和自行维护的内容是在自己的意愿和责任下进行的，本项目对用户的行为不承担任何法律责任。
