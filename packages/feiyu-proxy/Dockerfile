FROM node:20.14.0-alpine as base

WORKDIR /app

FROM base as runtime
COPY . .
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@9.1.1
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --production

FROM runtime as dist
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install && pnpm build

FROM base as release

COPY server.js .
COPY package.json .
COPY --from=dist /app/api ./api
COPY --from=runtime /app/node_modules ./node_modules

CMD npm run server
