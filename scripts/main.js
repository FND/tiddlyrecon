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
	data = data.sort(function(a, b) {
		var x = a.toLowerCase();
		var y = b.toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	data.splice(0, 0, "(none)");
	listCollection("Recipes", data, function(el, item, i) {
		return el.addClass(i == 0 ? "virtual" : null).
			find("a").text(item).click(loadRecipe).end();
	}).appendTo(container);
};

// display recipe
var loadRecipe = function(ev) {
	var recipe_node = $(this);
	setActive(recipe_node);
	var recipe_name = recipe_node.text(); // TODO: special handling for "(none)";
	notify("loading recipe", recipe_name);

	var recipe_container = recipe_node.closest("div").
		find("#recipe").remove().end(). // clear existing selection -- TODO: allow for multiple recipes?
		attach('<div id="recipe" class="entity" />').
			attach("<h3 />").text(recipe_name).end();

	var callback = function(data, status, error) {
		populateBags(recipe_container, data, status, error);
	};
	tw.loadRecipe(recipe_name, callback);
	return false;
};

// list bags in recipe
var populateBags = function(container, data, status, error) {
	notify("populating bags");
	var recipe = data.recipe.sort(function(a, b) {
		var x = a[0].toLowerCase();
		var y = b[0].toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	recipe.splice(0, 0, ["(all)", ""]);
	listCollection("Bags", recipe, function(el, item, i) {
		var bag = item[0];
		var filter = item[1] || "";
		return el.addClass(i == 0 ? "virtual" : null).
			find("a").text(bag).data("filter", filter).click(loadBag).end();
	}).appendTo(container);
};

// display bag
var loadBag = function(ev) {
	var bag_node = $(this);
	setActive(bag_node);
	var bag_name = bag_node.text(); // TODO: special handling for "(all)";
	notify("loading bag", bag_name);

	var bag_container = bag_node.closest("div").
		find("#bag").remove().end(). // clear existing selection -- TODO: allow for multiple bags?
		attach('<div id="bag" class="entity" />').
			attach("<h3 />").text(bag_name).end();

	var callback = function(data, status, error) {
		populateTiddlers(bag_container, data, status, error);
	};
	var container = {
		type: "bag",
		name: bag_name
	};
	tw.loadTiddlers(container, callback);
	return false;
};

var populateTiddlers = function(container, data, status, error) {
	notify("populating tiddlers");
	data = data.sort(function(a, b) {
		var x = a.title.toLowerCase();
		var y = b.title.toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
	listCollection("Tiddlers", data, function(el, item, i) {
		return el.find("a").text(item.title).data("bag", item.bag).click(loadTiddler).end();
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

// create a list of collection items
// title is used as heading and also as element ID (lowercased)
// items is the collection's data array
// callback is a function to customize each item's DOM element
var listCollection = function(title, items, callback) {
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
		addClass("active");
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
