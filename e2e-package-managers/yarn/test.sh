#!/usr/bin/env bash

set -e;

touch yarn.lock;
yarn install;
node ./test.mjs;
