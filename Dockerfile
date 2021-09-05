FROM python:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
ENV PYTHONPATH "${PYTHONPATH}:/project"
COPY Pipfile .
COPY scripts scripts
COPY app app

FROM base AS development
CMD rm -rf .venv/* \
    && bash scripts/pipenv_install.sh \
    && pipenv run devserver