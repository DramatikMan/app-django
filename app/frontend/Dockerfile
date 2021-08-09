FROM node:slim
SHELL ["/bin/bash", "-c"]
WORKDIR /project
COPY . .
CMD rm -rf node_modules/* \
    && npm install --no-package-lock \
    && npx tsc \
    && npm run dev