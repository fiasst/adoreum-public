var REPORTS=function($,e,t,a){let s={charts:[],members:[],current:0,total:0,genders:{},countries:{},motives:{},ages:{},investors:{},joined:{},plans:{},getMemberData:e=>{let t=e?"&after="+e:"";MAIN.thinking(!0),HELP.sendAJAX({url:"https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true"+t,method:"GET",callbackSuccess:function(e){s.processData(e)},callbackError:function(e){MAIN.thinking(!1),console.log("error")}},!1)},processData:(e,t)=>{if(console.log(e),s.members=s.members.concat(e.data),s.current=s.members.length,s.total=e.data[0].totalCount,s.updateSummary(s.current,s.total),"true"!==e.data[0].hasNextPage||t){MAIN.thinking(!1),s.setCache({data:s.members});const e=(e,t)=>{e[t]?e[t]++:e[t]=1};$.each(s.members,((t,a)=>{if(a.customFields.gender&&e(s.genders,a.customFields.gender),a.customFields.country?e(s.countries,a.customFields.country):e(s.countries,"Unknown"),a.customFields.motive?$.each(a.customFields.motive.split("|"),((t,a)=>{e(s.motives,a)})):e(s.motives,"Unknown"),a.customFields["date-of-birth"]){let t=a.customFields["date-of-birth"].split("/")[2],o=(new Date).getFullYear();t&&e(s.ages,o-parseInt(t.trim()))}else e(s.ages,"Unknown");if(a.customFields.investor&&e(s.investors,a.customFields.investor.capFirst()),a.createdAt){let t=new Date(a.createdAt),o=t.getFullYear(),n=t.getMonth()+1;e(s.joined,`${o}-${n}`)}a.planConnections&&$.each(a.planConnections,((t,a)=>{a.payment&&"ACTIVE"==a.status&&e(s.plans,a.planName)}))})),console.log(s),s.generateCharts()}else s.getMemberData(e.data[0].endCursor)},checkCache:()=>{var e=localStorage.getItem("cachedData");e?(e=JSON.parse(e),((new Date).getTime()-e.timestamp)/36e5<1?(console.log("Use cache"),s.processData(e,!0)):(console.log("Cache expired"),localStorage.removeItem("cachedData"),s.getMemberData())):(console.log("No cache found"),s.getMemberData())},setCache:e=>{var t={data:e.data,timestamp:(new Date).getTime()};localStorage.setItem("cachedData",JSON.stringify(t))},updateSummary:(e,t)=>{let a=$("#summary");$(".current",a).text(e),$(".total",a).text(t)},createChart:(e,a)=>{const o=t.getElementById(e).getContext("2d");s.charts[e.toLowerCase()]=new Chart(o,a)},generateCharts:()=>{s.createChart("genderChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.genders),datasets:[{data:Object.values(REPORTS.genders),backgroundColor:["#DD7586","#679FDF","#7FBBBE"]}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("countriesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.countries),datasets:[{data:Object.values(REPORTS.countries)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("motivesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.motives),datasets:[{data:Object.values(REPORTS.motives)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("agesChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.ages),datasets:[{data:Object.values(REPORTS.ages)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("investorsChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.investors),datasets:[{data:Object.values(REPORTS.investors),backgroundColor:["#DD7586","#7FBBBE"]}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("plansChart",{type:"doughnut",data:{labels:Object.keys(REPORTS.plans),datasets:[{data:Object.values(REPORTS.plans)}]},options:{responsive:!0,plugins:{legend:{position:"top"},tooltip:{enabled:!0}}}}),s.createChart("joinedChart",{type:"line",data:{labels:Object.keys(REPORTS.joined),datasets:[{data:Object.values(REPORTS.joined),borderWidth:1,fill:!1,tension:.1}]},options:{responsive:!0,scales:{x:{beginAtZero:!0},y:{beginAtZero:!0}},plugins:{legend:{display:!0,position:"top"},tooltip:{enabled:!0}}}})}};return $((function(){s.checkCache()})),s}(jQuery,0,this.document);