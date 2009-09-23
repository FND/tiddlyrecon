// TiddlyWiki macro wrapper
//
// TODO:
// * include styles

config.macros.TiddlyRecon = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var host = params[0]; // TODO: use config.options value as fallback?
		jQuery.TiddlyRecon(place, host);
	}
};
