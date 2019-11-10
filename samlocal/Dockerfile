FROM python:alpine

WORKDIR /app

RUN apk update && \
  apk upgrade && \
  apk add bash && \
  apk add --no-cache --virtual build-deps build-base gcc && \
  pip install aws-sam-cli && \
  apk del build-deps

EXPOSE 3000

# RUN mkdir build

# ADD ./build ./build

ENTRYPOINT [ "/app/entrypoint.sh" ]
