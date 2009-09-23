#!/usr/bin/env sh

# package application for end-users

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

bld/init.sh
zip -r TiddlyRecon.zip ./ -x "*.git*" -x "bld/*" # XXX: tarbomb
