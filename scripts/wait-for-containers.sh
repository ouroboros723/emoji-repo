#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
services=$(docker compose config --services | LC_ALL=C sort)
if [[ -z "$services" ]]; then
    echo 'No Compose services found.' >&2
    exit 1
fi

while (( SECONDS < 600 )); do
    ready=$(docker compose ps --orphans=false --status running \
        --format '{{if or (eq .Health "") (eq .Health "healthy")}}{{.Service}}{{end}}' \
        | sed '/^$/d' | LC_ALL=C sort -u)
    if [[ "$ready" == "$services" ]]; then
        echo 'All Compose services are ready.'
        exit 0
    fi
    sleep 2
done

echo 'Timed out waiting for Compose services.' >&2
docker compose ps -a >&2
exit 1
