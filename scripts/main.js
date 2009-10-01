(function() {

var $ = jQuery;
var tw = tiddlyweb; // TODO: chrjs should provide an instance

$.TiddlyRecon = function(root, host) {
	tw.host = host;
	$.TiddlyRecon.root = $(root).empty(); // XXX: singleton, bad
	notify("loading status");
	loadStatus();
	notify("loading recipes");
	tw.loadRecipes(populateRecipes);
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
var populateRecipes = function(data, status, error) {
	notify("populating recipes");

	data.splice(0, 0, "(none)");

	$('<div id="recipes" class="collection container" />').
		append("<h2>Recipes</h2>").
		attach('<ul class="listing" />').
			append($.map(data, function(item, i) {
				return $("<li />").text(item).click(loadRecipe)[0];
			})).
			eq(0).addClass("virtual").end().
			end().
		appendTo($.TiddlyRecon.root);
};

// display recipe
var loadRecipe = function(ev) {
	var recipe_node = $(this);
	setActive(recipe_node);
	var recipe_name = recipe_node.text(); // TODO: special handling for "(none)";
	notify("loading recipe", recipe_name);

	var recipe_container = recipe_node.parent().parent(). // XXX: simpler way to do this?
		find("#recipe").remove().end(). // clear existing selection -- TODO: allow for multiple recipes?
		attach('<div id="recipe" class="entity" />').
			attach("<h3 />").text(recipe_name).end();

	var callback = function(data, status, error) {
		populateBags(recipe_container, data, status, error);
	};
	tw.loadRecipe(recipe_name, callback);
};

// list bags
var populateBags = function(container, data, status, error) {
	notify("populating bags");

	data.recipe.splice(0, 0, ["(all)", ""]);

	$('<div id="bags" class="collection container" />').
		append("<h2>Bags</h2>").
		attach('<ul class="listing" />').
			append($.map(data.recipe, function(item, i) {
				var bag_name = item[0];
				var filter = item[1] || "(none)"; // XXX: bad default
				return $("<li />").text(bag_name).data("filter", filter).click(loadBag)[0];
			})).
			eq(0).addClass("virtual").end().
			end().
		appendTo(container);
};

// display bag
var loadBag = function(ev) {
	var bag_node = $(this);
	setActive(bag_node);
	var bag_name = bag_node.text(); // TODO: special handling for "(all)";
	notify("loading bag", bag_name);

	var bag_container = bag_node.parent().parent(). // XXX: simpler way to do this?
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
};

var populateTiddlers = function(container, data, status, error) {
	notify("populating tiddlers");

	$('<div id="tiddlers" class="collection" />').
		append("<h2>Tiddlers</h2>").
		attach('<ul class="listing" />').
			append($.map(data, function(item, i) {
				return $("<li />").text(item.title).data("bag", item.bag).click(loadTiddler)[0];
			})).
			end().
		appendTo(container);
};

var loadTiddler = function(ev) {
	var tiddler_node = $(this);
	setActive(tiddler_node);
	var title = tiddler_node.text();
	var bag = tiddler_node.data("bag");
	notify("loading tiddler", title, bag);

	var tiddler_container = tiddler_node.parent().parent(). // XXX: simpler way to do this?
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
};

var populateTiddler = function(container, data, status, error) {
	notify("populating tiddler");

	$('<div class="content" />').text(data.text).appendTo(container); // XXX: request wikified text!?
};

var setActive = function(node) {
	node.siblings().removeClass("active");
	node.addClass("active");
};

// utility functions -- TODO: move into separate module

var notify = function(msg) { // TODO: use jQuery.notify
	// XXX: DEBUG
	if(window.console && console.log) {
		console.log("notify:", msg);
	}
};

// utility method to create and then select elements
// in combination with jQuery's end method, this is generally useful for
// dynamically generating nested elements within a chain of operations
$.fn.attach = function(html) {
	return this.append(html).children(":last");
};

})();
