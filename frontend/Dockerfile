FROM node:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY src src
COPY .eslintrc.json \
    babel.config.json \
    package*.json \
    tsconfig.json \
    webpack.config.cjs \
    ./
RUN npm install --no-package-lock

FROM base AS development
CMD rm -rf dist/* && sleep infinity

FROM base AS builder
RUN npx tsc
RUN npm run prod

FROM nginx:alpine AS production
COPY --from=builder /project/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
