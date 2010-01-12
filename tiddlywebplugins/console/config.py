from tiddlywebplugins.instancer.util import get_tiddler_locations

from tiddlywebplugins.console.instance import store_contents


PACKAGE_NAME = "tiddlywebplugins.console"


config = {
	"instance_tiddlers": get_tiddler_locations(store_contents, PACKAGE_NAME),
}
