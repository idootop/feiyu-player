FROM node:18.18.2-alpine as build

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@8.15.4

WORKDIR /app

COPY ./feiyu ./feiyu
COPY ./feiyu-desktop/src ./feiyu-desktop/src
COPY ./feiyu-desktop/package.json ./feiyu-desktop/package.json

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    cd feiyu && pnpm install && pnpm web && pnpm build

FROM lipanski/docker-static-website:latest

COPY --from=build /app/feiyu/dist .