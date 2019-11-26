#!/bin/bash

# Setup variables
PACKAGES=(react react-dom next next-cookies)
TESTBED=testbed2

# Ensure we're in the right path.
cd "$( dirname "${BASH_SOURCE[0]}" )"
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