FROM python:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY Pipfile .
COPY scripts scripts
ARG build_env

FROM base AS development
COPY app app
CMD rm -rf .venv/* \
    && bash scripts/pipenv_install.sh \
    && pipenv run devserver