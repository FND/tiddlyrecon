// TiddlyWiki macro wrapper
//
// TODO:
// * include styles

config.macros.TiddlyRecon = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var host = params[0] || null;
		jQuery.TiddlyRecon(place, host);
	}
};

config.tasks.server = {
	text: "server",
	tooltip: "TiddlyWeb",
	content: "<<TiddlyRecon>>"
};
config.backstageTasks.push("server");
