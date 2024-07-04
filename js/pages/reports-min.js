Object.defineProperty(String.prototype,"capFirst",{value:function(){return this.charAt(0).toUpperCase()+this.slice(1)},enumerable:!1});var REPORTS=function($,e,t,a){let s={charts:[],members:[],current:0,total:0,genders:{},countries:{},motives:{},ageRanges:{},investors:{},joined:{},plans:{},subscriberStatus:[],getMemberData:e=>{let t=e?"&after="+e:"";MAIN.thinking(!0),HELP.sendAJAX({url:"https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true"+t,method:"GET",callbackSuccess:function(e){s.processData(e)},callbackError:function(e){MAIN.thinking(!1),console.log("error")}},!1)},processData:(e,t)=>{if(console.log(e),s.members=s.members.concat(e.data),s.current=s.members.length,s.total=e.data[0].totalCount,s.updateSummary(s.current,s.total),"true"!==e.data[0].hasNextPage||t){MAIN.thinking(!1),s.setCache({data:s.members});const e=(e,t)=>{e[t]?e[t]++:e[t]=1};$.each(s.members,((t,a)=>{if(a.customFields.gender&&e(s.genders,a.customFields.gender),a.customFields.country?e(s.countries,a.customFields.country):e(s.countries,"Unknown"),a.customFields.motive?$.each(a.customFields.motive.split("|"),((t,a)=>{e(s.motives,a)})):e(s.motives,"Unknown"),a.customFields["date-of-birth"]){let t=a.customFields["date-of-birth"].split("/")[2],o=(new Date).getFullYear();if(t){const a=o-parseInt(t.trim());let n;a>=16&&a<=25?n="16-25":a>=26&&a<=35?n="26-35":a>=36&&a<=45?n="36-45":a>=46&&a<=55?n="46-55":a>=56&&a<=65?n="56-65":a>=66&&a<=75?n="66-75":a>=76&&a<=85?n="76-85":a>=86&&a<=95?n="86-95":a>=96&&a<=105&&(n="96-105"),e(s.ageRanges,n)}}else e(s.ageRanges,"Unknown");if(a.customFields.investor&&e(s.investors,a.customFields.investor.capFirst()),a.createdAt){let t=new Date(a.createdAt),o=t.getFullYear(),n=t.getMonth()+1;n<10&&(n="0"+n),e(s.joined,`${o}-${n}`)}if(a.planConnections){let t,o=[];$.each(a.planConnections,((t,n)=>{if("SUBSCRIPTION"==n.type)switch(n.status){case"ACTIVE":o.push("active"),e(s.plans,n.planName);break;case"CANCELED":o.push("canceled");break;case"TRIALING":o.push("trialing"),console.log(a);break;case"PAST_DUE":o.push("past_due");break;case"UNPAID":o.push("unpaid")}})),o.includes("active")?t="Active":o.includes("past_due")?t="Past due":o.includes("unpaid")?t="Unpaid":o.includes("canceled")?t="Canceled":o.includes("trialing")?t="Trialing":o.length<1&&(t="Never subscribed"),e(s.subscriberStatus,t)}})),HELP.sortObjectByKeys(REPORTS.genders),HELP.sortObjectByKeys(REPORTS.countries),HELP.sortObjectByKeys(REPORTS.motives),HELP.sortObjectByKeys(REPORTS.ageRanges),HELP.sortObjectByKeys(REPORTS.genders),console.log(s),s.generateCharts()}else s.getMemberData(e.data[0].endCursor)},checkCache:()=>{var e=localStorage.getItem("cachedData");e?(e=JSON.parse(e),((new Date).getTime()-e.timestamp)/36e5<1?(console.log("Use cache"),s.processData(e,!0)):(console.log("Cache expired"),localStorage.removeItem("cachedData"),s.getMemberData())):(console.log("No cache found"),s.getMemberData())},setCache:e=>{var t={data:e.data,timestamp:(new Date).getTime()};localStorage.setItem("cachedData",JSON.stringify(t))},updateSummary:(e,t)=>{let a=$("#summary");$(".current",a).text(e),$(".total",a).text(t)},createChart:(e,a)=>{const o=t.getElementById(e).getContext("2d");s.charts[e.toLowerCase()]=new Chart(o,a)},generateCharts:()=>{s.createChart("genderChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.genders),datasets:[{data:Object.values(REPORTS.genders),backgroundColor:["#5A99F0","#DA5D6E","#7DC9CC"]}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("countriesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.countries),datasets:[{data:Object.values(REPORTS.countries)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("motivesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.motives),datasets:[{data:Object.values(REPORTS.motives)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("agesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.ageRanges),datasets:[{data:Object.values(REPORTS.ageRanges)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("investorsChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.investors),datasets:[{data:Object.values(REPORTS.investors),backgroundColor:["#DD7586","#7FBBBE"]}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("plansChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.plans),datasets:[{data:Object.values(REPORTS.plans)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("subStatusChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.subscriberStatus),datasets:[{data:Object.values(REPORTS.subscriberStatus)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("joinedChart",{type:"line",data:{labels:Object.keys(REPORTS.joined),datasets:[{data:Object.values(REPORTS.joined),fill:!1,tension:.1}]},options:{responsive:!0,scales:{x:{beginAtZero:!0},y:{beginAtZero:!0}},plugins:{legend:{display:!1},tooltip:{enabled:!0}}}})}};return $((function(){s.checkCache()})),s}(jQuery,0,this.document);