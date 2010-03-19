import os
import re


def _store_contents(sources):
	"""
	determines tiddler URIs from source files' paths
	"""
	store_contents = {}
	pattern = re.compile(r"^src/")
	for bag, uris in sources.items():
		prefix = "%s/" % "/".join(["src", "tiddlers", bag])
		store_contents[bag] = [pattern.sub(prefix, uri) for uri in uris]
	return store_contents


instance_config = {
	"system_plugins": ["tiddlywebplugins.status", "tiddlywebplugins.console"]
}

sources = {
	"console": [
		"src/index.recipe"
	]
}

store_contents = _store_contents(sources)

store_structure = {
	"bags": {
		"console": {
			"desc": "TiddlyWeb explorer",
			"policy": {
				"write": ["R:ADMIN"],
				"create": ["R:ADMIN"],
				"delete": ["R:ADMIN"],
				"manage": ["R:ADMIN"],
				"accept": ["R:ADMIN"],
				"owner": "administrator"
			}
		}
	}
}
