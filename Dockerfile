# Source Docker Image
FROM node:12.16.2-alpine

ENV EXPOSE_PORT=80

# Output Port
EXPOSE ${EXPOSE_PORT}

# source folder
WORKDIR /usr/local/src

# 既存データ
COPY build/ecs/* .

# Entry Point
ENTRYPOINT ["node", "app"]
