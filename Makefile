.PHONY: clean remotes dist release pypi

clean:
	find . -name "*.pyc" | xargs rm || true
	rm -r dist || true
	rm -r build || true
	rm -r *.egg-info || true
	rm -r src/tiddlers || true
	rm -r tiddlywebplugins/console/resources || true

remotes:
	./init.sh
	./cacher

dist: clean remotes
	python setup.py sdist

release: dist pypi

pypi:
	python setup.py sdist upload
