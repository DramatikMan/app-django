FROM node:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY package.json scripts ./
ARG build_env
RUN ./npm_install.sh

FROM base AS development
COPY . .
CMD npm run dev