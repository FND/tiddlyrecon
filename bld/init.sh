#!/usr/bin/env sh

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

git submodule update --init
curl -o "scripts/jquery.min.js" \
	"http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js"
