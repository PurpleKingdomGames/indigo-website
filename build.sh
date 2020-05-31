#!/bin/bash

set -e

cd website
yarn run build
cd ..

cp docs/CNAME website/build/indigo-site

rm -fr docs
mkdir docs
cp -R website/build/indigo-site/* docs/
