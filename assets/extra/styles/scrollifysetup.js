$(function() {
		$.scrollify({
			section : "div.section",
			scrollSpeed: 1400,
			before:function() {
				$( ".fixed" ).each(function( index ) {
					$(this).fadeOut(100 * (index+1));
				});
			},
			after:function() {
				$(".fixed").each(function( index ) {
					if ($(this).attr('id') === "nav-toggle") {
  						if ($(window).innerWidth() <= 766) {
  							$(this).fadeIn(100 * (index+1));
  						}
  					}else{
						$(this).fadeIn(50 * (index*1.5+1));
					}
				});
			},
		});
	});