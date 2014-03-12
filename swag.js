var speed = 500 * ($(window).width()/1024);

function animatePage (pseudoElement) { // pseudoElement must be "after" or "before"
	if(pseudoElement === "after") {
		var pseudo = window["$" + pseudoElement],
			percentage = 0 - 100;
	}
	if(pseudoElement === "before") {
		var pseudo = window["$" + pseudoElement],
			percentage = 100;
	}

	console.log(pseudoElement + " + " + pseudo);

	$after = $('.swag-after');
	$before = $('.swag-before');
	$main = $('.swag-main');

	pseudo.animate( {left: '0'}, speed, "swing" );
	$main.animate( {left: percentage + "%"}, speed, "swing", function(){

		$main.html("")
			.addClass('swag-' + pseudoElement)
			.removeClass('swag-main')
			.css( {left: 0 - percentage + "%"} );

		pseudo.removeClass('swag-' + pseudoElement)
			.addClass('swag-main');

	});
}

function load_ajax_data(container) {
	State = History.getState();   
	$.post(State.url, function(data) {
		var target = $(data).filter(container)[0].outerHTML,
			changeTitle = $(data).filter("title").text();


		$main = $('.swag-main');
		$after = $('.swag-after');
		$before = $('.swag-before');
		$(document).attr('title', changeTitle);
		
		if (State.data.direction == "right"){
			$after.html( target , animatePage("after"));
		}

		if (State.data.direction == "left"){
			$before.html( target , animatePage("before"));
		}
	});
}


$.fn.swagLoad = function(clickable) {
	$(this).wrap("<div id='swag' class='swag-main'></div>").parent().after("<div class='swag-after'></div>").before("<div class='swag-before'></div>");

    $.ajaxSetup({ cache: false });
    var container = this.selector;

	var History = window.History,
		State = History.getState();

	$('body').on('click', clickable, function(e) {
		e.preventDefault();
		var path = $(this).attr('href');
		var direction = $(this).data('direction');
		History.pushState( {direction: direction} , null , path );
	});

	History.Adapter.bind(window,'statechange',function(e) {

		load_ajax_data(container);
	});
	console.log("Swag Loaded ...");
	return this;
}