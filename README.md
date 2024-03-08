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
- 💎 ｜使用去中心化存储（IPFS）

# 🔥 预览

![](screenshots/mobile-preview.jpg)

![](screenshots/play-preview.jpg)

# 🚀 启动

[![Docker Image Version](https://img.shields.io/docker/v/idootop/feiyu?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/feiyu)

请先打开 `.feiyu.ts` 文件，按照下面的参数说明配置好，然后使用以下命令启动 docker：

```shell
# todo 镜像尚未发布，敬请期待
docker run -d \
    -p 3000:80 \
    -v $(pwd)/.feiyu.ts:/app/.feiyu.ts \
    idootop/feiyu:1.0.0
```

## 参数说明

### 搜索源 (searchProviders)

要想正常使用飞鱼，你需要先配置「搜索源」。搜索源之于飞鱼，就好比光盘之于影碟机，磁带之于播放器。

飞鱼支持 [苹果 CMS](https://magicblack.github.io/)、[飞飞 CMS](https://www.feifeicms.org/) 等格式的搜索 API，如果你没听说过，请自行百度了解更多。

> 注意：飞鱼只是一个在线视频播放器，并没有内置任何影视资源。

### 请求代理 (proxy)

为了让飞鱼能够在网页端正常使用，需要使用飞鱼专用的请求代理云函数，详见[飞鱼 Proxy](#%EF%B8%8F-%E9%A3%9E%E9%B1%BC-proxy)。

### IPFS（可选）

飞鱼内部默认使用 [NFT.storage](https://nft.storage/) 向 IPFS 中写入数据，当你在分享影片或导出订阅配置时，需要用到此服务。

[IPFS（InterPlanetary File System）](https://ipfs.tech/)是一种点对点分布式文件存储和传输系统，旨在创建一个更加开放、高效、安全的网络，使用户可以更轻松地共享和访问数据。飞鱼使用 IPFS 作为去中心化存储，使数据的存储和传输更加安全、私密和高效。

#### Gateway

为了访问 IPFS 中的数据，你需要先配置 IPFS Gateway，常见的 IPFS 公共网关有 ipfs.io、dweb.link 等，你可以在此处查看更多信息：[https://ipfs.github.io/public-gateway-checker/](https://ipfs.github.io/public-gateway-checker/)

#### NFT.storage

[NFT.storage](https://nft.storage/) 提供免费的去中心化存储服务，同时支持 [IPFS](https://ipfs.tech/) 和 [Filecoin](https://filecoin.io/)。你可以到 [NFT.storage](https://nft.storage/) 免费注册账号并申请 API Key，然后回到飞鱼设置页面修改你的 IPFS token。

# ⚡️ 部署

## 🐟 飞鱼主项目

```bash
# 切换到项目所在路径
cd packages/feiyu

# 安装依赖，打包项目（构建产物在 dist 目录下）
yarn && yarn build
```

## 🕷️ 飞鱼 Proxy

为了解决 Web 环境下，访问第三方资源跨域的问题，飞鱼内置了一个 Proxy 云函数，通过服务端转发网络请求。你可以将其部署至 [腾讯云函数](https://cloud.tencent.com/product/scf)（付费）或 [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart)（免费）。

### SCF 👉 [feiyu-proxy](packages/feiyu-proxy)

```bash
# 切换到项目所在路径
cd packages/feiyu-proxy

# 安装/更新 SCF 最新版本
yarn global add serverless-cloud-framework@latest

# 安装依赖，部署项目
yarn && yarn deploy
```

### Vercel 👉 [feiyu-proxy-vercel](packages/feiyu-proxy-vercel)

```bash
# 切换到项目所在路径
cd packages/feiyu-proxy-vercel

# 安装/更新 Vercel 最新版本
yarn global add vercel@latest

# 安装依赖，部署项目
yarn && yarn deploy
```

# 💻 其他

本项目基于飞鱼 [Flutter 版](https://github.com/idootop/feiyu_flutter)（iOS/Android），进一步扩展支持 Web 端和桌面端。

# 🚨 免责声明

1. 本项目(飞鱼)是一个开源的视频播放器软件，仅供个人合法地点播、学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
2. 本软件仅作为一个通用播放器使用，不针对任何特定内容提供源，用户应自行判断所播放内容的合法性并承担相应责任，开发者对用户播放的任何内容不承担任何责任。
3. 用户在使用本软件时，必须完全遵守所在地区的法律法规，严禁将本软件用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
4. 用户使用本软件所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本软件即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。
