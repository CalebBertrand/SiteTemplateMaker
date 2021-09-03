function getItDone() {
  $('.semi-paralax').each(function(){
          var $bgobj = $(this);
          var fullRotation = $bgobj.innerHeight();
          var rotation = $(window).scrollTop();
          var yPos = (rotation / fullRotation - Math.floor(rotation / fullRotation )) * (window.innerHeight/15);
          // Put together our final background position
          var coords = '50% '+ yPos + 'px';

          // Move the background
          $bgobj.css({ backgroundPosition: coords });
        }); 
}

$(document).ready(function() {
  getItDone();
	$(window).scroll(function() {    
      	getItDone();
 	});
});