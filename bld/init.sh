#!/usr/bin/env sh

# pull in external dependencies
#
# Usage:
#   $ bld/init.sh [update]

if [ ! -d bld ]; then
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

action=$1

if [ "$action" != "update" ]; then
	git submodule update --init
fi

# jQuery core
version="1.3.2"
curl -o "scripts/jquery.min.js" \
	"http://ajax.googleapis.com/ajax/libs/jquery/$version/jquery.min.js"

# jQuery UI components
version="1.7.2"
modules="core resizable draggable dialog"
for module in $modules; do
	curl -o "scripts/jquery-ui.$module.min.js" \
		"http://jquery-ui.googlecode.com/svn/tags/$version/ui/minified/ui.$module.min.js"
done

# jQuery JSON
version="2.2"
curl -o "scripts/jquery-json.min.js" \
	"http://jquery-json.googlecode.com/files/jquery.json-$version.min.js"
