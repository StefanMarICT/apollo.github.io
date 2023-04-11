//SCROLL TO TOP
$(window).scroll(function(){
	if($(this).scrollTop()>50){
		$("#scrollUp").fadeIn(100);
	}
	else
	{
		$("#scrollUp").fadeOut(100);
	}
});
$("#scrollUp").click(function(){
	$("body, html").animate({scrollTop:0},500
	);
});