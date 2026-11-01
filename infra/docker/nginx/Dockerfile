FROM nginx:1.18-alpine
LABEL maintainer="ucan-lab <yes@u-can.pro>"
SHELL ["/bin/ash", "-oeux", "pipefail", "-c"]

ENV TZ=UTC

# nginx config file
COPY ./infra/docker/nginx/*.conf /etc/nginx/conf.d/

WORKDIR /work
