(function() {

var $ = jQuery;
var tw = tiddlyweb; // TODO: chrjs should provide an instance

$.TiddlyRecon = function(root, host) {
	tw.host = host;
	$.TiddlyRecon.root = $(root).empty(); // XXX: singleton, bad
	notify("loading status");
	loadStatus();
	notify("loading recipes");
	tw.loadRecipes(function(data, status, error) {
		populateRecipes($.TiddlyRecon.root, data, status, error);
	});
};

// display status
var loadStatus = function() {
	var container = $('<dl id="status" />').hide().appendTo($.TiddlyRecon.root);
	var populateStatus = function(data, status, error) {
		container.
			append("<dt>user</dt>\n").
			attach("<dd />\n").text(data.username).end().
			append("<dt>server</dt>\n").
			attach("<dd />\n").
				attach("<a />").attr("href", tw.host).text(tw.host).end().
				end().
			show();
	};
	tw.loadData("/status", populateStatus);
};

// list recipes
var populateRecipes = function(container, data, status, error) {
	notify("populating recipes");
	data.splice(0, 0, "(none)");
	listCollection("Recipes", data, null, function(el, item, i) {
		return el.addClass(i == 0 ? "virtual" : null).
			find("a").text(item).click(loadRecipe).end();
	}).appendTo(container);
};

// display recipe
var loadRecipe = function(ev) {
	var recipe_node = $(this);
	setActive(recipe_node);
	var recipe_name = recipe_node.text();
	recipe_name = recipe_name == "(none)" ? null : recipe_name; // XXX: hacky?
	notify("loading recipe", recipe_name);

	var recipe_container = recipe_node.closest("div").
		find("#recipe").remove().end(). // clear existing selection -- TODO: allow for multiple recipes?
		attach('<div id="recipe" class="entity" />').
			attach("<h3 />").text(recipe_name || "").end();

	var callback = function(data, status, error) {
		populateBags(recipe_container, data, status, error);
	};
	if(recipe_name) {
		tw.loadRecipe(recipe_name, callback);
	} else {
		var _callback = function(data, status, error) {
			var recipe = $.map(data, function(item, i) {
				return [[item, ""]]; // nested array to prevent flattening
			});
			data = { recipe: recipe };
			callback.apply(this, arguments);
		};
		tw.loadBags(_callback);
	}
	return false;
};

// list bags in recipe
var populateBags = function(container, data, status, error) {
	notify("populating bags");
	data.recipe.splice(0, 0, ["(all)", ""]);
	var sortAttr = 0;
	listCollection("Bags", data.recipe, sortAttr, function(el, item, i) {
		var bag = item[0];
		var filter = item[1] || "";
		return el.addClass(i == 0 ? "virtual" : null).
			find("a").text(bag).data("filter", filter).click(loadBag).end();
	}).data("recipe", data.recipe).appendTo(container);
};

// display bag
var loadBag = function(ev) {
	var bag_node = $(this);
	setActive(bag_node);
	var bag_name = bag_node.text(); // TODO: special handling for "(all)";
	bag_name = bag_name == "(all)" ? null : bag_name; // XXX: hacky?
	notify("loading bag", bag_name);

	var bag_container = bag_node.closest("div").
		find("#bag").remove().end(). // clear existing selection -- TODO: allow for multiple bags?
		attach('<div id="bag" class="entity" />').
			attach("<h3 />").text(bag_name || "").end();

	var callback = function(data, status, error) {
		populateTiddlers(bag_container, data, status, error);
	};
	if(bag_name) {
		var container = {
			type: "bag",
			name: bag_name
		};
		tw.loadTiddlers(container, null, callback);
	} else {
		var recipe = bag_node.closest(".collection").data("recipe");
		recipe = $.map(recipe, function(item, i) { // clone array to prevent data corruption
			// ignore dummy item -- XXX: hacky?
			return item[0] == "(all)" ? null : [item]; // nested array to prevent flattening
		});
		var counter = recipe.length;
		var index = {};
		var aggregate = function(data, status, error) {
			for(var i = 0; i < data.length; i++) {
				var tiddler = data[i];
				if(!index[tiddler.title]) {
					index[tiddler.title] = [];
				}
				index[tiddler.title].push(tiddler);
			}
			if(--counter == 0) {
				var tiddlers = resolveCascade(index);
				callback(tiddlers, status, error);
			}
		};
		$.each(recipe, function(i, item) {
			var bag_name = item[0];
			var filter = item[1];
			var container = {
				type: "bag",
				name: bag_name
			};
			tw.loadTiddlers(container, filter, aggregate);
		});
	}
	return false;
};

var populateTiddlers = function(container, data, status, error) {
	notify("populating tiddlers");
	var sortAttr = "title";
	listCollection("Tiddlers", data, sortAttr, function(el, item, i) {
		return el.find("a").text(item.title).
			addClass(item.cascade).
			data("bag", item.bag).click(loadTiddler).end();
	}).appendTo(container);
};

var loadTiddler = function(ev) {
	var tiddler_node = $(this);
	setActive(tiddler_node);
	var title = tiddler_node.text();
	var bag = tiddler_node.data("bag");
	notify("loading tiddler", title, bag);

	var tiddler_container = tiddler_node.closest("div").
		find("#tiddler").remove().end(). // clear existing selection -- TODO: allow for multiple bags?
		attach('<div id="tiddler" class="entity" />').
			attach("<h3 />").text(title).end();

	var callback = function(data, status, error) {
		populateTiddler(tiddler_container, data, status, error);
	};
	var container = {
		type: "bag",
		name: bag
	};
	tw.loadTiddler(title, container, callback);
	return false;
};

var populateTiddler = function(container, data, status, error) {
	notify("populating tiddler");

	$('<div class="content" />').text(data.text).appendTo(container); // XXX: request wikified text!?
};

// utility functions

// creates a list of collection items
// title is used as heading and also as element ID (lowercased)
// items is the collection's data array
// sortAttr is an optional attribute by which items are to be sorted
// callback is a function to customize each item's DOM element
var listCollection = function(title, items, sortAttr, callback) {
	items = items.sort(function(a, b) {
		var x = sortAttr !== null ? a[sortAttr].toLowerCase() : a.toLowerCase();
		var y = sortAttr !== null ? b[sortAttr].toLowerCase() : b.toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	}); // XXX: does not take into account special items ("(none)", "(all)")
	return $('<div class="collection container" />').
		attr("id", title.toLowerCase()). // XXX: inappropriate?
		attach("<h2 />").text(title).end().
		attach('<ul class="listing" />').
			append($.map(items, function(item, i) {
				var el = $("<li />").append('<a href="#" />');
				return callback(el, item, i)[0];
			})).end();
};

var setActive = function(node) {
	node.parent().
		siblings().removeClass("active").end().
		parent().find(".indicator").remove().end().end().
		find("a").append('<span class="indicator">').end().
		addClass("active");
};

// translates a collection of tiddlers into an array, flagging duplicates
// index is an object listing tiddlers by title
// duplicate tiddlers are assigned a cascade property "primary" or "secondary",
// depending on their precendence in the cascade
var resolveCascade = function(index) {
	var tiddlers = [];
	for(var key in index) {
		var list = index[key];
		if(list.length == 1) {
			tiddlers.push(list[0]);
		} else {
			var tiddler = list.pop();
			tiddler.cascade = "primary";
			tiddlers.push(tiddler);
			for(var i = 0; i < list.length; i++) {
				tiddler = list[i];
				tiddler.cascade = "secondary";
				tiddlers.push(tiddler);
			}
		}
	}
	return tiddlers;
};

var notify = function(msg) { // TODO: use jQuery.notify
	// XXX: DEBUG
	if(window.console && console.log) {
		console.log("notify:", msg);
	}
};

// utility method to create and then select elements
// in combination with jQuery's end method, this is generally useful for
// dynamically generating nested elements within a chain of operations
$.fn.attach = function(html) { // TODO: move into separate module
	return this.append(html).children(":last");
};

})();
