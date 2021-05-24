FROM python:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY Pipfile scripts ./
ARG build_env
RUN ./pipenv_install.sh

FROM base AS development
COPY . .
CMD pipenv run devserver

FROM base AS production
COPY music_app music_app
CMD ./deploy.sh