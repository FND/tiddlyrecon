instance_config = {
	"system_plugins": ["tiddlywebplugins.console"],
}

store_contents = {
	"console": [
		"file:src/index.recipe"
	]
}

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
