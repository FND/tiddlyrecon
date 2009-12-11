#!/usr/bin/env sh

# generate a TiddlyWiki macro
#
# Usage:
#   $ ./twmacro.sh [min]
#
# TODO:
# * use string concatenation instead of multiple write operations

outfile="bld/TiddlyRecon.js"
minfile="bld/TiddlyRecon.min.js"

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

minify=$1

bld/init.sh

echo "//}}}" | \
	cat bld/resources/twmacro_template.js scripts/chrjs/main.js \
		scripts/main.js scripts/config.js scripts/twmacro.js - \
	> $outfile

styles=$(cat styles/main.css | sed -e "s/\s*\/\*.*\*\///g") # strip CSS comments (break TiddlyWiki formatter)
styles="/***
!StyleSheet
$styles
!/StyleSheet
***/"

echo "$styles" >> $outfile

echo "created $outfile"

if [ "$minify" = "min" ]; then
	# based on http://github.com/FND/misc/blob/master/jsmin.sh
	startpattern="\/\*"
	endpattern="\*\/"
	header=$(cat $outfile \
		| sed -e "/$endpattern/q" \
		| sed -n "/^$startpattern/,/$endpattern/ p")
	echo "$header
//{{{" > $minfile
	java -jar bld/yuicompressor-*.jar $outfile >> $minfile
	echo "
//}}}
$styles" >> $minfile
	echo "created $minfile"
fi
