#!/bin/bash

set -u

SHORT_SHA=${SHORT_SHA-default}
BRANCH_NAME=${BRANCH_NAME-default}

if [[ -z "$SHORT_SHA" ]]; then
    b=`git rev-parse --abbrev-ref HEAD`
    v=`git rev-parse --short HEAD`
    version="$b+sha.$v"
else
    echo "Cloud Build environment detected"
    version="${BRANCH_NAME}+sha.${SHORT_SHA} (preview)"
fi

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/*/main.*.js

status=$?
if [ $status -eq 0 ];then
   echo "Deploy was stamped: $version"
else
   echo "Could not stamp this eploy!"
fi