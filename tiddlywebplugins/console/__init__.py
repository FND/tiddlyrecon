__version__ = "0.1.0"

APP_BAG = "console"


def init(config):
	from tiddlywebplugins.utils import map_to_tiddler

	if config.get("selector"): # system plugin
		config["selector"].add("/console/", GET=get_root) # XXX: trailing slash required for relative paths!? -- TODO: use HTML BASE tag
		map_to_tiddler(config["selector"],
			"/console/{path}/{tiddler_name:segment}",
			bag=APP_BAG)


def get_root(environ, start_response): # XXX: "root" inappropriate!?
	from tiddlyweb.web.handler.tiddler import get as get_tiddler

	environ["wsgiorg.routing_args"][1]["bag_name"] = APP_BAG
	environ["wsgiorg.routing_args"][1]["tiddler_name"] = "index.html"
	return get_tiddler(environ, start_response)
