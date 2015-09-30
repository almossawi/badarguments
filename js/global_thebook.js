"use strict";

var left_amount = 10;
var top_amount = 1;

$(document).ready(function () {
	audiojs.events.ready(function() {
		var as = audiojs.createAll();
	});

	$('#sections a').bind('click',function(event){
        var $anchor = $(this);

        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500,'easeInOutExpo');

    	event.preventDefault();
    });
});

function left() {
    left_amount = Math.floor((Math.random()*10)+2);
    top_amount = Math.floor((Math.random()*2)+1);

    $("#boat").animate({left: "-=" + left_amount, top: "+=" + top_amount}, 2000, "easeInOutCubic", right);
}

function right() {		
    $("#boat").animate({left: "+=" + left_amount, top: "-=" + top_amount}, 2000, "easeInOutCubic", left);
}