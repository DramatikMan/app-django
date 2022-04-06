FROM python:3.10-slim AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /project
ENV PYTHONPATH "${PYTHONPATH}:/project"
COPY pyproject.toml poetry.lock* ./
COPY scripts scripts
COPY app app
ARG build_env
RUN scripts/poetry_install.sh

FROM base AS development
CMD sleep infinity

FROM base AS production
RUN rm -r scripts
CMD poetry exec server