# Simple Makefile for some common tasks. This will get 
# fleshed out with time to make things easier on developer
# and tester types.
.PHONY: dist release

clean:
	find . -name "*.pyc" | xargs rm || true
	rm -r dist || true
	rm -r build || true
	rm -r *.egg-info || true
	rm -r src/tiddlers || true
	rm -r tiddlywebplugins/console/resources || true

jslib:
	curl -o "src/scripts/jquery.min.js" \
		"http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js"
	curl -o "src/scripts/jquery-json.min.js" \
		"http://jquery-json.googlecode.com/files/jquery.json-2.2.min.js"
	curl -o "src/scripts/chrjs.js" \
		"http://github.com/tiddlyweb/chrjs/raw/master/main.js"
	curl -o "src/scripts/util.js" \
		"http://github.com/FND/jquery/raw/master/util.js"

remotes: jslib
	./cacher

dist: remotes
	python setup.py sdist

release: clean pypi

pypi:
	python setup.py sdist upload
