#!/usr/bin/env sh

set -x

host="collab.tiddlywiki.org"
base_dir="/var/www/$host/htdocs"

if [ ! -d bld ]; then # XXX: unnecessary!?
	echo "ERROR: script must be executed from repository root"
	exit 1
fi

bld/package.sh && \
cd `dirname $0` && \
scp TiddlyRecon.zip $host:~/tmp/ && \
ssh $host "sudo rm -rf $base_dir/TiddlyRecon ~/tmp/TiddlyRecon; " \
	"cd ~/tmp && unzip -d TiddlyRecon TiddlyRecon.zip && " \
	"sudo mv TiddlyRecon $base_dir/ && " \
	"echo 'tiddlyweb.host = \"/wiki\";' > $base_dir/TiddlyRecon/scripts/config.js" && \
echo "deployed to http://$host/TiddlyRecon/"
