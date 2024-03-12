FROM node:18.18.2-alpine as build

ENV NODE_ENV production

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@8.15.4

WORKDIR /app

COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm run build

FROM lipanski/docker-static-website:latest

COPY --from=build /app/dist .