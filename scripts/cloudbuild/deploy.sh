#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo ">> deploying gcr.io/cross-xlayers/xlayers:$SHORT_SHA"
perl -pe "s/SHORT_SHA/$SHORT_SHA/g" xlayers.template.yaml | kubectl apply -f -
