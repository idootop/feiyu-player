# 飞鱼 Proxy

有些视频源可能无法直接在网页端使用，这是由于浏览器的同源策略限制，无法直接访问第三方资源。

为解决这个跨域问题，飞鱼提供了一个专用的请求代理服务：飞鱼 Proxy

> 注意: 这个代理服务并非常规的 http_proxy，而是使用飞鱼私有的代理协议，转发客户端发出的网络请求。

你可以使用以下命令，免费部署飞鱼 Proxy 到 [Vercel](https://vercel.com)（一个云服务提供，提供了便捷的 Serverless 云函数部署和管理功能）:

```bash
# 克隆本项目
git clone https://github.com/idootop/feiyu-player && cd feiyu-player

# 切换到项目所在路径
cd packages/feiyu-proxy-vercel

# 安装并更新 Vercel CLI 到最新版本
yarn global add vercel@latest

# 安装依赖，部署项目
yarn && yarn deploy
```

执行最后一条命令后，Vercel CLI 会启动浏览器并引导你完成免费注册和部署过程。待部署完成后，你会获得一个访问地址，请将此地址复制，并按照下面的示例，正确填入订阅配置中。

```json
{
  "proxy": "https://xxx.vercel.app/api/proxy"
}
```

这样就可以通过该代理服务，正常搜索和访问各种第三方视频资源了。