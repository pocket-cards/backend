# Source Docker Image
FROM node:12.16.2-alpine

ENV PORT=80

# Output Port
EXPOSE ${PORT}

WORKDIR /usr/local/src

# 既存データ
COPY build/ecs/* .

# Entry Point
ENTRYPOINT ["node", "app"]
