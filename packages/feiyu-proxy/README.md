# 飞鱼 Proxy

有些视频源可能无法直接在网页端使用，这是由于浏览器的同源策略限制，无法直接访问第三方资源。

为解决此跨域问题，飞鱼提供了一个专用的请求代理服务：飞鱼 Proxy。

> 注意: 此代理服务并非常规的 http_proxy，而是使用飞鱼私有的代理协议，不兼容其他代理服务。

## Vercel 部署

你可以使用以下命令，免费部署飞鱼 Proxy 到 [Vercel](https://vercel.com):

```bash
# 克隆本项目
git clone https://github.com/idootop/feiyu-player && cd feiyu-player

# 切换到项目所在路径
cd packages/feiyu-proxy-vercel

# 安装并更新 Vercel CLI 到最新版本
npm install -g vercel@latest

# 安装依赖，部署项目
npm install && npm run build && npm run deploy
```

执行最后一条命令后，Vercel CLI 会启动浏览器并引导你完成免费注册和部署过程。

待部署完成后，你会获得一个访问地址，请将此地址复制，并按照下面的示例，正确填入订阅配置中。

```json
{
  "proxy": "https://example.vercel.app/api/proxy"
}
```

这样就可以通过该代理服务，正常搜索和访问各种第三方视频资源了。

## Docker 部署

[![Docker Image Version](https://img.shields.io/docker/v/idootop/feiyu?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/feiyu-proxy)

或者你也可以使用 Docker 镜像，在自己的服务器上部署飞鱼 Proxy。

```shell
docker run -d -p 4399:3000 idootop/feiyu-proxy:latest
```

待部署完成后，按照下面的示例，将 Proxy 地址正确填入订阅配置中。

```json
{
  "proxy": "https://[服务器 IP/域名]:[端口]/api/proxy"
}
```

## 本地开发

如果你想要在本地开发构建 Docker 镜像，可参考如下教程：

```shell
# 构建
docker build -t feiyu-proxy .

# 运行
docker run -d -p 4399:3000 feiyu-proxy
```
