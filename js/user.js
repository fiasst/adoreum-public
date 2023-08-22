USER = (function($, window, document, undefined) {
    var pub = {};


    //
    //
    //
    pub.current = HELP.getCookie("MSmember") || {};


    //
    // Useful for When a user deletes their account and clicks the final modal CTA.
    //
    pub.logout = () => {
        MAIN.thinking(true);
        USER.current = null;
        HELP.setCookie("MSmember", null);
        $memberstackDom.logout().then(() => {
            // Delay so MS can catch up and display login/register links on page change.
            setTimeout(function() {
                window.location.href = '/';
            }, 1500);
        });
    };


    //
    //
    //
    pub.updateCurrentUser = function(obj) {
        USER.current = USER.current || pub.current;

        // Merge into current user var.
        $.extend(true, USER.current, obj);
    };


    //
    // get the current Member then fire callback function.
    //
    pub.getCurrentMember = function(callback) {
        USER.current = USER.current || pub.current;

        if (HELP.checkKeyExists(USER, 'current.id')) {
            return USER.current;
        }
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            window.$memberstackDom.getCurrentMember().then(({ data: member }) => {
                member = member || {};
                pub.updateCurrentUser(member);

                if (!!callback) callback(USER.current);
                return USER.current;
            });
        });
    };
    

    //
    // get Member's JSON then fire callback function.
    //
    pub.getMemberJSON = function(callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            window.$memberstackDom.getMemberJSON().then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) callback(memberJSON);
                return memberJSON;
            });
        });
    };


    //
    // update Member's JSON.
    //
    pub.updateMemberJSON = function(json, callback) {
        HELP.waitFor(window, "$memberstackDom", 50, function() {
            window.$memberstackDom.updateMemberJSON({ json: json }).then(({ data: memberJSON }) => {
                memberJSON = memberJSON || {};

                if (!!callback) callback(memberJSON);
                return memberJSON;
            });
        });
    };


    //
    //
    //
    pub.getMemberPlans = function(planType, member, activeOnly) {
        member = member || pub.getCurrentMember();

        if (HELP.checkKeyExists(member, 'planConnections') && !!member.planConnections.length) {
            // Get active plans.
            var plans = member.planConnections;

            if (activeOnly) {
                // Filter plans by status set to "ACTIVE" or "TRIALING".
                plans = HELP.filterArrayByObjectValue(plans, 'status', ['ACTIVE', 'TRIALING']);
            }

            // Filter plans by type set to <planType>.
            if (planType) {
                plans = HELP.filterArrayByObjectValue(plans, 'type', planType);
            }
            return plans;
        }
        return [];
    };


    //
    // init.
    //
    pub.getCurrentMember();


    //
    // Deleted user account callback.
    //
    pub.ghostLogout = function() {
        // CTA button is in the dialog confirming your account was deleted.
        $(document).on('click', '#trigger-ghost-logout', pub.logout);
    };
    


    return pub;
}(jQuery, this, this.document));





