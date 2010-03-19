AUTHOR = "FND"
AUTHOR_EMAIL = "FNDo@gmx.net"
NAME = "tiddlywebplugins.console"
DESCRIPTION = "TiddlyWeb explorer"
VERSION = "0.2.5" # N.B.: duplicate of tiddlywebplugins.console.__init__


import os

from setuptools import setup, find_packages


setup(
	namespace_packages = ["tiddlywebplugins"],
	name = NAME,
	version = VERSION,
	description = DESCRIPTION,
	long_description = open(os.path.join(os.path.dirname(__file__), "README")).read(),
	author = AUTHOR,
	url = "http://pypi.python.org/pypi/%s" % NAME,
	packages = find_packages(exclude="test"),
	author_email = AUTHOR_EMAIL,
	platforms = "Posix; MacOS X; Windows",
	install_requires = [
		"setuptools",
		"tiddlyweb",
		"tiddlywebplugins.instancer>=0.7.2",
		"tiddlywebplugins.twimport>=0.5",
		"tiddlywebplugins.status"
	],
	include_package_data = True,
	zip_safe = False
)
