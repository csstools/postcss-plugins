#!/usr/bin/env bash

set -e

if [ -n "$(git status --porcelain)" ]; then
	git status;

	echo "\n!!! Repo is not clean, check changes before continuing. !!!";
else
	echo "Repo is clean";
fi
