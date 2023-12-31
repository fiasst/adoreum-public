var BILLING = (function($, window, document, undefined) {
    var pub = {};


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
                    var planName = MAIN.planNames[item['planId']] || 'Subscription',
                        payment = item['payment'],
                        currencySymbol = HELP.getCurrencySymbol('en-US', payment.currency),
                        links = nextBillDate = lastBillDate = null,
                        statusLabel = item.status;

                    // If plan has been cancelled but is still active until expiry date.
                    if (payment.cancelAtDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Your plan will cancel on:</strong> '+ HELP.formatTimestamp(payment.cancelAtDate) });
                        statusLabel = 'SET TO CANCEL';
                    }
                    else if (payment.nextBillingDate) {
                        nextBillDate = $('<div>', {class: ["bill-next"], html: '<strong>Renews on:</strong> '+ HELP.formatTimestamp(payment.nextBillingDate) });
                    }
                    if (payment.lastBillingDate) {
                        lastBillDate = $('<div>', {class: ["bill-last"], html: '<strong>Last billed:</strong> '+ HELP.formatTimestamp(payment.lastBillingDate) });
                    }
                    if (['ACTIVE', 'TRIALING', 'REQUIRES_PAYMENT'].includes(item['status'])) {
                        hasActiveSubscription = true;

                        links = $('<div class="links actions" />')
                            .append(
                                $('<a>', {
                                    'href': '#',
                                    'text': 'Manage subscription',
                                    'class': 'trigger-customer-portal link-grey'
                                }),
                                $('<a>', {
                                    'href': '#cancel',
                                    'text': 'Looking to cancel?',
                                    'data-title': 'We\'ll be sorry to see you go',
                                    'class': 'trigger-lbox link-grey',
                                    'data-ms-content': '!is-trialing'
                                })
                            );
                    }

                    subscriptionPlans.push(
                        $('<div class="plan">').append(
                            $('<div>', {class: ["name"], html: '<h3>'+ HELP.sanitizeHTML(planName) +'</h3>'}),
                            $('<div>', {class: ["status"], html: '<strong>Status:</strong> '+ statusLabel}),
                            $('<div>', {
                                class: ["amount"],
                                html:
                                    '<strong>Amount:</strong> '+
                                    currencySymbol + HELP.formatCurrency(payment.amount)
                            }),
                            nextBillDate,
                            lastBillDate,
                            links
                        )
                    );
                });

                if (subscriptionPlans.length > 0) {
                    $('#subscriptions').append(subscriptionPlans);
                }
            }
        });
    });

    return pub;
}(jQuery, this, this.document));





