;(function($,window){
	$(document).ready(function(){
		$(".bcolor").click(function(){
			console.log("div click start ...");
			$(this).css("width",$(this).width() + 100);
			$(this).css("height",$(this).height() + 200);
			
			layer.alert('内容');
		});
	});

})($,window);