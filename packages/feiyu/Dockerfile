FROM node:18.18.2-alpine as build

WORKDIR /app

COPY . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

RUN yarn run build

FROM lipanski/docker-static-website:latest

COPY --from=build /app/dist .