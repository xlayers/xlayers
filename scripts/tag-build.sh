#!/usr/bin/env sh

## replease _BUILD_HASH_ with the current build number

b=`git rev-parse --abbrev-ref HEAD`
v=`git rev-parse --short HEAD`
vv="$b@$v"

find dist -type f -iname "main.*.js" -exec sed -i '' "s/_BUILD_HASH_/$vv/g" {} +