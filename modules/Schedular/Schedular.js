/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/
window.addEventListener("load", function(){
	insertStylesheet("modules/Schedular/lib/css/fullcalendar.min.css");
	insertStylesheet("modules/Schedular/lib/css/scheduler.min.css");

	var scripts = [
		"modules/Schedular/lib/js/jquery.min.js",
		"modules/Schedular/lib/js/moment.min.js",
		"modules/Schedular/lib/js/fullcalendar.min.js",
		"modules/Schedular/lib/js/scheduler.min.js"
	];

	function require(scripts, i) {
		var i = i == undefined ? 0 : i;
		var script = document.createElement("script");
		script.src = scripts[i];
		if ( (i + 1) < scripts.length)
			script.addEventListener("load", function(){
				require(scripts, i+1);
			});
		else {
			launchSchedular();
		}
		document.head.appendChild(script);
	}

	require(scripts);

	function insertStylesheet(href) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}

	function launchSchedular() {
		var int = setInterval(function(){
			if (typeof jQuery == "function" && typeof jQuery().fullCalendar == "function" && typeof moment == "function") {
				$('#schedular').fullCalendar({
					defaultView: 'agendaDay',
					defaultDate: new Date(),
					editable: true,
					selectable: true,
					eventLimit: true, // allow "more" link when too many events
					header: {
						left: 'prev,next today',
						center: 'title',
						right: 'agendaDay,agendaTwoDay,agendaWeek,month'
					},
					views: {
						agendaTwoDay: {
							type: 'agenda',
							duration: { days: 2 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						}
					},

					//// uncomment this line to hide the all-day slot
					//allDaySlot: false,

					resources: getResources(),
					events: [
						{ id: '1', resourceId: '1', start: '2017-05-27', end: '2017-05-08', title: 'event 1', backgroundColor : 'black'},
						{ id: '2', resourceId: '1', start: '2017-05-27T09:00:00', end: '2017-05-07T14:00:00', title: 'event 2' },
						{ id: '3', resourceId: 'b', start: '2017-05-07T12:00:00', end: '2017-05-08T06:00:00', title: 'event 3' },
						{ id: '4', resourceId: 'c', start: '2017-05-07T07:30:00', end: '2017-05-07T09:30:00', title: 'event 4' },
						{ id: '5', resourceId: 'd', start: '2017-05-07T10:00:00', end: '2017-05-07T15:00:00', title: 'event 5' }
					],

					select: function(start, end, jsEvent, view, resource) {
						console.log(
							'select',
							start.format(),
							end.format(),
							resource ? resource.id : '(no resource)'
						);
					},
					dayClick: function(date, jsEvent, view, resource) {
						console.log(
							'dayClick',
							date.format(),
							resource ? resource.id : '(no resource)'
						);
					}
				});
				clearInterval(int);
			}
		}, 400);
	}

	function getResources() {
		var resources = document.getElementsByClassName("resource");
		var ret = [];
		for (var i = 0; i < resources.length; i++) {
			var r = {};
			r.id = resources[i].getElementsByClassName("resource__id")[0].innerText;
			r.title = resources[i].getElementsByClassName("resource__name")[0].innerText;
			ret.push(r);
		}
		console.log(ret);
		return ret;
	}

});