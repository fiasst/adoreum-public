var BILLING=function($,t,n,a){const e=(t,n,a,e)=>`https://hook.eu2.make.com/dnl8219shrx18c8q5zf0jbtxs2c7hkr5?plan_id=${t}&price_id=${n}&customer_id=${a}&amount=${e}`;return $((function(){HELP.waitFor(USER,"current.id",100,(function(){var t=USER.current.planConnections||[];$("#plans-wrapper");if(t.length>0){var n=[],a=USER.current.stripeCustomerId,l=!1;t=HELP.sortArrayByObjectValue(t,"payment.lastBillingDate"),$.each(t,(function(t,s){if("SUBSCRIPTION"==s.type){var i=MAIN.planNames[s.planId]||"Subscription",r=s.payment,o=HELP.getCurrencySymbol("en-US",r.currency),c=nextBillDate=lastBillDate=null;r.nextBillingDate&&(nextBillDate=$("<div>",{class:["bill-next"],html:"<strong>Renews on:</strong> "+HELP.formatTimestamp(r.nextBillingDate)})),r.lastBillingDate&&(lastBillDate=$("<div>",{class:["bill-last"],html:"<strong>Last billed:</strong> "+HELP.formatTimestamp(r.lastBillingDate)})),"ACTIVE"!=s.status&&"TRIALING"!=s.status||(l=!0,c=$("<a>",{href:e(s.planId,r.priceId,a,r.amount),text:"Cancel subscription",class:"link-cancel","data-confirm":"Are you sure you want to cancel your member subscription?"})),n.push($('<div class="plan">').append($("<div>",{class:["name"],html:"<h3>"+HELP.sanitizeHTML(i)+"</h3>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+s.status}),$("<div>",{class:["amount"],html:"<strong>Amount:</strong> "+o+HELP.formatCurrency(r.amount)}),nextBillDate,lastBillDate,c))}})),n.length>0&&($("#subscriptions").append(n),$("#banner-sub-join").toggleClass("hide",l)),$(".link-cancel").on("click",(function(t){t.preventDefault();var n=$(this),a=HELP.sanitizeHTML(n.attr("data-confirm"));if(a&&!confirm(a))return!1;MAIN.thinking(!0,!1),HELP.sendAJAX({url:n.attr("href"),data:HELP.ajaxMetaValues(),method:"GET",callbackSuccess:function(t){MAIN.thinking(!1),MAIN.handleAjaxResponse(t)},callbackError:function(t){MAIN.thinking(!1),console.log("error")}})}))}}))})),{}}(jQuery,0,this.document);