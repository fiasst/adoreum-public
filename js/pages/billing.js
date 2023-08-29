var BILLING = (function($, window, document, undefined) {
    var pub = {};


    //
    // Webhooks.
    //
    const cancelMembersSubscription = (planId, priceId, customerID, amount) => `https://hook.eu2.make.com/dnl8219shrx18c8q5zf0jbtxs2c7hkr5?plan_id=${planId}&price_id=${priceId}&customer_id=${customerID}&amount=${amount}`;


    //
    // On DOM ready.
    //
    $(function() {
        //
        // Build Member's subscription plan list from JSON.
        //
        HELP.waitFor(USER, "current.id", 100, function() {
            var plans = USER.current.planConnections || [],
                wrapper = $('#plans-wrapper');

            if (plans.length > 0) {
                // User has a plan.
                var subscriptionPlans = [],
                    customerID = USER.current.stripeCustomerId,
                    hasActiveSubscription = false;

                // Sort plans by payment.lastBillingDate DESC.
                plans = HELP.sortArrayByObjectValue(plans, 'payment.lastBillingDate');

                $.each(plans, function(i, item) {
                    if (item['type'] != "SUBSCRIPTION") {
                        return;
                    }
                    var planName = MAIN.planNames[item['planId']],
                        payment = item['payment'],
                        currencySymbol = HELP.getCurrencySymbol('en-US', payment.currency),
                        cancelLink = nextBillDate = lastBillDate = null;

                    if (payment.nextBillingDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Renews on:</strong> '+ HELP.formatTimestamp(payment.nextBillingDate) });  
                    }
                    if (payment.lastBillingDate) {
                        lastBillDate = $('<div>', {class: ["bill-last"], html: '<strong>Last billed:</strong> '+ HELP.formatTimestamp(payment.lastBillingDate) });   
                    }
                    if (item['status'] == "ACTIVE" || item['status'] == "TRIALING") {
                        hasActiveSubscription = true;

                        cancelLink = $('<a>', {
                            'href': cancelMembersSubscription(item.planId, payment.priceId, customerID, payment.amount),
                            'text': 'Cancel subscription',
                            'class': 'link-cancel'
                        });
                    }

                    subscriptionPlans.push(
                        $('<div class="plan">').append(
                            $('<div>', {class: ["name"], html: '<h3>'+ HELP.sanitizeHTML(planName) +'</h3>'}),
                            $('<div>', {class: ["status"], html: '<strong>Status:</strong> '+item['status']}),
                            $('<div>', {
                                class: ["amount"],
                                html:
                                    '<strong>Amount:</strong> '+
                                    currencySymbol + HELP.formatCurrency(payment.amount)
                            }),
                            nextBillDate,
                            lastBillDate,
                            cancelLink
                        )
                    );
                });

                if (subscriptionPlans.length > 0) {
                    $('#subscriptions').append(subscriptionPlans);
                    $('#banner-sub-join').toggleClass('hide', hasActiveSubscription);
                }
              
                $('.link-cancel').on('click', function(e) {
                    e.preventDefault();
                    MAIN.thinking(true, false);
                    
                    HELP.sendAJAX({
                        url: $(this).attr('href'),
                        data: HELP.ajaxMetaValues(),
                        method: "GET",
                        callbackSuccess: function(data) {
                            MAIN.thinking(false);
                            MAIN.handleAjaxResponse(data, $form);
                        },
                        callbackError: function(data) {
                            MAIN.thinking(false);
                            console.log('error');
                        }
                    });
                });
            }
        });
    });

    return pub;
}(jQuery, this, this.document));





