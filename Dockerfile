# Source Docker Image
FROM node:12.16.2-alpine

# Output Port
EXPOSE 8080

WORKDIR /usr/local/src

# 既存データ
COPY build/* .

# Entry Point
ENTRYPOINT ["node", "app"]
