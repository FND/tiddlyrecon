.PHONY: clean jslib remotes dist release pypi

clean:
	find . -name "*.pyc" | xargs rm || true
	rm -r dist || true
	rm -r build || true
	rm -r *.egg-info || true
	rm -r src/tiddlers || true
	rm -r tiddlywebplugins/console/resources || true

jslib:
	curl -o "src/scripts/jquery.min.js" \
		"http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"
	curl -o "src/scripts/jquery-json.min.js" \
		"http://jquery-json.googlecode.com/files/jquery.json-2.2.min.js"
	curl -o "src/scripts/chrjs.js" \
		"http://github.com/tiddlyweb/chrjs/raw/v0.2.1/main.js"
	curl -o "src/scripts/util.js" \
		"http://github.com/FND/jquery/raw/master/util.js"

remotes: jslib
	./cacher

dist: clean remotes
	python setup.py sdist

release: dist pypi

pypi:
	python setup.py sdist upload
