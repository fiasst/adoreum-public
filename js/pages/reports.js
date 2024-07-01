var REPORTS = (function($, window, document, undefined) {
    var pub = {};


    // Load member data.
    pub.getMemberData = (after) => {
    	let endCursor = after ? '&after='+after : '';
		HELP.sendAJAX({
            url: 'https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true'+endCursor,//?after=1798073',
            method: 'GET',
            // data: data,
            callbackSuccess: function(data) {
                // Add callback function to the response data.
                data.callback = 'REPORTS.processData';

                MAIN.handleAjaxResponse(data, null);
            },
            callbackError: function(data) {
                MAIN.thinking(false);
                console.log('error');
            }
        }, false);
	}

	// Callback function to process all members data.
	pub.processData = (response) => {
		console.log(response);
		if (response.data[0].hasNextPage === true) {
			// Load next round of data.
			alert('hasNextPage');
        	pub.getMemberData(response.data[0].endCursor);
		}
		else {
			MAIN.thinking(false);
		}
	}


	//
    // On DOM ready.
    //
    $(function() {
        // Get all members for reports dashboard.
        MAIN.thinking(true);

        // Get first round of data.
        pub.getMemberData();
	});

	return pub;
}(jQuery, this, this.document));
