#!/usr/bin/env sh

set -e

if [ ! -f "src/README" ]; then
	git submodule init
fi
git submodule update

cd src
make purge lib
