FROM node:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY package.json .
ARG build_env
RUN npm install --no-package-lock

FROM base AS development
COPY . .
CMD npm run dev