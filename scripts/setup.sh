#!/bin/bash

# Ensure we're in the right path.
cd "$( dirname "${BASH_SOURCE[0]}" )"
source ./conf.sh
cd ..
DIR="$(pwd)"

# Run bootstrap
yarn bootstrap

for i in "${PACKAGES[@]}"
do
    cd $DIR
    cd packages/$TESTBED/node_modules/$i
    yarn unlink
    yarn link
    cd $DIR
    cd packages/react-dashboard/
    rm -rf node_modules/$i
    yarn link $i
done