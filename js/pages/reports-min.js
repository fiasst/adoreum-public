var REPORTS=function($,e,t,a){let o={members:[],current:0,total:0,genders:{},countrys:{Unknown:0},motives:{},ages:{Unknown:0},investors:{},joined:{},plans:{},getMemberData:e=>{let t=e?"&after="+e:"";MAIN.thinking(!0),HELP.sendAJAX({url:"https://hook.eu2.make.com/72hi83eco73yt3iipj5ua0dctpb5sl35?hasNextPage=true"+t,method:"GET",callbackSuccess:function(e){o.setCache(e),o.processData(e)},callbackError:function(e){MAIN.thinking(!1),console.log("error")}},!1)},processData:e=>{if(console.log(e),o.members=o.members.concat(e.data),o.current=o.members.length,o.total=e.data[0].totalCount,o.updateSummary(o.current,o.total),"true"===e.data[0].hasNextPage)o.getMemberData(e.data[0].endCursor);else{MAIN.thinking(!1);const e=(e,t)=>{e[t]?e[t]++:e[t]=1};$.each(o.members,((t,a)=>{if(a.customFields.gender&&e(o.genders,a.customFields.gender),a.customFields.country?e(o.countrys,a.customFields.country):o.countrys.Unknown++,a.customFields.motive?$.each(a.customFields.motive.split("|"),((t,a)=>{e(o.motives,a)})):o.motives.Unknown++,a.customFields["date-of-birth"]){let t=a.customFields["date-of-birth"].split("/")[2];t&&e(o.ages,t)}else o.ages.Unknown++;if(a.customFields.investor&&e(o.investors,a.customFields.investor),a.createdAt){let t=new Date(a.createdAt),s=t.getFullYear(),n=t.getMonth()+1;e(o.joined,`${s}-${n}`)}a.planConnections&&$.each(a.planConnections,((t,a)=>{a.payment&&"ACTIVE"==a.status&&e(o.plans,a.planName)}))})),console.log(o)}},checkCache:()=>{var e=localStorage.getItem("cachedData");e?(e=JSON.parse(e),((new Date).getTime()-e.timestamp)/36e5<1?(console.log("Use cache"),o.processData(e)):(console.log("Cache expired"),localStorage.removeItem("cachedData"),o.getMemberData())):(console.log("No cache found"),o.getMemberData())},setCache:e=>{var t={data:e.data,timestamp:(new Date).getTime()};localStorage.setItem("cachedData",JSON.stringify(t))},updateSummary:(e,t)=>{let a=$("#summary");$(".current",a).text(e),$(".total",a).text(t)}};return $((function(){o.checkCache()})),o}(jQuery,0,this.document);