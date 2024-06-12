FROM node:20.14.0-alpine as env-amd64
FROM node:20.14.0-alpine as env-arm64
FROM arm32v7/node:18.20.3-alpine as env-arm

FROM env-$TARGETARCH as base
WORKDIR /app

FROM base as runtime
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    npm install --production

FROM runtime as dist
RUN --mount=type=cache,target=/root/.npm \
    npm install && npm run build

FROM base as release

COPY server.js .
COPY package.json .
COPY --from=dist /app/api ./api
COPY --from=runtime /app/node_modules ./node_modules

CMD npm run server
