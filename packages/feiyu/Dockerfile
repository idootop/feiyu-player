FROM node:18.18.2-alpine as build

WORKDIR /app

COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# todo 拿到用户设置的配置参数
RUN \[ -f ".feiyu.ts" \] && cp -f ".feiyu.ts" "src/data/default.ts" || : ; yarn run build

FROM lipanski/docker-static-website:latest

COPY --from=build /app/dist .

CMD ["/busybox", "httpd", "-f", "-v", "-p", "80", "-c", "httpd.conf"]
