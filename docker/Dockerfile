# Source Docker Image
FROM localstack/localstack

# Output Port
EXPOSE 4566

# 既存データ
COPY localstack/data /usr/local/data

# DynamoDBのみ有効
ENV SERVICES=dynamodb \
  DEFAULT_REGION=ap-northeast-1 \
  DATA_DIR=/usr/local/data

# Entry Point
ENTRYPOINT ["docker-entrypoint.sh"]
