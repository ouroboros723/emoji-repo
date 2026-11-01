ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-trixie-slim AS node

FROM php:8.5-fpm
LABEL maintainer="ucan-lab <yes@u-can.pro>"
SHELL ["/bin/bash", "-oeux", "pipefail", "-c"]

# フロントエンドのビルドに使う pnpm のバージョン（package.json の packageManager と揃える）
ARG PNPM_VERSION=12.16.1

# timezone environment
ARG TZ=Asia/Tokyo
ENV TZ=${TZ} \
  # locale
  LANG=ja_JP.UTF-8 \
  LANGUAGE=ja_JP:ja \
  LC_ALL=ja_JP.UTF-8 \
  # composer environment
  COMPOSER_ALLOW_SUPERUSER=1 \
  COMPOSER_HOME=/composer \
  # pnpm environment（staging で一般ユーザーとして実行しても同じストアを使うよう環境変数で指定）
  pnpm_config_store_dir=/pnpm/store

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# node / npm
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/npm

RUN apt-get update && \
  apt-get -y install git libicu-dev libzip-dev libgmp-dev unzip locales && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  locale-gen en_US.UTF-8 && \
  locale-gen ja_JP.UTF-8 && \
  localedef -f UTF-8 -i en_US en_US.UTF-8 && \
  localedef -f UTF-8 -i ja_JP ja_JP && \
  mkdir /var/run/php-fpm && \
  docker-php-ext-install intl pdo_mysql zip bcmath gmp && \
  composer config -g process-timeout 3600 && \
  composer config -g repos.packagist composer https://packagist.org && \
  ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
  ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx && \
  npm install -g "pnpm@${PNPM_VERSION}" && \
  npm cache clean --force && \
  mkdir -p /pnpm/store && \
  chmod 1777 /pnpm/store

COPY ./infra/docker/php/php-fpm.d/zzz-www.conf /usr/local/etc/php-fpm.d/zzz-www.conf
COPY ./infra/docker/php/php.ini /usr/local/etc/php/php.ini
RUN sed -i "s|^date.timezone = .*|date.timezone = ${TZ}|" /usr/local/etc/php/php.ini

WORKDIR /work
