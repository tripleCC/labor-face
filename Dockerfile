FROM node:alpine

WORKDIR /app

LABEL maintainer="Zhuohui <shupian@2dfire.com>"

ARG TZ='Asia/Shanghai'

ENV TZ $TZ

ADD ./ /app

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk upgrade --update \
  && apk add --no-cache git python sqlite make build-base autoconf automake tzdata \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && yarn install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
