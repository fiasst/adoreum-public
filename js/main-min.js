var MAIN=function($,t,e,a){var n={planNames:{"pln_international-04fg0amm":"International","pln_individual-1o2k0g6o":"Individual","pln_corporate-xs2l0g4l":"Corporate"},controlHTML:function(t,e){t.each((function(){var t=$(this);e?t.hasClass("hide")?t.removeClass("hide"):t.show():t.remove()}))},memberCanModerate:function(t){return HELP.hasPermissions("can:moderate",t)},memberCanEdit:function(t,e){var a=HELP.sanitizeHTML(e.find(".node-author").attr("data-author"));return!!HELP.checkKeyExists(t,"id")&&(t.id==a||n.memberCanModerate(t))},handleAjaxResponse:function(t,e){n.dialog(t),HELP.checkKeyExists(t,"callback")&&HELP.callNestedFunction(t.callback,t,e),e&&HELP.checkKeyExists(t,"enableForm")&&t.enableForm&&n.buttonThinking(e.find(".form-submit"),!0)},dialog:function(t){if(HELP.checkKeyExists(t,"mode"))switch(t.mode){case"alert":case"banner":break;default:n.openDialog(t)}}};return n.openDialog=a=>{var i;HELP.checkKeyExists(a,"options.actions")&&(i=$('<div class="actions justify-center" />'),$.each(a.options.actions,(function(t,e){e.attributes.class=e.attributes.class||"","button"==e.type&&(e.attributes.class+=" w-button small"),i.append($("<a>",{text:e.text,attr:HELP.sanitizeAttrs(e.attributes)}))})));var o={bodyClasses:"lbox-dialog",html:[HELP.tokenHTML(a.message),i],css:{xxs:{offset:20,maxWidth:650,contentInnerPadding:20}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},o,a.options))})),$(e).one("click",".trigger-lbox-close",(function(t){"#"==$(this).attr("href")&&t.preventDefault(),$.litbox.close()})).one("click",".trigger-reload",(function(e){e.preventDefault(),$("body").hasClass("litbox-show")&&$.litbox.close(),n.thinking(!0),t.location=t.location.href.split("#")[0]}))},n.thinking=(t,e=!1)=>{let a=t?e?"thinking-overlay":"thinking":"thinking-overlay thinking";$("body").toggleClass(a,t)},n.buttonThinking=function(t,e){if(t.length<1)return!1;e?(t.removeAttr("disabled").removeClass("thinking clicked"),"BUTTON"==t.get(0).nodeName?t.text(t.attr("data-value")):t.attr("value",t.attr("data-value"))):(t.attr("disabled",!0).addClass("thinking"),"BUTTON"==t.get(0).nodeName?t.attr("data-value",t.text()).text(t.attr("data-wait")):t.attr("data-value",t.attr("value")).attr("value",t.attr("data-wait")))},n.replaceTextWithMetadata=function(t){$("[data-ms-member-meta]").each((function(){var e=HELP.sanitizeHTML($(this).attr("data-ms-member-meta"));HELP.checkKeyExists(t,e)&&$(this).text(t[e])}))},n.bodyPreventScroll=function(t,e){$("body").toggleClass(e||"no-scroll",t)},n.openLitbox=e=>{var a={title:!1,inline:!0,returnFocus:!1,trapFocus:!1,overlayClose:!1,escKey:!1,css:{xxs:{offset:20,maxWidth:900,width:"100%",opacity:.4},sm:{offset:"5% 20px"}}};HELP.waitFor(t.jQuery,"litbox",100,(function(){$.litbox($.extend(!0,{},a,e))}))},$((function(){USER.getCurrentMember((function(t){HELP.checkKeyExists(t,"metaData")&&n.replaceTextWithMetadata(t.metaData),$("[data-ms-perm]").each((function(){n.controlHTML($(this),HELP.hasPermissions($(this).attr("data-ms-perm"),t))}))}));var a=$("#cookie-consent");HELP.getCookie("adoreum_consent")||a.removeClass("hide"),a.on("click",".consent-accept",(function(t){t.preventDefault(),HELP.setCookie("adoreum_consent","true",365),a.remove()})),a.on("click",".consent-decline",(function(t){t.preventDefault(),HELP.setCookie("adoreum_consent","false",365),[].forEach((function(t){HELP.deleteCookie(t)})),a.remove()})),$(e).on("click.dropdowns",(function(t){var e=$(".dropdown");$(t.target).closest(".dropdown .label").length?$(t.target).siblings("ul:first").toggle():$(t.target).closest(".dropdown").length||e.find("ul").hide()})),$(e).on("click",".trigger-lbox",(function(t){t.preventDefault(),n.openLitbox({title:$(this).attr("data-title"),href:$(this).attr("href")})})),$(e).on("click",".accordion-header",(function(){$(this).parent().toggleClass("active").find(".accordion-content").toggleClass("active")})),$(".alert-confirm").on("click.alertConfirm",(function(t){var e=HELP.sanitizeHTML($(this).attr("data-confirm"));if(e){if(t.preventDefault(),!confirm(e))return $(this).removeClass("clicked"),!1;$(this).off("click.alertConfirm").trigger("click")}})),$(e).on("click",".toggle-vis",(function(t){var e=HELP.sanitizeHTML($(this).attr("href"));e.length&&(t.preventDefault(),$(this).toggleClass("active"),$(e).toggleClass($(this).attr("data-toggle-class")||"hide"))})),$(e).on("click",".link-dashboard",(function(e){if(e.preventDefault(),HELP.checkKeyExists(USER,"current")){var a=USER.current.loginRedirect;if(a&&"/"!=a)t.location.href=a;else{var n=USER.current.id.split("_").slice(-1);n&&(t.location.href="/dashboard/"+n)}}}))})),n}(jQuery,this,this.document);