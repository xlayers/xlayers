#!/usr/bin/env sh

## replease _BUILD_HASH_ with the current build number

b=`git rev-parse --abbrev-ref HEAD`
v=`git rev-parse --short HEAD`
version="$b@$v"

perl -i -pe "s/_BUILD_HASH_/$version/g" dist/*/main.*.js > /dev/null

status=$?
if [ $status -eq 0 ];then
   echo "Build was tagged: $version"
else
   echo "Could not tag a build!"
fi