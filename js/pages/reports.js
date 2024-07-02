var REPORTS = (function($, window, document, undefined) {
    var pub = {
    	members: [],
    	current: 0,
    	total: 0,

    	// reports data.
    	genders: [],
    	countrys: [],
    	motives: [],
    	ages: [],
    	investors: [],
    	joined: []
    };


    // Load member data.
    pub.getMemberData = (after) => {
    	let endCursor = after ? '&after='+after : '';
		HELP.sendAJAX({
            url: 'https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true'+endCursor,//?after=1798073',
            method: 'GET',
            // data: data,
            callbackSuccess: function(data) {
                pub.processData(data);
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

		// set/update vars.
		pub.members.push(response.data);
		pub.current = pub.members.length;
		pub.total = response.data[0].totalCount;

		// update summary.
		updateSummary(pub.current, pub.total);

		// Load next round of data.
		if (response.data[0].hasNextPage === "true") {
			alert('hasNextPage');
        	pub.getMemberData(response.data[0].endCursor);
		}
		else {
			MAIN.thinking(false);

			// Compile data.
			$.each(pub.members, (i, member) => {
				// gender.
				if (member.customFields.gender) {
					pub.genders[member.customFields.gender]++;
				}
				else {
					pub.genders['Unknown']++;
				}

				// country.
				if (member.customFields.country) {
					pub.countrys[member.customFields.country]++;
				}
				else {
					pub.countrys['Unknown']++;
				}

				// motives.
				if (member.customFields.motive) {
					$.each(member.customFields.motive.split('|'), (i, motive) => {
						pub.motives[motive]++;
					});
				}
				else {
					pub.motives['Unknown']++;
				}

				// age.
				if (member.customFields['date-of-birth']) {
					let year = member.customFields['date-of-birth'].split('/')[2];
					if (year) {
						pub.ages[year]++;
					}
				}
				else {
					pub.ages['Unknown']++;
				}

				// investors.
				if (member.customFields.investor) {
					pub.investors[year]++;
				}
				else {
					pub.investors['Unknown']++;
				}

				// joined.
				if (member.customFields.createdAt) {
					let date = new Date(member.customFields.createdAt);
					let year = date.getFullYear();
					let month = date.getMonth()+1;// returns 0-11, so add 1 to get 1-12.
					pub.joined[`${year}-${month}`]++;
				}

				// plans.

				console.log(pub);
			});
		}
	}


	pub.updateSummary = (current, total) => {
		let $summary = $('#summary');
		$('.current', $summary).text(current);
		$('.total', $summary).text(total);
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
