var BILLING=function($,t,a,l){return $((function(){HELP.waitFor(USER,"current.id",100,(function(){var t=USER.current.planConnections||[];$("#plans-wrapper");if(t.length>0){var a=[];USER.current.stripeCustomerId;t=HELP.sortArrayByObjectValue(t,"payment.lastBillingDate"),$.each(t,(function(t,l){if("SUBSCRIPTION"==l.type){var n=MAIN.planNames[l.planId]||"Subscription",e=l.payment,s=HELP.getCurrencySymbol("en-US",e.currency),i=nextBillDate=lastBillDate=null;e.cancelAtDate?nextBillDate=$("<div>",{class:["bill-next"],html:"<strong>Your plan will cancel on:</strong> "+HELP.formatTimestamp(e.cancelAtDate)}):e.nextBillingDate&&(nextBillDate=$("<div>",{class:["bill-next"],html:"<strong>Renews on:</strong> "+HELP.formatTimestamp(e.nextBillingDate)})),e.lastBillingDate&&(lastBillDate=$("<div>",{class:["bill-last"],html:"<strong>Last billed:</strong> "+HELP.formatTimestamp(e.lastBillingDate)})),"ACTIVE"!=l.status&&"TRIALING"!=l.status||(!0,i=$("<a>",{href:"#",text:"Manage subscription",class:"trigger-customer-portal link-grey"})),a.push($('<div class="plan">').append($("<div>",{class:["name"],html:"<h3>"+HELP.sanitizeHTML(n)+"</h3>"}),$("<div>",{class:["status"],html:"<strong>Status:</strong> "+l.status}),$("<div>",{class:["amount"],html:"<strong>Amount:</strong> "+s+HELP.formatCurrency(e.amount)}),nextBillDate,lastBillDate,i))}})),a.length>0&&$("#subscriptions").append(a)}}))})),{}}(jQuery,0,this.document);