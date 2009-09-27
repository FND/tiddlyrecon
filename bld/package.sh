#!/usr/bin/env sh

# package application for end-users

OUTFILE="bld/TiddlyRecon.zip"

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

bld/init.sh
zip -r $OUTFILE ./ -x "*.git*" -x "bld/*" # XXX: tarbomb
echo "created $OUTFILE"
