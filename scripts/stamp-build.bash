#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

if [[ -n "$BUILD_ID" ]]; then
    echo "Cloud Build environment detected!"
    version="${BUILD_ID}"
else
    b=`git rev-parse --abbrev-ref HEAD`
    v=`git rev-parse --short HEAD`
    version="$b+sha.$v"
fi

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/html/*.js

status=$?
if [ $status -eq 0 ];then
   echo "Build was stamped: $version"
else
   echo "Could not stamp this build!"
fi
