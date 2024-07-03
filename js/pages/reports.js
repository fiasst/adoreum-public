var REPORTS = (function($, window, document, undefined) {
    let pub = {};

    pub.charts = [];
    pub.members = [];
	pub.current = 0;
	pub.total = 0;

	// reports data.
	pub.genders = {};
	pub.countries = {};
	pub.motives = {};
	pub.ageRanges = {};
	pub.investors = {};
	pub.joined = {};
	pub.plans = {};


    // Get all members for reports dashboard.
    pub.getMemberData = (after) => {
    	let endCursor = after ? '&after='+after : '';
	    	
	    // Show thinking icon
        MAIN.thinking(true);
        // Load data
		HELP.sendAJAX({
            url: 'https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true'+endCursor,
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
	pub.processData = (response, useCache) => {
		console.log(response);

		// set/update vars.
		pub.members = pub.members.concat(response.data);
		pub.current = pub.members.length;
		pub.total = response.data[0].totalCount;

		// update summary.
		pub.updateSummary(pub.current, pub.total);

		// Load next round of data.
		if (response.data[0].hasNextPage === "true" && !useCache) {
        	pub.getMemberData(response.data[0].endCursor);
		}
		else {
			MAIN.thinking(false);
			
			// update cache
			pub.setCache({data: pub.members});

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

				// country.
				if (member.customFields.country) {
					updateValue(pub.countries, member.customFields.country);
				}
				else {
					// pub.countries['Unknown']++;
					updateValue(pub.countries, 'Unknown');

				}

				// motives.
				if (member.customFields.motive) {
					$.each(member.customFields.motive.split('|'), (i, motive) => {
						updateValue(pub.motives, motive);
					});
				}
				else {
					// pub.motives['Unknown']++;
					updateValue(pub.motives, 'Unknown');
				}

				// age.
				if (member.customFields['date-of-birth']) {
					let year = member.customFields['date-of-birth'].split('/')[2],
						currentYear = new Date().getFullYear();

					if (year) {
						// updateValue(pub.ages, currentYear - parseInt(year.trim()));

			            const age = currentYear - parseInt(year.trim());
			            let range;

			            if (age >= 16 && age <= 25) {
			            	range = "16-25";
			            }
			            else if (age >= 26 && age <= 35) {
			            	range = "26-35";
			            }
			            else if (age >= 36 && age <= 45) {
			            	range = "36-45";
			            }
			            else if (age >= 46 && age <= 55) {
			            	range = "46-55";
			            }
			            else if (age >= 56 && age <= 65) {
			            	range = "56-65";
			            }
			            else if (age >= 66 && age <= 75) {
			            	range = "66-75";
			            }
			            else if (age >= 76 && age <= 85) {
			            	range = "76-85";
			            }
			            else if (age >= 86 && age <= 95) {
			            	range = "86-95";
			            }
			            else if (age >= 96 && age <= 105) {
			            	range = "96-105";
			            }
				        updateValue(pub.ageRanges, range);
					}
				}
				else {
					// pub.ages['Unknown']++;
					updateValue(pub.ageRanges, 'Unknown');
				}

				// investors.
				if (member.customFields.investor) {
					updateValue(pub.investors, member.customFields.investor.capFirst());
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

				// TODO:
					// Store pub.members in localstorage and check if it's within 2 hours cache.
					// Create charts using chatGPT...
						// Object.keys(REPORTS.genders)
						// Object.values(REPORTS.genders)
					// Create dropdown list of countries in Register form...
						// Make sure it autofills with Memberstack saved data in the edit profile form.
			});

			console.log(pub);
			pub.generateCharts();
		}
	}


	// Function to check for cached reports data less than X hours old.
    pub.checkCache = () => {
        // Retrieve the cached object from localStorage
        var cachedData = localStorage.getItem('cachedData'),
        	cacheExpiryHours = 1;

        if (cachedData) {
            // Parse the cached object
            cachedData = JSON.parse(cachedData);
            // Get the current time and cached time
            var currentTime = new Date().getTime(),
            	cachedTime = cachedData.timestamp,

            	// Calculate the time difference in hours
            	timeDifference = (currentTime - cachedTime) / (1000*60*60);

            if (timeDifference < cacheExpiryHours) {
                console.log('Use cache');
                // Cached data is less than X hours old
                pub.processData(cachedData, true);
            }
            else {
            	console.log('Cache expired');
                // Cached data is older than X hours, delete it
                localStorage.removeItem('cachedData');
                // Get fresh data
        		pub.getMemberData();
            }
        }
        else {
        	console.log('No cache found');
            // No cached data found
        	pub.getMemberData();
        }
    }


    pub.setCache = (data) => {
	    var cachedData = {
	        data: data.data,
	        timestamp: new Date().getTime()
	    };
	    localStorage.setItem('cachedData', JSON.stringify(cachedData));
	}


	pub.updateSummary = (current, total) => {
		let $summary = $('#summary');
		$('.current', $summary).text(current);
		$('.total', $summary).text(total);
	}


	// Create a Doughnut style chart
	pub.createChart = (id, params) => {
		const ctx = document.getElementById(id).getContext('2d');
	    pub.charts[id.toLowerCase()] = new Chart(ctx, params);
	}


	// Generate all charts
	pub.generateCharts = () => {
		// Create Genders chart
		pub.createChart('genderChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.genders),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.genders),
		            backgroundColor: [
			            '#679FDF',
			            '#DD7586',
			            '#7FBBBE'
			        ]
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

		// Create Countries chart
		pub.createChart('countriesChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.countries),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.countries)
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

		// Create Motives chart
		pub.createChart('motivesChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.motives),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.motives)
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

		// Create Ages chart
		pub.createChart('agesChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.ageRanges),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.ageRanges)
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

		// Create Investors chart
		pub.createChart('investorsChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.investors),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.investors),
		        	backgroundColor: [
		        		'#DD7586',
	            		'#7FBBBE'
		        	]
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

		// Create Plans chart
		pub.createChart('plansChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.plans),
		        datasets: [{
		            //label: 'Count',
		            data: Object.values(REPORTS.plans)
		        }]
		    },
	        options: {
	            responsive: true,
	            plugins: {
	                legend: {
	                    position: 'top'
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });

	    // Create Joined chart
	    pub.createChart('joinedChart', {
	        type: 'line',
	        data: {
		        labels: Object.keys(REPORTS.joined),
		        datasets: [{
		            data: Object.values(REPORTS.joined),
		            fill: false,
		            tension: 0.1
		        }]
		    },
	        options: {
	            responsive: true,
	            scales: {
	                x: {
	                    beginAtZero: true
	                },
	                y: {
	                    beginAtZero: true
	                }
	            },
	            plugins: {
	                legend: {
	                    display: false
	                },
	                tooltip: {
	                    enabled: true
	                }
	            }
	        }
	    });
	}


	//
    // On DOM ready.
    //
    $(function() {
        // Run the cache check function
    	pub.checkCache();
	});

	return pub;
}(jQuery, this, this.document));
