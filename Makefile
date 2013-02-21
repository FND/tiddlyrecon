.PHONY: clean jslib remotes dist release pypi

clean:
	find . -name "*.pyc" | xargs rm || true
	rm -r dist || true
	rm -r build || true
	rm -r *.egg-info || true
	rm -r src/tiddlers || true
	rm -r tiddlywebplugins/console/resources || true

jslib:
	curl -o "src/scripts/jquery.min.js.js" \
	    	"http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"
	curl -o "src/scripts/jquery-json.min.js.js" \
	        "https://jquery-json.googlecode.com/files/jquery.json-2.4.min.js"
	curl -o "src/scripts/chrjs.js.js" \
	        "https://raw.github.com/tiddlyweb/chrjs/v0.2.1/main.js"
	curl -o "src/scripts/util.js.js" \
	        "https://raw.github.com/FND/jquery/master/util.js"

remotes: jslib
	twibuilder tiddlywebplugins.console

dist: clean remotes
	python setup.py sdist

release: dist pypi

pypi:
	python setup.py sdist upload
