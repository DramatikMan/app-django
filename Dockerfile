FROM python:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY Pipfile .
COPY scripts scripts
ARG build_env
RUN scripts/pipenv_install.sh

FROM base AS development
CMD pipenv run devserver

FROM node:slim AS builder
WORKDIR /project
COPY music_app/frontend .
RUN npm install --no-package-lock
RUN npm run prod

FROM base AS production
COPY music_app music_app
COPY --from=builder /project/static/frontend music_app/frontend/static/frontend
CMD scripts/deploy.sh