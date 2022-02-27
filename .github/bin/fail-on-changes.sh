#!/usr/bin/env bash

set -e

# This has exit code 1 if there are changes in the working tree
# And exit code 0 if there are no changes
exit $( git status --porcelain | head -1 | wc -l )
