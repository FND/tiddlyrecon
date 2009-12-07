(function() {

var $ = jQuery;
var tw = tiddlyweb;

$.TiddlyRecon.widgets = {
	newBag: function() {
		$('<form action="#" />').
			attach("<fieldset />").
				append("<legend>Create Bag</legend>").
				append('<input type="text" />').
				append('<input type="submit" />').
				end().
			submit(function(ev) {
				var name = $("input:last", this).prev().val();
				console.log("foo", name, this);
				var dialog = $(this).parent();
				var callback = function(xhr, status) {
					if(status == "success") { // XXX: use HTTP status code?
						dialog.remove();
						$("#recipes > .listing .active a").click(); // XXX: only useful when viewing all bags - also, hacky!
					}
				};
				tw.saveBag(name, {}, callback);
				return false;
			}).
			dialog();
	}
};

})();
