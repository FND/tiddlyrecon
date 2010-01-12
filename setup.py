AUTHOR = "FND"
AUTHOR_EMAIL = "FNDo@gmx.net"
NAME = "tiddlywebplugins.console"
DESCRIPTION = "TiddlyWeb explorer"


import os

from setuptools import setup, find_packages

from tiddlywebplugins.console import __version__ as VERSION


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
		"tiddlywebplugins.instancer",
		"tiddlywebplugins.status"
	],
	include_package_data = True,
	zip_safe = False
)
