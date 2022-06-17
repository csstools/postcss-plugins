#!/usr/bin/env bash
set -e

if [ "$(uname)" == "Darwin" ]; then
  # Darwin cmd
  find . -type f -perm +0111 | node .github/bin/detect-executable-files/to-github-annotations.mjs
else
  # Linux cmd
  find . -type f -perm /u=x,g=x,o=x | node .github/bin/detect-executable-files/to-github-annotations.mjs
fi
