#!/usr/bin/env sh

set -e

if [ ! -d src ]; then
	git submodule init
fi
git submodule update

cd src
make purge lib
