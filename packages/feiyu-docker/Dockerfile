FROM node:20.14.0-alpine as build

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@8.15.4

WORKDIR /app

COPY ./feiyu ./feiyu
COPY ./feiyu-desktop/src ./feiyu-desktop/src
COPY ./feiyu-desktop/package.json ./feiyu-desktop/package.json

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    cd feiyu && pnpm install && pnpm web && pnpm build

FROM httpd:alpine3.20
COPY --from=build /app/feiyu/dist /usr/local/apache2/htdocs/