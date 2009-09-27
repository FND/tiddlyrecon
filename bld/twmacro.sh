#!/usr/bin/env sh

# generate a TiddlyWiki macro
#
# Usage:
#   $ ./twmacro.sh [min]

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

MINIFY=$1

OUTFILE="bld/TiddlyRecon.js"
MINFILE="bld/TiddlyRecon.min.js"

bld/init.sh
echo "//}}}" | \
	cat bld/resources/twmacro_template.js scripts/chrjs/main.js \
		scripts/main.js scripts/config.js scripts/twmacro.js - \
	> $OUTFILE

if [ "$MINIFY" = "min" ]; then
	# based on http://github.com/FND/misc/blob/master/jsmin.sh
	STARTPATTERN="\/\*"
	ENDPATTERN="\*\/"
	HEADER=`cat $OUTFILE \
		| sed -e "/$ENDPATTERN/q" \
		| sed -n "/^$STARTPATTERN/,/$ENDPATTERN/ p"`
	echo "$HEADER
//{{{" > $MINFILE
	java -jar bld/yuicompressor-*.jar $OUTFILE >> $MINFILE
	echo "
//}}}" >> $MINFILE
fi
