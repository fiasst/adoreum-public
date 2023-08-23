"use strict";
/*!
Litbox 1.0.0
	license: MIT
	http://mustimpress.com/litbox
	Copyright 2023 Marc Hudson

Based on Colorbox 1.6.4
	license: MIT
	http://jacklmoore.com/colorbox
*/!function($,e,t){var n,o,i,a,r,s,l,c,d,u,g,f,p,h,m,v,x,y,b,C,w,k,T,I,W,H,E,O={html:!1,image:!1,iframe:!1,inline:!1,saveUpdates:!1,bodyClasses:"",speed:!1,fadeOut:300,scrolling:!0,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,data:void 0,closeButton:!0,fastIframe:!0,open:!1,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"Start slideshow",slideshowStop:"Stop slideshow",imageRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,breakpoints:{xxs:0,xs:479,sm:768,md:992,lg:1342},css:{xxs:{overlayColor:"#000",opacity:.4,width:!1,minWidth:60,maxWidth:!1,height:!1,minHeight:60,maxHeight:!1,offset:0,borderRadius:20,boxHalign:"center",boxValign:"center",contentOuterPadding:20,contentInnerPadding:0,contentMaxWidth:!1,contentMaxHeight:!1,contentHalign:"center"}},retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"{current} of {total}",previous:"Previous",next:"Next",close:"Close",xhrError:"Content failed to load",imgError:"Image failed to load",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return $(this).attr("href")},title:function(){return this.title},createImg:function(){var e=new Image,t=$(this).data(j+"-img-attrs");return"object"==typeof t&&$.each(t,(function(t,n){e[t]=n})),e},createIframe:function(){var t=e.createElement("iframe"),n=$(this).data(j+"-iframe-attrs");return"object"==typeof n&&$.each(n,(function(e,n){t[e]=n})),"frameBorder"in t&&(t.frameBorder=0),"allowTransparency"in t&&(t.allowTransparency="true"),t.name=(new Date).getTime(),t.allowFullscreen=!0,t}},S="litbox",j="lbox",L=j+"Element",P=j+"_open",B=j+"_load",K=j+"_complete",R=j+"_cleanup",D=j+"_closed",_=j+"_purge",F=$("<a/>"),N="div",A=0;const M=(e,t,n)=>$(`<${e}/>`,{id:t?j+t:null,style:n});function U(e,t){t!==Object(t)&&(t={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(void 0!==(n=$(this.el).attr(`data-${j}-${e}`))?this.cache[e]=n:void 0!==t[e]?this.cache[e]=t[e]:void 0!==O[e]&&(this.cache[e]=O[e])),this.cache[e]},this.get=function(e){var t=this.value(e);return"function"==typeof t?t.call(this.el,this):t}}const V=e=>{for(let t in e)"object"==typeof e[t]?V(e[t]):"true"!==e[t]&&"false"!==e[t]||(e[t]="true"===e[t]);return e};function q(e){var t=r.length,n=(b+e)%t;return n<0?t+n:n}function G(e){return e.toString().indexOf("px")<0?`${e}px`:e}function Q(e,t){return e.get("image")||e.get("imageRegex").test(t)}function z(e,n){return e.get("retinaUrl")&&t.devicePixelRatio>1?n.replace(e.get("imageRegex"),e.get("retinaSuffix")):n}function J(e){"contains"in o[0]&&!o[0].contains(e.target)&&e.target!==n[0]&&(e.stopPropagation(),o.focus())}function X(e){X.str!==e&&(n.removeClass(X.str).addClass(e),X.str=e)}function Y(t){$(e).trigger(t),F.triggerHandler(t)}var Z=function(){var e,t,n="click."+j;function i(){clearTimeout(t)}function a(){(y.get("loop")||r[b+1])&&(i(),t=setTimeout(H.next,y.get("slideshowSpeed")))}function s(){p.text(y.get("slideshowStop")).unbind(n).one(n,l),F.bind(K,a).bind(B,i),o.removeClass("slideshow-off").addClass("slideshow-on")}function l(){i(),F.unbind(K,a).unbind(B,i),p.text(y.get("slideshowStart")).unbind(n).one(n,(function(){H.next(),s()})),o.removeClass("slideshow-on").addClass("slideshow-off")}function c(){e=!1,p.hide(),i(),F.unbind(K,a).unbind(B,i),o.removeClass("slideshow-off slideshow-on")}return function(){e?y.get("slideshow")||(F.unbind(R,c),c()):y.get("slideshow")&&r[1]&&(e=!0,F.one(R,c),y.get("slideshowAuto")?s():l(),p.show())}}();function ee(e){if(e){var t=y.get("breakpoints"),n="",o=(e,t)=>{var n={};$.each(t,(function(e,t){0===t&&(t=G(t)),n[e]=t||""}));var o=$("<div>").css(n);return o.attr("style")?`${e}{${o.attr("style")}}`:""};$.each(e,(function(i,a){if(!($.inArray(i,Object.keys(t))<0)){"xxs"===i&&(a.opacity=a.opacity||e.xxs.opacity,a.overlayColor=a.overlayColor||e.xxs.overlayColor);var r,s=a.opacity&&a.overlayColor?"rgba("+(["0x"+(r=(r=a.overlayColor).replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(function(e,t,n,o){return"#"+t+t+n+n+o+o})))[1]+r[2]|0,"0x"+r[3]+r[4]|0,"0x"+r[5]+r[6]|0]+",")+a.opacity+")":"",l=[o(`#${j}Overlay`,{background:s,padding:a.offset,justifyContent:a.boxHalign,alignItems:a.boxValign}),o("#litbox",{width:a.width,maxWidth:a.maxWidth,height:a.height,maxHeight:a.maxHeight}),o(`#${j}Wrapper`,{"border-radius":a.borderRadius}),o(`#${j}Content`,{padding:a.contentOuterPadding}),o(`#${j}LoadedContent`,{justifyContent:a.contentHalign}),o(`#${j}ContentWrap`,{padding:a.contentInnerPadding,minWidth:a.minWidth,minHeight:a.minHeight,maxWidth:a.contentMaxWidth,maxHeight:a.contentMaxHeight})].filter(Boolean).join("");l&&(n+="xxs"===i?l:`@media only screen and (min-width:${G(t[i])}){${l}}`)}})),n&&($("style.litbox-css").remove(),$("body").append($('<style type="text/css" class="litbox-css" />').text(n)))}}function te(s){var f,p;if(!I){if(f=$(s).data(S),y=new U(s,f),p=y.get("rel"),b=0,p&&!1!==p&&"nofollow"!==p?(r=$("."+L).filter((function(){return new U(this,$.data(this,S)).get("rel")===p})),-1===(b=r.index(y.el))&&(r=r.add(y.el),b=r.length-1)):r=$(y.el),w||(w=k=!0,X(y.get("className")),o.css({opacity:""}),c=M(N,"ContentWrap"),a.append(l=M(N,"LoadedContent").append(c)),Y(P),y.get("onOpen"),y.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",J,!0),F.one(D,(function(){e.removeEventListener("focus",J,!0)}))),y.get("returnFocus")&&F.one(D,(function(){$(y.el).focus()}))),T){$("body").addClass("litbox-show").removeClass(f.removeBodyClasses).addClass(y.get("bodyClasses")),ee(y.get("css"));var h=y.get("title");g.toggle(!!h).text(h),o.focus().toggleClass("has-title",!!h),n.css({cursor:y.get("overlayClose")?"pointer":""}),y.get("closeButton")?v.text(y.get("close")).prependTo(i):v.appendTo("<div/>")}!function(){var e,n,o=H.prep,i=++A;if(k=!0,C=!1,Y(_),Y(B),y.get("onLoad"),e=y.get("href"),W=setTimeout((function(){d.show()}),100),y.get("inline")){var a=$(e).eq(0);n=$("<div>").hide().insertBefore(a),F.one(_,(function(){n.replaceWith(a)})),o(a)}else if(y.get("iframe"))o(" ");else if(y.get("html"))o(y.get("html"));else if(Q(y,e)){e=z(y,e),C=y.get("createImg");var s=y.get("retinaImage")?" retinaImage":"";$(C).addClass(j+"Image"+s).bind("error."+j,(function(){o(M(N,"Error").text(y.get("imgError")))})).one("load",(function(){i===A&&setTimeout((function(){y.get("retinaImage")&&t.devicePixelRatio>1&&(C.width=C.width/t.devicePixelRatio),r[1]&&(y.get("loop")||r[b+1])&&(C.style.cursor="pointer",$(C).bind("click."+j,(function(){H.next()}))),C.style.width=G(C.width),o(C)}),1)})),C.src=e}else e&&u.load(e,y.get("data"),(function(e,t){i===A&&o("error"===t?M(N,"Error").text(y.get("xhrError")):$(this).contents())}))}()}}function ne(){o||(E=!1,s=$(t),n=M(N,"Overlay").append(o=M(N).attr({id:S,class:!1===$.support.opacity?j+"IE":"",role:"dialog",tabindex:"-1"}).append(i=M(N,"Wrapper").append(f=M(N,"Current"),m=$('<button type="button"/>').attr({class:j+"Control prevnext",id:j+"Prev"}),h=$('<button type="button"/>').attr({class:j+"Control prevnext",id:j+"Next"}),p=$('<button type="button"/>').attr({class:j+"Control",id:j+"Slideshow"}),v=$('<button type="button"/>').attr({class:j+"Control",id:j+"Close"}),g=M(N,"Title"),a=M(N,"Content").append(d=M(N,"LoadingGraphic"))),u=M(N,"LoadingBay"))),x=h.add(m).add(f).add(p)),e.body&&!n.parent().length&&$(e.body).append(n)}function oe(){function t(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||e.ctrlKey||(e.preventDefault(),te(this))}return!!o&&(E||(E=!0,h.click((function(){H.next()})),m.click((function(){H.prev()})),v.click((function(){H.close()})),n.click((function(e){if(y.get("overlayClose")){if(e.target!==e.currentTarget)return;H.close()}})),$(e).bind("keydown."+j,(function(e){var t=e.keyCode;w&&y.get("escKey")&&27===t&&(e.preventDefault(),H.close()),w&&y.get("arrowKey")&&r[1]&&!e.altKey&&(37===t?(e.preventDefault(),m.click()):39===t&&(e.preventDefault(),h.click()))})),"function"==typeof $.fn.on?$(e).on("click."+j,"."+L,t):$("."+L).live("click."+j,t)),!0)}$.litbox||($(ne),(H=$.fn.litbox=$.litbox=function(e,t){var n=$.litbox.settings(),o=this;T=!0,e=e||{},"function"==typeof o&&(o=$("<a/>"),e.open=!0),n&&(e.removeBodyClasses=n.get("bodyClasses"));var i=$.extend(!0,{},O,e);return o[0]?(ne(),oe()&&(t&&(i.onComplete=t),o.each((function(){var e=$.data(this,S)||{};$.data(this,S,$.extend(e,i))})).addClass(L),new U(o[0],i).get("open")&&te(o[0])),o):o}).update=(e={})=>{if(!w)return;e=V(e);const t=y.el,i=$.data(t,S)||{},a=$.extend(!0,{},i,e);e.saveUpdates&&$.data(t,S,a),y=new U(t,a);const{bodyClasses:r}=a;ee(a.css),g.toggle(!!a.title).text(a.title),o.focus().toggleClass("has-title",!!a.title),$("body").removeClass(i.bodyClasses).addClass(r),n.css({cursor:e.overlayClose?"pointer":""})},H.prep=t=>{if(w){var n,o,i=y.get("speed")||0;o=function(){l.remove(),l=M(N,"LoadedContent","opacity: 0").append(c=M(N,"ContentWrap").append(t)),a.prepend(l.appendTo(u)),$(C).css({float:"none"}),X(y.get("className"))},n=function(){var t,n,o=r.length;w&&(n=function(){clearTimeout(W),d.hide(),Y(K),y.get("onComplete")},o>1?("string"==typeof y.get("current")&&f.text(y.get("current").replace("{current}",b+1).replace("{total}",o)).show(),h[y.get("loop")||b<o-1?"show":"hide"]().text(y.get("next")),m[y.get("loop")||b?"show":"hide"]().text(y.get("previous")),Z(),y.get("preloading")&&$.each([q(-1),q(1)],(function(){var t=r[this],n=new U(t,$.data(t,S)),o=n.get("href");o&&Q(n,o)&&(o=z(n,o),e.createElement("img").src=o)}))):x.hide(),y.get("iframe")?(t=y.get("createIframe"),y.get("scrolling")||(t.scrolling="no"),$(t).attr({src:y.get("href"),class:j+"Iframe"}).one("load",n).appendTo(c.addClass("iframe")),F.one(_,(function(){t.src="//about:blank"})),y.get("fastIframe")&&$(t).trigger("load")):n(),l.fadeTo(i,1,(function(){!1===$.support.opacity&&l.style.removeAttribute("filter")})))},k=!1,l.fadeTo(i,0,(function(){o(),n()}))}},H.next=()=>{!k&&r[1]&&(y.get("loop")||r[b+1])&&(T=!1,b=q(1),te(r[b]))},H.prev=()=>{!k&&r[1]&&(y.get("loop")||b)&&(T=!1,b=q(-1),te(r[b]))},H.close=()=>{w&&!I&&(I=!0,w=!1,T=!0,Y(R),y.get("onCleanup"),s.unbind("."+j),n.fadeTo(y.get("fadeOut")||0,0),o.stop().fadeTo(y.get("fadeOut")||0,0,(function(){$("body").removeClass(["litbox-show",y.get("bodyClasses")]),Y(_),l.remove(),$("style.litbox-css").remove(),n.css("opacity",""),setTimeout((function(){I=!1,Y(D),y.get("onClosed")}),10)})))},H.remove=()=>{o&&(o.stop(),$.litbox.close(),n.remove(),I=!1,o=null,$("."+L).removeData(S).removeClass(L),$("style.litbox-css").remove(),$(e).unbind("click."+j).unbind("keydown."+j))},H.element=()=>!!w&&$(y.el),H.defaults=()=>O,H.settings=()=>!!w&&y)}(jQuery,document,window);