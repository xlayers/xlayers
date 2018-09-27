#!/bin/bash

if [[ -n "$BUILD_ID" ]]; then
    echo "Cloud Build environment detected!"
    version="${BUILD_ID}"
else
    b=`git rev-parse --abbrev-ref HEAD || echo "n-a"`
    v=`git rev-parse --short HEAD || echo "0000000"`
    version="$b#$v (`date`)"
fi

## replease _BUILD_HASH_ with the current build number
perl -i -pe "s/_BUILD_HASH_/$version/g" dist/html/main.*.js


status=$?
if [ $status -eq 0 ];then
    echo "$version" > dist/html/version.txt
    echo "Build was stamped: `cat dist/html/version.txt`"
else
   echo "Could not stamp this build!"
fi