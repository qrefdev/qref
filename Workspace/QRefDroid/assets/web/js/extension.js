// Underscore.js 1.3.3
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return 0!==a||1/a==1/c;if(null==a||null==c)return a===c;a._chain&&(a=a._wrapped);c._chain&&(c=c._wrapped);if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return!1;switch(e){case "[object String]":return a==""+c;case "[object Number]":return a!=+a?c!=+c:0==a?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if("object"!=typeof a||"object"!=typeof c)return!1;for(var f=d.length;f--;)if(d[f]==a)return!0;d.push(a);var f=0,g=!0;if("[object Array]"==e){if(f=a.length,g=f==c.length)for(;f--&&(g=f in a==f in c&&r(a[f],c[f],d)););}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return!1;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,h)&&!f--)break;
g=!f}}d.pop();return g}var s=this,I=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,J=k.unshift,l=p.toString,K=p.hasOwnProperty,y=k.forEach,z=k.map,A=k.reduce,B=k.reduceRight,C=k.filter,D=k.every,E=k.some,q=k.indexOf,F=k.lastIndexOf,p=Array.isArray,L=Object.keys,t=Function.prototype.bind,b=function(a){return new m(a)};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=b),exports._=b):s._=b;b.VERSION="1.3.3";var j=b.each=b.forEach=function(a,
c,d){if(a!=null)if(y&&a.forEach===y)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===o)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===o)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.map===z)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(A&&
a.reduce===A){e&&(c=b.bind(c,e));return f?a.reduce(c,d):a.reduce(c)}j(a,function(a,b,i){if(f)d=c.call(e,d,a,b,i);else{d=a;f=true}});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(B&&a.reduceRight===B){e&&(c=b.bind(c,e));return f?a.reduceRight(c,d):a.reduceRight(c)}var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,
c,b){var e;G(a,function(a,g,h){if(c.call(b,a,g,h)){e=a;return true}});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(C&&a.filter===C)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(D&&a.every===D)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,
a,g,h)))return o});return!!e};var G=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(E&&a.some===E)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;if(q&&a.indexOf===q)return a.indexOf(c)!=-1;return b=G(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=
function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a)&&a[0]===+a[0])return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&
(e={value:a,computed:b})});return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){d=Math.floor(Math.random()*(f+1));b[f]=b[d];b[d]=a});return b};b.sortBy=function(a,c,d){var e=b.isFunction(c)?c:function(a){return a[c]};return b.pluck(b.map(a,function(a,b,c){return{value:a,criteria:e.call(d,a,b,c)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c===void 0?1:d===void 0?-1:c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};
j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:b.isArray(a)||b.isArguments(a)?i.call(a):a.toArray&&b.isFunction(a.toArray)?a.toArray():b.values(a)};b.size=function(a){return b.isArray(a)?a.length:b.keys(a).length};b.first=b.head=b.take=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,
0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,
e=[];a.length<3&&(c=true);b.reduce(d,function(d,g,h){if(c?b.last(d)!==g||!d.length:!b.include(d,g)){d.push(g);e.push(a[h])}return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1),true);return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=
i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d){d=b.sortedIndex(a,c);return a[d]===c?d:-1}if(q&&a.indexOf===q)return a.indexOf(c);d=0;for(e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(F&&a.lastIndexOf===F)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){if(arguments.length<=
1){b=a||0;a=0}for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a=a+d}return g};var H=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));H.prototype=a.prototype;var b=new H,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=
i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(null,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i,j=b.debounce(function(){h=
g=false},c);return function(){d=this;e=arguments;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);j()},c));g?h=true:i=a.apply(d,e);j();g=true;return i}};b.debounce=function(a,b,d){var e;return function(){var f=this,g=arguments;d&&!e&&a.apply(f,g);clearTimeout(e);e=setTimeout(function(){e=null;d||a.apply(f,g)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));
return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=L||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&
c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.pick=function(a){var c={};j(b.flatten(i.call(arguments,1)),function(b){b in a&&(c[b]=a[b])});return c};b.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=
function(a){if(a==null)return true;if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};b.isArguments(arguments)||(b.isArguments=function(a){return!(!a||!b.has(a,"callee"))});b.isFunction=function(a){return l.call(a)=="[object Function]"};
b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isFinite=function(a){return b.isNumber(a)&&isFinite(a)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,
b){return K.call(a,b)};b.noConflict=function(){s._=I;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.result=function(a,c){if(a==null)return null;var d=a[c];return b.isFunction(d)?d.call(a):d};b.mixin=function(a){j(b.functions(a),function(c){M(c,b[c]=a[c])})};var N=0;b.uniqueId=
function(a){var b=N++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var u=/.^/,n={"\\":"\\","'":"'",r:"\r",n:"\n",t:"\t",u2028:"\u2028",u2029:"\u2029"},v;for(v in n)n[n[v]]=v;var O=/\\|'|\r|\n|\t|\u2028|\u2029/g,P=/\\(\\|'|r|n|t|u2028|u2029)/g,w=function(a){return a.replace(P,function(a,b){return n[b]})};b.template=function(a,c,d){d=b.defaults(d||{},b.templateSettings);a="__p+='"+a.replace(O,function(a){return"\\"+n[a]}).replace(d.escape||
u,function(a,b){return"'+\n_.escape("+w(b)+")+\n'"}).replace(d.interpolate||u,function(a,b){return"'+\n("+w(b)+")+\n'"}).replace(d.evaluate||u,function(a,b){return"';\n"+w(b)+"\n;__p+='"})+"';\n";d.variable||(a="with(obj||{}){\n"+a+"}\n");var a="var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+a+"return __p;\n",e=new Function(d.variable||"obj","_",a);if(c)return e(c,b);c=function(a){return e.call(this,a,b)};c.source="function("+(d.variable||"obj")+"){\n"+a+"}";return c};
b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var x=function(a,c){return c?b(a).chain():a},M=function(a,c){m.prototype[a]=function(){var a=i.call(arguments);J.call(a,this._wrapped);return x(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return x(d,
this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return x(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);

var sampleData = [
		{id: "test1", name: "CheckList 1", 
			preflight: [{index: 0, check:"check",response:"response"}, {index: 1, check:"check2",response:"response2"},
			{index: 2, check:"check3",response:"response3"}, {index: 3, check:"check4",response:"response4"},
			{index: 4, check:"check5",response:"response5"}, {index: 5, check:"check6",response:"response6"},
			{index: 6, check:"check7",response:"response7"}, {index: 7, check:"check8",response:"response8"}],
			takeoff: [{index: 0, check:"check2",response:"response2"}],
			landing: [{index: 0, check:"check3",response:"response3"}],
			emergencies: [{name: "condition1", items: [{index: 0, check:"emCheck1", response: "emResponse1"}]},
						{name: "condition2", items: [{index: 0, check:"emCheck2", response: "emResponse2"}]},
						{name: "condition3", items: [{index: 0, check:"emCheck3", response: "emResponse3"}]}]
		}, 
		{id: "test2", name: "CheckList 2", 
			preflight: [{index: 0, check:"check4",response:"response4"}],
			takeoff: [{index: 0, check:"check5",response:"response5"}],
			landing: [{index: 0, check:"check6",response:"response6"}],
			emergencies: [{name: "condition1", items: [{index: 0, check:"emCheck1", response: "emResponse1"}]}]
		
		}
];

var CheckLists = new CheckListHandler();
var Navigation = new NavigationHandler();
var Theme = new ThemeHandler();
var loader = undefined;

$(function() {
	$.android = /android/.test(navigator.userAgent.toLowerCase())

	loader = new Loader();
	Navigation.init();
	Theme.init();
	CheckLists.load(sampleData);
	
	
	var btnSignIn = $('#btnSignIn');
	btnSignIn.click(function (evt) {
		var loader = new Loader();
		loader.show();
		
		window.setTimeout(function() {
			loader.hide();
		}, 8000);
	});
	
	
});

$(document).bind("pagechange", function(event, data) {

	// We are being asked to load a page by URL, but we only
	// want to handle URLs that request the data for a specific
	// category.
	var u = $.mobile.path.parseUrl( event.currentTarget.URL ),
		emergency = "#emergency",
		emergencyChecklist = "#emergency-checklist",
		checklist = "#checklist";
		
	if(u.hash == emergencyChecklist)
	{
		Navigation.currentCheckListCategory = "emergencies";
		Navigation.populateEmergencyCheckList();
		//e.preventDefault();
	}
	else if ( u.hash == emergency ) 
	{
		Navigation.currentCheckListCategory = "emergencies";
		Navigation.populateEmergencyList();

		// Make sure to tell changePage() we've handled this call so it doesn't
		// have to do anything.
		//e.preventDefault();
	}
	else if(u.hash == checklist)
	{
		if(Navigation.currentCheckListCategory == "emergencies")
		{
			Navigation.currentCheckListCategory = Navigation.previousCheckListCategory;
		}
		
		Navigation.populateCheckList();
		//e.preventDefault();
	}
	
	Theme.refresh();
	Navigation.resetCheckListNavBar();
});

function NavigationHandler() {
	this.qref = undefined;
	this.currentArea = "home"
	this.currentCheckListCategory = "preflight";
	this.previousCheckListCategory = "preflight";
	this.currentEmergency = 0;
	this.previousAreas = new Array();
	this.scrollViews = undefined;
	
	var self = this;
	
	this.back = function() {
		if(this.previousAreas.length > 0)
		{
			this.currentArea = this.previousAreas.pop();
			$.mobile.changePage("#" + this.currentArea, {transition: "fade"});
		}
	};
	
	this.go = function(place) {
		this.previousAreas.push(this.currentArea);
		this.currentArea = place;
		$.mobile.changePage("#" + this.currentArea, {transition: "fade"});
	};
	
	this.autoGo = function(sender) {
		if(sender != null) {
			this.previousAreas.push(this.currentArea);
			this.currentArea = sender.attr("data-link");
			
			$.mobile.changePage("#" + this.currentArea, {transition: "fade"});
		};
	};
	
	/** Data Helpers for the Currently Selected QRef **/
	this.getCheckList = function() {
		var currentListItems = new Array();
		
		if(this.currentCheckListCategory == "preflight")
		{
			currentListItems = CheckLists.sort(this.qref.preflight);
		}
		else if(this.currentCheckListCategory == "takeoff")
		{
			currentListItems = CheckLists.sort(this.qref.takeoff);
		}
		else if(this.currentCheckListCategory == "landing")
		{
			currentListItems = CheckLists.sort(this.qref.landing);
		}
		else if(this.currentCheckListCategory == "emergencies")
		{
			currentListItems = CheckLists.sort(this.qref.emergencies[this.currentEmergency].items);
		}
		
		return currentListItems;
	}
	
	this.setCheckList = function(list) {
		if(this.currentCheckListCategory == "preflight")
		{
			this.qref.preflight = list;
		}
		else if(this.currentCheckListCategory == "takeoff")
		{
			this.qref.takeoff = list;
		}
		else if(this.currentCheckListCategory == "landing")
		{
			this.qref.landing = list;
		}
		else if(this.currentCheckListCategory == "emergencies")
		{
			this.qref.emergencies[this.currentEmergency].items = list;
		}
	};
	
	this.populateCheckList = function() {
		if(this.qref)
		{
			$("#checklist").page();
			if(this.currentCheckListCategory == "preflight")
			{
				var currentListItems = this.getCheckList();
			
				var html = "";
			
				for(var i = 0; i < currentListItems.length; i++)
				{
					html += "<li data-index='" + i + "' class='ui-li-static'><h3 class='ui-li-heading'>" + currentListItems[i].check + "</h3><p class='ui-list-desc'>" + currentListItems[i].response + "</p><div class='handle'></div></li>";
				}
				
				$("#checklist-items").html(html);
				$("#checklist-items").listview();
				$("#checklist-items").listview("refresh");
			}
			else if(this.currentCheckListCategory == "takeoff")
			{
				var currentListItems = this.getCheckList();
			
				var html = "";
			
				for(var i = 0; i < currentListItems.length; i++)
				{
					html += "<li data-index='" + i + "' class='ui-li-static'><h3 class='ui-li-heading'>" + currentListItems[i].check + "</h3><p class='ui-list-desc'>" + currentListItems[i].response + "</p><div class='handle'></div></li>";
				}
				
				$("#checklist-items").html(html);
				$("#checklist-items").listview();
				$("#checklist-items").listview("refresh");
			}
			else if(this.currentCheckListCategory == "landing")
			{
				var currentListItems = this.getCheckList();
			
				var html = "";
			
				for(var i = 0; i < currentListItems.length; i++)
				{
					html += "<li data-index='" + i + "' class='ui-li-static'><h3 class='ui-li-heading'>" + currentListItems[i].check + "</h3><p class='ui-list-desc'>" + currentListItems[i].response + "</p><div class='handle'></div></li>";
				}
				
				$("#checklist-items").html(html);
				$("#checklist-items").listview();
				$("#checklist-items").listview("refresh");
			}
			
			if($.android && this.scrollViews)
			{
				this.scrollViews.resetAll();
			}
			
			Theme.refresh();
		}
	};
	
	this.populateEmergencyList = function() {
		var row = 0;				
		var html = "";
		
		$("#emergency").page();
		
		for(var i = 0; i < this.qref.emergencies.length; i++)
		{
			if(row == 0)
			{
				html += '<div data-link="emergency-checklist" data-index="' + i + '" class="ui-block-a"><button class="ui-btn ui-btn-up-a">' + this.qref.emergencies[i].name + '</button></div>';
				row++;
			}
			else if(row == 1)
			{
				html += '<div data-link="emergency-checklist" data-index="' + i + '" class="ui-block-b"><button class="ui-btn ui-btn-up-a">' + this.qref.emergencies[i].name + '</button></div>';
				row--;
			}
		}
		
		$("#checklist-emergency").html(html);
		$("#checklist-emergency").children().tap(function() {
			self.changeEmergency($(this));
		});
		if($.android && this.scrollViews)
		{
			this.scrollViews.resetAll();
		}
		
		Theme.refresh();
	};
	
	this.populateEmergencyCheckList = function() {
		$("#emergency-checklist").page();
		
		if(this.currentEmergency >= this.qref.emergencies.length)
			this.currentEmergency = 0;
		
		var list = this.getCheckList();
		var html = "";
	
		for(var i = 0; i < list.length; i++)
		{
			html += "<li data-index='" + i + "' class='ui-li-static'><h3 class='ui-li-heading'>" + list[i].check + "</h3><p class='ui-list-desc'>" + list[i].response + "</p><div class='handle'></div></li>";
		}
		
		$("#checklist-emergency-items").html(html);
		$("#checklist-emergency-items").listview();
		$("#checklist-emergency-items").listview("refresh");
		
		if($.android && this.scrollViews)
		{
			this.scrollViews.resetAll();
		}
		
		Theme.refresh();
	};
	
	/** This changes the emergency checklist **/
	this.changeEmergency = function(sender) {
		if(sender != undefined)
		{
			this.currentEmergency = parseInt(sender.attr("data-index"));
			this.autoGo(sender);
		}
	};
	
	/** Changes the category on the checklist page **/
	this.changeCategory = function(sender) {
		if(sender != undefined)
		{		
			if(this.currentCheckListCategory != "emergencies")
			{
				this.previousCheckListCategory = this.currentCheckListCategory;
				
				if(sender.attr("data-category") != "emergencies")
				{
					this.currentCheckListCategory = sender.attr("data-category");
					this.populateCheckList();
				}
				else
				{
					this.currentCheckListCategory = sender.attr("data-category");
					this.go("emergency");
				}
				
			}
			else if(this.currentCheckListCategory == "emergencies")
			{
				if(sender.attr("data-category") != "emergencies")
				{
					this.currentCheckListCategory = sender.attr("data-category");
					this.go("checklist");
				}
				else
				{
					this.currentCheckListCategory = sender.attr("data-category");
					this.go("emergency");
				}
			}
		}
	};
	
	/** Navigates to the checklist page from available checklists **/
	this.checklist = function(sender) {
		if(sender != undefined)
		{
			this.qref = CheckLists.getList(sender.attr("data-link"));
			
			$(".headerText").html(sender.html());
			
			this.go("checklist");	
		}
	}
	
	/** Different from below as it determines it back on the current category! **/
	this.resetCheckListNavBar = function() {
		if(this.currentCheckListCategory == "preflight")
		{
			this.resetNavBar(0);
		}
		else if(this.currentCheckListCategory == "takeoff")
		{
			this.resetNavBar(1);
		}
		else if(this.currentCheckListCategory == "landing")
		{
			this.resetNavBar(2);
		}
		else if(this.currentCheckListCategory == "emergencies")
		{
			this.resetNavBar(3);
		}
	};
	
	/** Resets the nav checklist nav bar and re-adds the proper highlight **/
	this.resetNavBar = function(selected) {
		$(".checklistNavBar").each(function(i, e) {
				$(e).children().each(function(index, element) {
				var actualElement = $($(element).children()[0]);
				
				actualElement.removeClass('ui-btn-hover-c ui-btn-hover-f ui-btn-up-f ui-btn-hover-a ui-btn-hover-a ui-btn-hover-d ui-btn-active ui-btn-up-c ui-btn-up-d');
				
				if(index == selected)
				{
					if(Theme.current == "f")
					{
						actualElement.addClass('ui-btn-up-c');
					}
					else if(Theme.current == "a")
					{
						actualElement.addClass('ui-btn-up-d');
					}
				}
				else
				{
					actualElement.addClass('ui-btn-up-' + Theme.current);
				}
			});
		});
	};
	
	/** Initialized the Navigation Bar for the Checklist page **/
	/** Should not be called! It is automatically called as part of the init method **/
	this.initCheckListNavBar = function() {
		$(".checklistNavBar").each(function(i, e) {
			$(e).children().tap(function() {
				Navigation.changeCategory($(this));
				Navigation.resetNavBar(parseInt($(this).attr("data-index")));
			});
			$(e).children().mouseout(function() {
				Navigation.resetCheckListNavBar();
			});
		});
	};
	
	/** Initialized the Navigation Bar for the home page **/
	/** Should not be called! It is automatically called as part of the init method **/
	this.initHomeNavBar = function() {
		$("#home-nav").children().tap(function() {
				Navigation.autoGo($(this));
			});
	};
	
	this.init = function() {
		this.initHomeNavBar();
		this.initCheckListNavBar();
		/**$(".back").tap(function() {
			Navigation.back();
		});*/
		
		$("#checklist-emergency-items").sortable({
			handle: ".handle",
			scroll: true,
			axis: "y"	
		});
		$("#checklist-emergency-items").disableSelection();
		$("#checklist-emergency-items").bind("sortstop", function(event, ui) {
			$("checklist-emergency-items").listview('refresh');
			
			var currentCheckList = Navigation.getCheckList();
			Navigation.setCheckList(CheckLists.updateIndices(currentCheckList, CheckLists.getIndices()));
			
		});
		$( "#checklist-items" ).sortable({
			handle: ".handle",
			scroll: true,
			axis: "y"	
		});
		$( "#checklist-items" ).disableSelection();
		<!-- Refresh list to the end of sort to have a correct display -->
		$( "#checklist-items" ).bind( "sortstop", function(event, ui) {
			$('#checklist-items').listview('refresh');
		  
			var currentCheckList = Navigation.getCheckList();
			Navigation.setCheckList(CheckLists.updateIndices(currentCheckList, CheckLists.getIndices()));
		});
		
		//Init the scrolling for android devices
		if($.android)
		{
			this.scrollViews = new TouchSlideWindow($(".content"));
		}
	};
}

function CheckListHandler() {
	this.lists = new Array();
	
	this.load = function(jsonLists) {
		this.lists = jsonLists;
		
		var html = "";
		
		for(var i = 0; i < this.lists.length; i++)
		{
			html += "<li data-link='" + this.lists[i].id + "'>" + this.lists[i].name + "</li>"
		}
		
		$("#my-qrefs").html(html);
		$("#my-qrefs").listview();
		$("#my-qrefs").listview("refresh");
		
		$("#my-qrefs").children().tap(function() {
				Navigation.checklist($(this));
			});
	};
	
	this.getList = function(id) {
		var item = _.find(this.lists, function(i) {
			if(i.id == id)
				return true;
		});
		
		return item;
	};
	
	this.sort = function(list) {
		var sorted = list.sort(function(item,item2) {
			if(item.index < item2.index)
			{
				return -1;
			}
			else if(item.index == item2.index)
			{
				return 0;
			}
			else if(item.index > item2.index)
			{
				return 1;
			}
		});
		
		return sorted;
	};
	
	this.getIndices = function() {
		if(Navigation.currentCheckListCategory != "emergencies")
		{
			var indices = new Array();
			
			$("#checklist-items").children().each(function(index, e) {
				var element = $(e);
				var originalIndex = parseInt(element.attr("data-index"));
				
				indices[originalIndex] = index;
			});
			
			return indices;
		}
		else
		{
			return this.getEmergencyCheckListIndices();
		}
	};
	
	this.getEmergencyCheckListIndices = function() {
		var indices = new Array();
		
		$("#checklist-emergency-items").children().each(function(index, e) {
			var element = $(e);
			var originalIndex = parseInt(element.attr("data-index"));
			
			indices[originalIndex] = index;
		});
		
		return indices;
	};
	
	this.updateIndices = function(list, newOrder) {
		for(var i = 0; i < list.length; i++)
		{
			list[i].index = newOrder[list[i].index];
		}
		
		return list;
	};
}

function TouchSlideWindow(element, bottomCallback) {
	var self = this;
	this.element = element;
	this.elements = new Array();
	
	if(this.element.length > 1)
	{
		this.element.each(function(i, e) {
			var i = new TouchSlideWindow($(e));	
		
			self.elements.push(i);
		});
		
		return;
	}
	
	this.container = $(element.children()[0]);
	this.callback = bottomCallback;
	this.bottomReached = false;
	this.start = 0;
	
	
	
	
	
	this.reset = function() {
		self.container.css({top: "0px"});
	};
	
	this.resetAll = function() {
		var self = this;
		for(var i = 0; i < self.elements.length; i++)
		{
			self.elements[i].reset();
		}
	};
	
	this.scrollTo = function(top) {
		self.container.animate({top: -top + "px"}, 500);
	};
	
	this.element[0].addEventListener("touchstart", function(event) {
		if(event.touches.length > 0)
		{
			self.start = event.touches[0].pageY - self.element.offset().top;
		}
	}, false);
	
	this.element[0].addEventListener("touchmove", function(event) {
		event.preventDefault();
		var top = self.container.position().top;
		var windowHeight = self.element.height();
		var height = self.container.height();
		var offset = Math.abs(height - windowHeight);
		
		if(height > windowHeight)
		{
			if(event.touches.length > 0)
			{	
				var current = event.touches[0].pageY - self.element.offset().top;
				
				if(current < self.start)
				{
					var speed = (self.start - current);
					
					if(top >= -offset)
					{
						top -= speed;
						self.start = current;
						
						if(top <= -offset)
						{
							if(self.bottomReached == false)
							{
								if(self.callback)
									self.callback();
										
								self.bottomReached = true;
							}
							
							top = -offset;
						}
						
						self.container.css("top", top + "px");
					}
				}
				else if(current > self.start)
				{
					var speed = (current - self.start);
					
					if(top < 0)
					{
						top += speed;
						self.start = current;
						self.bottomReached = false;
						
						if(top >= 0)
						{
							top = 0;
						}
						
						self.container.css("top", top + "px");
					}
				}
			}
		}
	}, false);
	
	return self;
}


function ThemeHandler() {
	this.current = "f";
	var self = this;

	this.init = function() {
		$('.theme-changer').tap(function() {
			self.changeTheme();
			Navigation.resetCheckListNavBar();
		});
	};
	
	this.refresh = function() {
		var currentTheme = self.current;
		
		if(currentTheme == 'f')
		{
			$(".handle").removeClass("handle-white").addClass("handle-black");
			$(".ui-logo").removeClass("ui-logo-dark").addClass("ui-logo-light");
		}
		else if(currentTheme == 'a')
		{
			$(".handle").removeClass("handle-black").addClass("handle-white");
			$(".ui-logo").removeClass("ui-logo-light").addClass("ui-logo-dark");
		}
		
		//reset all the buttons widgets
		$('.ui-btn').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-up-f ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e ui-btn-hover-f')
						   .addClass('ui-btn-up-' + currentTheme)
						   .attr('data-theme', currentTheme);
						   
		$('.ui-li').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-up-f ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e ui-btn-hover-f')
						   .addClass('ui-btn-up-' + currentTheme)
						   .attr('data-theme', currentTheme);
	
		//reset the header/footer widgets
		$('.ui-header, .ui-footer')
						   .removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f')
						   .addClass('ui-bar-' + currentTheme)
						   .attr('data-theme', currentTheme);
	
		//reset the page widget
		$('.ui-page').removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e ui-body-f')
						   .addClass('ui-body-' + currentTheme)
						   .attr('data-theme', currentTheme);
						   
		
		//target the list divider elements, then iterate through them to check if they have a theme set, if a theme is set then do nothing, otherwise change its theme to `b` (this is the jQuery Mobile default for list-dividers)
		$('.ui-li-divider').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f')
					   .addClass('ui-bar-' + currentTheme)
					   .attr('data-theme', currentTheme);
	};
	
	this.changeTheme = function() {
		var currentTheme = self.current;
		var selectedTheme = "f";
		
		if(currentTheme == "f")
		{
			selectedTheme = "a";
			self.current = "a";
			$(".theme-changer span span").removeClass("ui-icon-moon").addClass("ui-icon-sun");
		}
		else if(currentTheme == "a")
		{
			selectedTheme = "f";
			self.current = "f";
			$(".theme-changer span span").removeClass("ui-icon-sun").addClass("ui-icon-moon");
		}
		
		if(selectedTheme == 'f')
		{
			$(".handle").removeClass("handle-white").addClass("handle-black");
			$(".ui-logo").removeClass("ui-logo-dark").addClass("ui-logo-light");
		}
		else if(selectedTheme == 'a')
		{
			$(".handle").removeClass("handle-black").addClass("handle-white");
			$(".ui-logo").removeClass("ui-logo-light").addClass("ui-logo-dark");
		}
		
		//reset all the buttons widgets
		$('.ui-btn').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-up-f ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e ui-btn-hover-f')
						   .addClass('ui-btn-up-' + selectedTheme)
						   .attr('data-theme', selectedTheme);
						   
		$('.ui-li').removeClass('ui-btn-up-a ui-btn-up-b ui-btn-up-c ui-btn-up-d ui-btn-up-e ui-btn-up-f ui-btn-hover-a ui-btn-hover-b ui-btn-hover-c ui-btn-hover-d ui-btn-hover-e ui-btn-hover-f')
						   .addClass('ui-btn-up-' + selectedTheme)
						   .attr('data-theme', selectedTheme);
	
		//reset the header/footer widgets
		$('.ui-header, .ui-footer')
						   .removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f')
						   .addClass('ui-bar-' + selectedTheme)
						   .attr('data-theme', selectedTheme);
	
		//reset the page widget
		$('.ui-page').removeClass('ui-body-a ui-body-b ui-body-c ui-body-d ui-body-e ui-body-f')
						   .addClass('ui-body-' + selectedTheme)
						   .attr('data-theme', selectedTheme);
						   
		
		//target the list divider elements, then iterate through them to check if they have a theme set, if a theme is set then do nothing, otherwise change its theme to `b` (this is the jQuery Mobile default for list-dividers)
		$('.ui-li-divider').removeClass('ui-bar-a ui-bar-b ui-bar-c ui-bar-d ui-bar-e ui-bar-f')
					   .addClass('ui-bar-' + selectedTheme)
					   .attr('data-theme', selectedTheme);
	};
}

function Loader() {
	this.element = $(".loader-backing");
	
	this.show = function() {
		this.element.fadeIn();
	}
	
	this.hide = function() {
		this.element.fadeOut();
	}
}

