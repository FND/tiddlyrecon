#!/usr/bin/env sh

# generate a TiddlyWiki macro
#
# TODO:
# * minify code (optional)

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

bld/init.sh
echo "//}}}" | \
	cat bld/resources/twmacro_template.js scripts/chrjs/main.js \
		scripts/main.js scripts/twmacro.js - \
	> TiddlyRecon.js
