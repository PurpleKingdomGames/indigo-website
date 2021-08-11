#!/bin/bash

set -e

cd website
yarn run build
cd ..

rm -fr docs
mkdir docs
cp -R website/build/indigo-site/* docs/
