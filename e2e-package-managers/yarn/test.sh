#!/usr/bin/env bash

set -e;

yarn install;
node ./test.mjs;
