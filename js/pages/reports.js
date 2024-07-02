var REPORTS = (function($, window, document, undefined) {
    let pub = {};

    pub.members = [];
	pub.current = 0;
	pub.total = 0;

	// reports data.
	pub.genders = [{'Unknown': 0}];
	pub.countrys = [{'Unknown': 0}];
	pub.motives = [];
	pub.ages = [{'Unknown': 0}];
	pub.investors = [];
	pub.joined = [];
	pub.plans = [];


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
		pub.members = pub.members.concat(response.data);
		pub.current = pub.members.length;
		pub.total = response.data[0].totalCount;

		// update summary.
		pub.updateSummary(pub.current, pub.total);

		// Load next round of data.
		if (response.data[0].hasNextPage === "true") {
			alert('hasNextPage');
        	pub.getMemberData(response.data[0].endCursor);
		}
		else {
			MAIN.thinking(false);
			// helper to set/update counts.
			const updateValue = (prop, val) => {
				if (!!prop[val]) {
					prop[val]++;
				}
				else {
					prop[val] = 1;
				}
			}

			// Compile data.
			$.each(pub.members, (i, member) => {
				// gender.
				if (member.customFields.gender) {
					updateValue(pub.genders, member.customFields.gender);
				}
				else {
					pub.genders['Unknown']++;
				}

				// country.
				if (member.customFields.country) {
					updateValue(pub.countrys, member.customFields.country);
				}
				else {
					pub.countrys['Unknown']++;
				}

				// motives.
				if (member.customFields.motive) {
					$.each(member.customFields.motive.split('|'), (i, motive) => {
						updateValue(pub.motives, motive);
					});
				}
				else {
					pub.motives['Unknown']++;
				}

				// age.
				if (member.customFields['date-of-birth']) {
					let year = member.customFields['date-of-birth'].split('/')[2];
					if (year) {
						updateValue(pub.ages, year);
					}
				}
				else {
					pub.ages['Unknown']++;
				}

				// investors.
				if (member.customFields.investor) {
					updateValue(pub.investors, member.customFields.investor);
				}

				// joined.
				if (member.createdAt) {
					let date = new Date(member.createdAt);
					let year = date.getFullYear();
					let month = date.getMonth()+1;// returns 0-11, so add 1 to get 1-12.
					updateValue(pub.joined, `${year}-${month}`);
				}

				// plans.
				if (member.planConnections) {
					$.each(member.planConnections, (i, plan) => {
						if (plan.payment && plan.status == "ACTIVE") {
							updateValue(pub.plans, plan.planName);
						}
					});
				}

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
