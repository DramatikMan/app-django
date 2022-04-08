FROM node:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY src src
COPY babel.config.json \
    package.json \
    tsconfig.json \
    webpack.config.cjs \
    ./

FROM base AS development
COPY .eslintrc.json .
RUN npm install --package-lock=false
CMD rm -rf dist/* && sleep infinity

FROM base AS builder
COPY package-lock.json .
RUN npm install --production
RUN npx tsc
RUN npm run prod

FROM nginx:alpine AS production
COPY --from=builder /project/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
