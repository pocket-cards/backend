#!/bin/bash
wsl() { echo "$(echo "$1" | sed -e 's/\\/\//g' | sed -e 's/://g' | sed -e '/^\//!s/^/\//g')"; }

set -o errexit
BASEDIR=$(wsl "$1")

sam local start-api \
  --host 0.0.0.0 \
  --docker-volume-basedir "${BASEDIR}" \
  --debug
