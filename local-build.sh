#!/bin/bash

set -u

export SHORT_SHA=`git rev-parse --short HEAD`
export BRANCH=`git rev-parse --abbrev-ref HEAD`

echo ">> Building: ${BRANCH}#${SHORT_SHA}"

gcloud builds submit \
        --config cloudbuild.yaml \
        --substitutions SHORT_SHA=$SHORT_SHA \
        --machine-type=n1-highcpu-8 \
        . 