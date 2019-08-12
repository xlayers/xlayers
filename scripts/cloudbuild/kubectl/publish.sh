#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

gcloud builds submit --config cloudbuild.yaml .
