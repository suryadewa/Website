//<![CDATA[
var rpTitleLength = 46, // 最新文章標題長度 英文位元計算
	ppTitleLength = 76; // 熱門文章標題長度

function substrUnicodeLength(g,e){var h=g.length,f=0;for(var j=0;j<h;j++){var i=g.charCodeAt(j);if(i<128){f++}else{f=f+2}if(f>e){return g.substr(0,j)+"..."}}return g}function labelthumbs(D){document.write('<ul class="lst_wrap">');for(var R=0;numposts>R;R++){var I,M=D.feed.entry[R],E=M.title.$t,N=substrUnicodeLength(E,rpTitleLength);if(R==D.feed.entry.length){break}for(var H=0;H<M.link.length;H++){if("replies"==M.link[H].rel&&"text/html"==M.link[H].type){var K=M.link[H].title,C=M.link[H].href}if("alternate"==M.link[H].rel){I=M.link[H].href;break}}var J;try{J=M.media$thumbnail.url}catch(Q){s=M.content.$t,a=s.indexOf("<img"),b=s.indexOf('src="',a),c=s.indexOf('"',b+5),d=s.substr(b+5,c-b-5),J=-1!=a&&-1!=b&&-1!=c&&""!=d?d:"http://2.bp.blogspot.com/_IKigl6y9hFA/TMdcT1jzo5I/AAAAAAAAAHA/hAKuT9rJpFU/noimage.jpg"}var O=M.published.$t,G=O.substring(0,4),P=O.substring(5,7),B=O.substring(8,10),z=new Array,S=O.substring(0,10).replace(/-/g,"/");if(z[1]="Jan",z[2]="Feb",z[3]="Mar",z[4]="Apr",z[5]="May",z[6]="Jun",z[7]="Jul",z[8]="Aug",z[9]="Sep",z[10]="Oct",z[11]="Nov",z[12]="Dec",document.write('<li class="clearfix">'),1==showpostthumbnails&&document.write('<a class="lst_thmba" title="'+E+'" href="'+I+'" target ="_top"><img alt="'+E+'" class="lst_thmb" src="'+J+'" title="'+E+'"/></a>'),document.write('<a class="lst_title" href="'+I+'" target ="_top" title="'+E+'">'+N+"</a>"),"content" in M){var j=M.content.$t}else{if("summary" in M){var j=M.summary.$t}else{var j=""}}var q=/<\S[^>]*>/g;if(j=j.replace(q,""),1==showpostsummary){if(j.length<numchars){document.write(""),document.write(j),document.write("")}else{document.write(""),j=j.substring(0,numchars);var L=j.lastIndexOf(" ");j=j.substring(0,L),document.write(j+"..."),document.write("")}}var T="",F=0;document.write(""),1==showpostdate&&(T=T+'<abbr class="lst_date">'+S+"</abbr>",F=1),1==showcommentnum&&(1==F&&(T+="<br/>"),"1 Comments"==K&&(K="1 Comment"),"0 Comments"==K&&(K="0 Comments"),K='<a class="lst_cmnts" href="'+C+'" target ="_top">'+K+"</a>",T+=K,F=1),1==displaymore&&(1==F&&(T+=""),T=T+'<a class="lst_rdmr" href="'+I+'" class="url" target ="_top">More »</a>',F=1),document.write(T),document.write('<span class="clear"></span></li>'),1==displayseparator&&R!=numposts-1&&document.write("")}document.write("</ul>")}function showLucky(g){for(var h=g.feed,f=(h.entry||[],h.entry[0]),i=0;i<f.link.length;++i){"alternate"==f.link[i].rel&&(window.location=f.link[i].href)}}function fetchLuck(e){script=document.createElement("script"),script.src="/feeds/posts/summary?start-index="+e+"&max-results=1&alt=json-in-script&callback=showLucky",script.type="text/javascript",document.getElementsByTagName("head")[0].appendChild(script)}function readLucky(g){var h=g.feed,f=parseInt(h.openSearch$totalResults.$t,10),i=Math.floor(Math.random2()*f);i++,fetchLuck(i)}function feelingLucky(){var e=document.createElement("script");e.type="text/javascript",e.src="/feeds/posts/summary?max-results=0&alt=json-in-script&callback=readLucky",document.getElementsByTagName("head")[0].appendChild(e)}!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(h){function l(){var n=f(this),i=k.settings;return isNaN(n.datetime)||(0==i.cutoff||Math.abs(g(n.datetime))<i.cutoff)&&h(this).text(m(n.datetime)),this}function f(n){if(n=h(n),!n.data("timeago")){n.data("timeago",{datetime:k.datetime(n)});var i=h.trim(n.text());k.settings.localeTitle?n.attr("title",n.data("timeago").datetime.toLocaleString()):!(i.length>0)||k.isTime(n)&&n.attr("title")||n.attr("title",i)}return n.data("timeago")}function m(e){return k.inWords(g(e))}function g(e){return(new Date).getTime()-e.getTime()}h.timeago=function(i){return m(i instanceof Date?i:"string"==typeof i?h.timeago.parse(i):"number"==typeof i?new Date(i):h.timeago.datetime(i))};var k=h.timeago;h.extend(h.timeago,{settings:{refreshMillis:60000,allowPast:!0,allowFuture:!1,localeTitle:!1,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",inPast:"any moment now",seconds:"less than a minute",minute:"about a minute",minutes:"%d minutes",hour:"about an hour",hours:"about %d hours",day:"a day",days:"%d days",month:"about a month",months:"%d months",year:"about a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(y){function B(e,n){var u=h.isFunction(e)?e(n,y):e,o=t.numbers&&t.numbers[n]||n;return u.replace(/%d/i,o)}if(!this.settings.allowPast&&!this.settings.allowFuture){throw"timeago allowPast and allowFuture settings can not both be set to false."}var t=this.settings.strings,x=t.prefixAgo,p=t.suffixAgo;if(this.settings.allowFuture&&0>y&&(x=t.prefixFromNow,p=t.suffixFromNow),!this.settings.allowPast&&y>=0){return this.settings.strings.inPast}var D=Math.abs(y)/1000,q=D/60,w=q/60,C=w/24,A=C/365,v=45>D&&B(t.seconds,Math.round(D))||90>D&&B(t.minute,1)||45>q&&B(t.minutes,Math.round(q))||90>q&&B(t.hour,1)||24>w&&B(t.hours,Math.round(w))||42>w&&B(t.day,1)||30>C&&B(t.days,Math.round(C))||45>C&&B(t.month,1)||365>C&&B(t.months,Math.round(C/30))||1.5>A&&B(t.year,1)||B(t.years,Math.round(A)),z=t.wordSeparator||"";return void 0===t.wordSeparator&&(z=" "),h.trim([x,v,p].join(z))},parse:function(n){var i=h.trim(n);return i=i.replace(/\.\d+/,""),i=i.replace(/-/,"/").replace(/-/,"/"),i=i.replace(/T/," ").replace(/Z/," UTC"),i=i.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),i=i.replace(/([\+\-]\d\d)$/," $100"),new Date(i)},datetime:function(n){var i=h(n).attr(k.isTime(n)?"datetime":"title");return k.parse(i)},isTime:function(i){return"time"===h(i).get(0).tagName.toLowerCase()}});var j={init:function(){var e=h.proxy(l,this);e();var i=k.settings;i.refreshMillis>0&&(this._timeagoInterval=setInterval(e,i.refreshMillis))},update:function(e){var i=k.parse(e);h(this).data("timeago",{datetime:i}),k.settings.localeTitle&&h(this).attr("title",i.toLocaleString()),l.apply(this)},updateFromDOM:function(){h(this).data("timeago",{datetime:k.parse(h(this).attr(k.isTime(this)?"datetime":"title"))}),l.apply(this)},dispose:function(){this._timeagoInterval&&(window.clearInterval(this._timeagoInterval),this._timeagoInterval=null)}};h.fn.timeago=function(n,o){var i=n?j[n]:j.init;if(!i){throw new Error("Unknown function name '"+n+"' for timeago")}return this.each(function(){i.call(this,o)}),this},document.createElement("abbr"),document.createElement("time")}),function(g,h,f){g.fn.tinyNav=function(j){var e=g.extend({active:"selected",header:"Navigation",label:""},j);return this.each(function(){f++;var q=g(this),m="tinynav"+f,k=".l_"+m,p=g("<select/>").attr("id",m).addClass("tinynav "+m);if(q.is("ul,ol")){""!==e.header&&p.append(g("<option/>").text(e.header));var i="";q.addClass("l_"+m).find("a").each(function(){i+='<option value="'+g(this).attr("href")+'">';var l;for(l=0;l<g(this).parents("ul, ol").length-1;l++){i+="- "}i+=g(this).text()+"</option>"}),p.append(i),e.header||p.find(":eq("+g(k+" li").index(g(k+" li."+e.active))+")").attr("selected",!0),p.change(function(){h.location.href=g(this).val()}),g(k).after(p),e.label&&p.before(g("<label/>").attr("for",m).addClass("tinynav_label "+m+"_label").append(e.label))}})}}(jQuery,this,0),$(function(){$("#fnav").tinyNav()}),$(function(){var e=window.location.href;$("nav a").each(function(){this.href===e&&$(this).addClass("active")})});
//]]>