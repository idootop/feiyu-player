rm -rf dist \
    && pnpm build:web

cd ../feiyu-docker \
    && rm -rf dist \
    && cp -r ../feiyu/dist .
    
docker build \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    -t idootop/feiyu:2.2.0 \
    -t idootop/feiyu:latest . --push 