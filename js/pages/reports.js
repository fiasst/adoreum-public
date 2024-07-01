var REPORTS = (function($, window, document, undefined) {
    var pub = {};


    //
    // On DOM ready.
    //
    $(function() {
        // Get all members for reports dashboard.
        MAIN.thinking(true, false);
		HELP.sendAJAX({
            url: 'https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true',//?after=1798073',
            method: 'GET',
            // data: data,
            callbackSuccess: function(data) {
                MAIN.thinking(false);
                MAIN.handleAjaxResponse(data, $form);
            },
            callbackError: function(data) {
                MAIN.thinking(false);
                console.log('error');
            }
        }, false);
	});
});
