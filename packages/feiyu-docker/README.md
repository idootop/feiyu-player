# 飞鱼 Docker

## 使用方法

飞鱼提供 Docker 镜像一键部署，用户无需手动编译即可快速体验。

[![Docker Image Version](https://img.shields.io/docker/v/idootop/feiyu?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/idootop/feiyu)

```shell
docker run -d -p 4399:3000 idootop/feiyu:latest
```

启动成功后，即可通过 [http://localhost:4399](http://localhost:4399) 访问飞鱼。

**自定义配置**

如需自定义默认配置(如视频源等)，可在本地创建 `feiyu.json` 配置文件，并按如下方式挂载启动:

```shell
docker run -d \
    -p 4399:3000 \
    -v $(pwd)/feiyu.json:/home/static/feiyu.json \
    idootop/feiyu:latest
```

## 本地开发

```bash
# 克隆本项目
git clone https://github.com/idootop/feiyu-player
cd feiyu-player/packages/feiyu

# 构建 feiyu 网页版
pnpm build:web

# 复制产物
cd ../feiyu-docker
rm -rf dist && cp -r ../feiyu/dist . 

# 构建镜像
docker build -t feiyu .
```