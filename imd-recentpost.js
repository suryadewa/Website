// Recent Post Thumbnail  Blogger
// www.imadenews.com

$(function() {
	$('div.rp-item img').hide();
	$('div.rp-child').removeClass('hidden');
	
	var winWidth = $(window).width(),
	winHeight	 = $(window).height(),
	ttWidth	     = $('div.rp-child').outerWidth(),
	ttHeight	 = $('div.rp-child').outerHeight(),
	thumbWidth   = $('div.rp-item').outerWidth(),
	thumbHeight  = $('div.rp-item').outerHeight();


	$('div.rp-item').css('position', 'static').mouseenter(function() {
		$('div.rp-child', this).filter(':not(:animated)').fadeIn(rcFadeSpeed);
	}).mousemove(function(e) {	
		var top  = e.pageY+20,
			left = e.pageX+20;
			
			if (top + ttHeight > winHeight) {
				top = winHeight - ttHeight - 40;
			}			
			if (left + ttWidth > winWidth) {
				left = winWidth - ttWidth - 40;
			}	

		$('div.rp-child', this).css({top:top, left:left});

	}).mouseleave(function() {
		$('div.rp-child', this).hide();
	});
});

function showrecentposts(json) {
	var entry = json.feed.entry;
	for (var i = 0; i < numposts; i++) {
		var posturl;  
		for (var j=0; j < entry[i].link.length; j++) {
			if (entry[i].link[j].rel == 'alternate') {
				posturl = entry[i].link[j].href;
				break;
			}
		}
		
		if ("content" in entry[i]) {
			var postcontent = entry[i].content.$t;
		} else if ("summary" in entry[i]) {
			var postcontent = entry[i].summary.$t;
		} else {
			var postcontent = "";
		}

		var re = /<\S[^>]*>/g; 
		postcontent = postcontent.replace(re, "");
		if (postcontent.length > numchar) {
			postcontent = postcontent.substring(0,numchar) + '...';
		}

		var poststitle = entry[i].title.$t;

			if ("media$thumbnail" in entry[i]) {
				postimg = entry[i].media$thumbnail.url
			} else {
				postimg = pBlank
			}
		
		document.write('<div class="rp-item"><a href="' + posturl + '"><img src="' + postimg + '" alt="thumb" /></a>');
		document.write('<div class="rp-child hidden"><h4>' + poststitle + '</h4>');
		document.write(postcontent + '</div>');
		document.write('</div>');
	}
}
document.write('<div id="post-gallery"><h2>' + rpTitle + '</h2><sc' + 'ript src="' + blogURL + '/feeds/posts/default?max-results=' + numposts + '&orderby=published&alt=json-in-script&callback=showrecentposts"></sc' + 'ript><div style="clear:both;"></div></div>');

var i = 0, int=0;
$(window).bind("load", function() {
	var int = setInterval("doThis(i)",400);
});
 
function doThis() {
	var imgs = $('div.rp-item img').length;
	if (i >= imgs) {clearInterval(int);}
	$('div.rp-item img:hidden').eq(0).fadeIn(400);
	i++;
}
