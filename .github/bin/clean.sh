#!/usr/bin/env bash

set -e

find . -type d -name 'dist' | xargs rm -r

git clean -dfx --exclude \
	.idea \
	.vscode \
	.DS_Store \
