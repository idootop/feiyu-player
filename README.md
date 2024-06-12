# 🐟 飞鱼

一个漂亮得不像实力派的跨端视频播放器 ✨

![](screenshots/play.webp)

# ✨ 特性

- **🐳 海量资源，随心搜索**: 支持多种视频源，聚合搜索，看你想看。
- **🦀 一键订阅，自由分享**: 一键订阅视频源，从此找资源不求人。
- **🦋 界面极简，超高颜值**: 颜值即正义，给你极致观影体验。
- **🦄 体积小巧，快如闪电**: 极至精简，安装包不足 10 MB。
- **🐟 随时随地，想看就看**: 网页、Windows、macOS、Linux 全平台支持。

# ⚡️ 快速开始

**官网**

[https://feiyu-player.xbox.work](https://feiyu-player.xbox.work)

**下载**

| 操作系统 | 下载链接                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| Windows  | [feiyu_windows_x86_64.exe](https://github.com/idootop/feiyu-player/releases/download/latest/feiyu_windows_x86_64.exe)   |
| macOS    | [feiyu_macos_universal.dmg](https://github.com/idootop/feiyu-player/releases/download/latest/feiyu_macos_universal.dmg) |
| Linux    | [feiyu_linux_x86_64.deb](https://github.com/idootop/feiyu-player/releases/download/latest/feiyu_linux_x86_64.deb)       |

**Docker**

飞鱼提供 Docker 镜像一键部署，用户无需手动编译即可快速体验。

[![Docker Image Version](https://img.shields.io/docker/v/idootop/feiyu?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/feiyu)

```shell
docker run -d -p 4399:3000 idootop/feiyu:latest
```

启动成功后，即可通过 [http://localhost:4399](http://localhost:4399) 访问飞鱼。

**自定义配置**

有关配置文件的编写格式和参数说明，请参考下面的 [📖 管理订阅](https://github.com/idootop/feiyu-player?tab=readme-ov-file#-%E7%AE%A1%E7%90%86%E8%AE%A2%E9%98%85) 部分。

如需自定义默认配置(如视频源等)，可在本地创建 `feiyu.json` 配置文件，并按如下方式挂载启动:

```shell
docker run -d -p 4399:3000 -v $(pwd)/feiyu.json:/app/feiyu.json idootop/feiyu:latest
```

注意：在 Windows 终端下需要将配置文件路径 `$(pwd)` 替换为绝对路径。

# 📖 管理订阅

为了更灵活的管理视频源等配置，飞鱼支持通过订阅来分享和导入配置文件。

你可以参考 [feiyu.example.json](https://github.com/idootop/feiyu-player/blob/main/feiyu.example.json) 文件，然后根据下面的参数说明配置自己的订阅。

## 视频源 (videoSources)

视频源相当于飞鱼播放器的"光盘"，没有配置视频源，飞鱼将无法搜索和播放任何内容。

作为一款通用播放器，**飞鱼本身不内置任何影视资源，也不提供或推荐任何特定的视频源**，用户需要自行添加符合规范的视频源。

飞鱼支持集成 [苹果 CMS](https://magicblack.github.io/)、[飞飞 CMS](https://www.feifeicms.org/) 等格式规范的视频源。如果你不了解这些格式，可以自行搜索了解更多详情。

```json
// 视频源参考配置格式
{
  "videoSources": [
    {
      "key": "视频源1",
      "api": "https://api1.example.com/api.php/provide/vod/at/xml"
    },
    {
      "key": "视频源2",
      "api": "https://api2.example.com/api.php/provide/vod/at/xml"
    }
  ]
}
```

## 热门影视 (hotMovies)

你可以通过静态/动态配置两种方式，自定义首页显示的热门影视列表。

### 静态配置

```json
{
  "hotMovies": [
    {
      "id": "26302614",
      "isNew": false,
      "title": "请回答1988",
      "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg",
      "rate": "9.7"
    },
    {
      "id": "25848328",
      "isNew": false,
      "title": "最后生还者 第一季",
      "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2884221114.jpg",
      "rate": "9.1"
    }
    // ...
  ]
}
```

### 动态配置

你也可以配置一个返回热门影视数据的远程 JSON 接口地址，如:

```json
{
  "hotMovies": "http://example.com/hotMovies.json"
}
```

该接口需返回一个符合上述静态配置格式的热门影视数组

```json
// http://example.com/hotMovies.json
[
  {
    "id": "26302614",
    "isNew": false,
    "title": "请回答1988",
    "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2272563445.jpg",
    "rate": "9.7"
  },
  {
    "id": "25848328",
    "isNew": false,
    "title": "最后生还者 第一季",
    "cover": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2884221114.jpg",
    "rate": "9.1"
  }
  // ...
]
```

## 请求代理 (proxy)

有些视频源可能无法直接在网页端使用，这是由于浏览器的同源策略限制，无法直接访问第三方资源。

为解决跨域问题，飞鱼提供了一个专用的请求代理服务，具体使用方法请查看飞鱼 Proxy [使用文档](https://github.com/idootop/feiyu-player/blob/main/packages/feiyu-proxy/README.md)。

> 注意: 此代理服务并非常规的 http_proxy，而是使用飞鱼私有的代理协议，不兼容其他代理服务。

## IPFS 配置（ipfs）

飞鱼使用 IPFS 作为去中心化存储，用于分享影片和导出订阅配置等场景。

[IPFS](https://ipfs.tech/) 是一种点对点分布式文件系统，旨在实现更开放、高效、安全的网络数据传输与共享。

### gateway

用于访问 IPFS 网络中的数据，常用的公共网关包括 ipfs.io、dweb.link 等。

### token

飞鱼默认使用 [NFT.storage](https://nft.storage/) 服务向 IPFS 网络中写入数据。

[NFT.storage](https://nft.storage/) 提供免费的去中心化存储服务，需注册账号获取 token 后方可使用。

# 🐟 关于飞鱼

飞鱼是一款跨平台的在线视频播放器。它最初基于 [Flutter](https://flutter.dev/) 框架开发，支持 iOS 和 Android 移动设备。本次开源的飞鱼项目，是在飞鱼 [Flutter 版](https://github.com/idootop/feiyu_flutter) 的基础上，进一步适配了网页端和桌面端，让人人都可以随时随地自由观影。

如果你对飞鱼有任何问题或建议，请提 [issue](https://github.com/idootop/feiyu-player/issues)。

**Enjoy!**

# 🚨 免责声明

1. 本项目(飞鱼)是一个开源的视频播放器软件，仅供个人合法地点播、学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
2. 本软件仅作为一个通用播放器使用，不针对任何特定内容提供源，用户应自行判断所播放内容的合法性并承担相应责任，开发者对用户播放的任何内容不承担任何责任。
3. 用户在使用本软件时，必须完全遵守所在地区的法律法规，严禁将本软件用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
4. 用户使用本软件所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本软件即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。
