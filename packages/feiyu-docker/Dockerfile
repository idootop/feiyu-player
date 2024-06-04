# 来源：https://github.com/lipanski/docker-static-website
FROM alpine:3.20.0 AS builder

# 下载 busybox 源码
ARG BUSYBOX_VERSION=1.36.1
RUN wget https://busybox.net/downloads/busybox-${BUSYBOX_VERSION}.tar.bz2 \
  && tar xf busybox-${BUSYBOX_VERSION}.tar.bz2 \
  && mv /busybox-${BUSYBOX_VERSION} /busybox

# 构建 busybox_HTTPD
WORKDIR /busybox
COPY busybox.conf .config
RUN apk add gcc musl-dev make perl
RUN make && ./make_single_applets.sh

FROM scratch AS release

EXPOSE 3000
WORKDIR /var/www

# 拷贝飞鱼构建产物
COPY dist .

# 启动 busybox_HTTPD 服务
COPY --from=builder /busybox/busybox_HTTPD httpd
CMD ["./httpd", "-f", "-v", "-p", "3000"]