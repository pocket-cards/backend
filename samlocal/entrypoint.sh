#!/bin/bash

set -o errexit
BASEDIR="$1"
# cp ./sam/template.yml .
ls
sam local start-api \
  -t template.yml \
  --host 0.0.0.0 \
  --docker-volume-basedir "${BASEDIR}"
