// Uppercase the first character of a String.
// usage: "hello, world!".capFirst();
Object.defineProperty(String.prototype, 'capFirst', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});


var REPORTS = (function($, window, document, undefined) {
    let pub = {};

    pub.charts = [];
    pub.members = [];
	pub.current = 0;
	pub.total = 0;

	// reports data.
	pub.genders = {};
	pub.countries = {};
	pub.primarycity = {};
	pub.motives = {};
	pub.ageRanges = {};
	pub.investors = {};
	pub.joined = {};
	pub.referrer = {};
	pub.plans = {};
    pub.subscriberStatus = [];


    // Get all members for reports dashboard.
    pub.getMemberData = (after) => {
    	// Get current Member.
        USER.getCurrentMember(function(member) {
            if (HELP.checkKeyExists(member, 'id')) {
    			let endCursor = after ? '&after='+after : '';

		        // Load data
				HELP.sendAJAX({
		            url: 'https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true&id='+member.id+endCursor,
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
		});
	}


	// Callback function to process all members data.
	pub.processData = (response, useCache) => {
		// set/update vars.
		pub.members = pub.members.concat(response.data);
		pub.current = pub.members.length;
		pub.total = response.data[0].totalCount;

		// update summary.
		pub.updateSummary(pub.current, pub.total);

		// Load next round of data.
		if (response.data[0].hasNextPage === "true" && !useCache) {
        	pub.getMemberData(response.data[0].endCursor);
        	return
		}

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

		// create Members live table view.
		liveTable(pub.members);

		// Compile Overview.
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
				updateValue(pub.countries, 'Unknown');
			}

			// primary city.
			if (member.customFields.primarycity) {
				updateValue(pub.primarycity, member.customFields.primarycity);
			}
			else {
				updateValue(pub.primarycity, 'Unknown');
			}


			// motives.
			if (member.customFields.motive) {
				$.each(member.customFields.motive.split('|'), (i, motive) => {
					updateValue(pub.motives, motive);
				});
			}
			else {
				updateValue(pub.motives, 'Unknown');
			}

			// age.
			if (member.customFields['date-of-birth']) {
				let year = member.customFields['date-of-birth'].split('/')[2],
					currentYear = new Date().getFullYear(),
					range = 'Unknown';

				if (!!year) {
		            const age = currentYear - parseInt(year.trim());
		            
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
				}
				updateValue(pub.ageRanges, range);
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
				if (month < 10) month = "0"+month;
				updateValue(pub.joined, `${year}-${month}`);
			}

			// referrer.
			if (member.customFields.referrer) {
				updateValue(pub.referrer, member.customFields.referrer);
			}
			else {
				updateValue(pub.referrer, 'Unknown');
			}

			// plans.
			if (member.planConnections) {
				let subStatus = [],
					status;

				$.each(member.planConnections, (i, plan) => {
					if (plan.type == "SUBSCRIPTION") {
						switch (plan.status) {
							case "ACTIVE":
								subStatus.push('active');
								// Build active plans data
								updateValue(pub.plans, plan.planName);
								break;
							case "CANCELED":
								subStatus.push('canceled');
								break;
							case "TRIALING":
								subStatus.push('trialing');
								break;
							case "PAST_DUE":
								subStatus.push('past_due');
								break;
							case "UNPAID":
								subStatus.push('unpaid');
						}
					}
				});

				// Build subscription status data.
				if (subStatus.includes('active')) {
					status = 'Active';
				}
				else if (subStatus.includes('past_due')) {
					status = 'Past due';
				}
				else if (subStatus.includes('unpaid')) {
					status = 'Unpaid';
				}
				else if (subStatus.includes('canceled')) {
					status = 'Canceled';
				}
				else if (subStatus.includes('trialing')) {
					status = 'Trialing';
				}
				else if (subStatus.length < 1) {
					status = 'Never subscribed';
				}
				updateValue(pub.subscriberStatus, status);
			}
				
		});

		// Sort data by Object Key values.
		REPORTS.countries = HELP.sortObjectByKeys(REPORTS.countries);
		REPORTS.motives = HELP.sortObjectByKeys(REPORTS.motives);
		REPORTS.ageRanges = HELP.sortObjectByKeys(REPORTS.ageRanges);
		REPORTS.genders = HELP.sortObjectByKeys(REPORTS.genders);

		pub.generateCharts();
	}


	// Function to check for cached reports data less than X hours old.
    pub.checkCache = () => {
        // Retrieve the cached object from localStorage
        var cachedData = localStorage.getItem('cachedData'),
        	cacheExpiryHours = 1;
        
        // Show thinking icon
		MAIN.thinking(true);

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
		            data: Object.values(REPORTS.genders)
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

	    // Create Primary City chart
	    pub.createChart('primaryCityChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.primarycity),
		        datasets: [{
		            data: Object.values(REPORTS.primarycity)
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
		            data: Object.values(REPORTS.investors),
		        	backgroundColor: [
		        		'#D24A4B',
	            		'#7DC9CC'
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


	    // Create subscriberStatus chart
	    pub.createChart('subStatusChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.subscriberStatus),
		        datasets: [{
		            data: Object.values(REPORTS.subscriberStatus)
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

	    // Create Referrer chart
	    pub.createChart('referrerChart', {
	        type: 'doughnut',
	        data: {
		        labels: Object.keys(REPORTS.referrer),
		        datasets: [{
		            data: Object.values(REPORTS.referrer)
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
	}


	let tableMembers;

	function liveTable(members) {
		// Process the data and add rows dynamically
		let allRows = [];
        members.forEach(function(member) {
			let motives = member.customFields.motive ? member.customFields.motive.split('|').join(', ') : '';

			let data = [
				`<a href="https://app.memberstack.com/apps/app_cllao1xky00gp0t4gd37g6u4b/members/${member.id}/profile" target="_blank">${member.customFields.name}</a>`,
				member.customFields.company || '',
				member.customFields.gender || '',
				member.customFields.address || '',
				member.customFields.county || '',
				member.customFields.postcode || '',
				member.customFields.country || '',
				member.customFields.mobile || '',
				member.customFields.email || '',
				member.customFields.primarycity || '',
				member.customFields['date-of-birth'] || '',
				motives,
				member.customFields.investor || '',
				member.customFields.canaccessapp || '',
				HELP.formatTimestamp(member.createdAt)
			];

			if (member.planConnections.length === 0) {
				allRows.push(data.concat(['', '', '', '', '']));
			} else {
				let plansPaid = member.planConnections.filter(p => p.type === 'SUBSCRIPTION');
				let activePlans = plansPaid.filter(p => p.active);
				let displayPlans = activePlans.length > 0
					? activePlans
					: plansPaid.filter(p => p.payment && Object.keys(p.payment).length > 0);

				let planNames = displayPlans.map(p => p.planName || 'N/A').join(', ');
				let planStatuses = displayPlans.map(p => p.status || 'N/A').join(', ');
				let paymentAmounts = displayPlans.map(p => {
					if (p.payment && p.payment.amount) {
						let sum = HELP.formatThousands(p.payment.amount);
						return p.payment.currency === 'gbp' ? '£' + sum : sum + ' ' + p.payment.currency;
					}
					return '';
				}).join(', ');
				let paymentStatuses = displayPlans.map(p => (p.payment ? p.payment.status || 'N/A' : 'N/A')).join(', ');
				let billingDates = displayPlans.map(p => {
					if (p.payment && p.payment.nextBillingDate) {
						let ts = HELP.ISOToTimestamp(p.payment.nextBillingDate);
						return HELP.formatTimestamp(ts, false, true);
					}
					return '';
				}).join(', ');

				allRows.push(data.concat([planNames, planStatuses, paymentAmounts, paymentStatuses, billingDates]));
			}
		});


		// Create the table with data.
		tableMembers = $('#members-table').DataTable({
			data: allRows,
			columns: [
				{ title: "Member" }, { title: "Company" }, { title: "Gender" }, 
				{ title: "Address" }, { title: "County" }, { title: "Postcode" },
				{ title: "Country" }, { title: "Mobile" }, { title: "Email" }, { title: "Primary City" },
				{ title: "DOB" }, { title: "Motives" }, { title: "Investor" }, 
				{ title: "App Access" }, { title: "Joined" }, 
				{ title: "Plan Name" }, { title: "Plan Status" }, 
				{ title: "Payment Amount" }, { title: "Payment Status" },
				{ title: "Next Billing Date" }
			],
			lengthMenu: [
				[50, 100, -1],
				[50, 100, 'All']
			],
			pageLength: 50,
			order: [[12, 'asc'], [13, 'asc']],
			search: { return: true }
		});


        // Create Columns dropdown filter
		var $dropdown = $('<div id="column-list" class="dropdown"><div class="label">Columns</div><ul></ul></div>');
	    // Populate dropdown
	    $('#members-table thead th').each(function(index) {
	        var columnTitle = $(this).text(),// Get the text of the <th>
	        	$item = $('<li><label><input type="checkbox" checked>'+ columnTitle +'</label></li>');

	        // Append the checkbox to the container
	        $('ul', $dropdown).append($item);

	        // Attach a change event to show/hide the corresponding column
	        $('input', $item).on('change', function() {
	            tableMembers.column(index).visible( $(this).is(':checked') );// Show/hide column
	        });
	    });
	    // Move filters to .head element
	    $('#members-live-wrapper .head').append([$dropdown, $('#members-live-wrapper .dt-layout-row:first-child')]);


	    // Create download button
        var $downloadBtn = $('<button id="download-csv" class="button-secondary xsmall">Download</button>');
        $('#members-live-wrapper .head').append($downloadBtn);
        
        // Download functionality
        $downloadBtn.on('click', function () {
			let csvContent = "";

			// Pull all filtered data
			const allData = tableMembers.rows({ search: 'applied' }).data().toArray();

			// Get visible column indexes (in correct display order)
			const visibleIndexes = tableMembers.columns(':visible').indexes().toArray();

			// Get headers
			let headers = visibleIndexes.map(index => {
				return $(tableMembers.column(index).header()).text().trim();
			});

			// Add "Member URL" column if needed
			const memberColTitleIndex = headers.indexOf("Member");
			if (memberColTitleIndex !== -1) {
				headers.splice(memberColTitleIndex + 1, 0, "Member URL");
			}
			csvContent += headers.join(",") + "\n";

			// Loop over data rows
			allData.forEach((row) => {
				let csvRow = [];

				visibleIndexes.forEach((columnIndex, i) => {
					let cell = row[columnIndex];
					let content = cell ? cell.toString().trim() : "";

					// Special handling for "Member" link column
					if (i === memberColTitleIndex && content.includes('<a')) {
						let $cell = $('<div>').html(content);
						let text = $cell.find('a').text().trim();
						let link = $cell.find('a').attr('href') || '';
						csvRow.push(`"${text.replace(/"/g, '""')}"`);
						csvRow.push(`"${link}"`);
					} else {
						content = content.replace(/<[^>]*>/g, '').trim();
						csvRow.push(`"${content.replace(/"/g, '""')}"`);
					}
				});

				// Only add row if at least 1 field has content (guard against bad data)
				if (csvRow.some(cell => cell !== '""')) {
					csvContent += csvRow.join(",") + "\n";
				}
			});

			// Trigger CSV download using Blob
			let date = new Date().toISOString().split('T')[0];
			let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			let link = document.createElement("a");

			if (navigator.msSaveBlob) {
				// For IE11
				navigator.msSaveBlob(blob, `members-${date}.csv`);
			} else {
				let url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", `members-${date}.csv`);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
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

