FROM python:slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY Pipfile scripts ./
ARG build_env
RUN ./pipenv_install.sh

FROM base AS development
COPY . .
CMD ./django_setup.sh