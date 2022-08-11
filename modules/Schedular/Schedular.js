/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/
var showWeekends = false;
GlobalVariable_getVariable('Schedular_Show_Weekends', 0, '', gVTUserID).then(function (response) {
	var obj = JSON.parse(response);
	console.log(obj);
	showWeekends = obj.Schedular_Show_Weekends == '1' ? true : false;
}, function (error) {
	showWeekends = false; // no weekends (default)
});

window.addEventListener("load", function(){
	insertStylesheet("modules/Schedular/lib/css/fullcalendar.min.css");
	insertStylesheet("modules/Schedular/lib/css/scheduler.min.css");
	insertStylesheet("modules/Schedular/lib/css/Schedular.css?v=0.7.5");

	var scripts = [
		"modules/Schedular/lib/js/jquery.min.js",
		"modules/Schedular/lib/js/moment.min.js",
		"modules/Schedular/lib/js/fullcalendar.min.js",
		"modules/Schedular/lib/js/scheduler.min.js",
		"modules/Schedular/lib/js/interact.min.js",
		"modules/Schedular/lib/js/fullcalendar-locale/nl.js"
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
					schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
					resourceAreaWidth: '15%',
					resourceLabelText: document.getElementById("resource-label").value,
					defaultView: getUserPreferredView(),
					defaultDate: new Date(),
					editable: true,
					selectable: true,
					eventLimit: true, // allow "more" link when too many events
					firstDay: 1,
					columnFormat: "ddd D-M",
					locale: 'nl',
					customButtons: {
						legend: {
							text: document.getElementById("legend-label").value,
							click: function() {
								document.getElementById("schedular-eventtypes-legends").classList.toggle("active");
							}
						},
						onlyMine: {
							text: document.getElementById("only-mine-label").value,
							click: function() {
								saveUserPrefs({
									"show" : "onlyMine"
								});
								setTimeout(function(){
									$('#schedular').fullCalendar('rerenderEvents');
									$('#schedular').fullCalendar('refetchResources');
								}, 500);
							}
						},
						everyOne: {
							text: document.getElementById("everyone-label").value,
							click: function() {
								saveUserPrefs({
									"show" : "everyOne"
								});
								setTimeout(function(){
									$('#schedular').fullCalendar('rerenderEvents');
									$('#schedular').fullCalendar('refetchResources');
								}, 500);
							}
						},
						tinySlots: {
							text: 'Per 10 minuten',
							click: () => {
								$('#schedular').fullCalendar('option', 'slotDuration', '00:10:00');
								[...document.querySelectorAll('.fc-time-grid .fc-slats td')].forEach(row => {
									row.style.height = '1.5em';
								})
								saveUserPrefs({
									'slotDuration' : 'tinySlots'
								});
							}
						},
						mediumTinySlots: {
							text: 'Per 15 minuten',
							click: () => {
								$('#schedular').fullCalendar('option', 'slotDuration', '00:15:00');
								[...document.querySelectorAll('.fc-time-grid .fc-slats td')].forEach(row => {
									row.style.height = '1.5em';
								})
								saveUserPrefs({
									'slotDuration' : 'mediumTinySlots'
								});
							}
						},
						mediumSlots: {
							text: 'Per 30 minuten',
							click: () => {
								$('#schedular').fullCalendar('option', 'slotDuration', '00:30:00');
								[...document.querySelectorAll('.fc-time-grid .fc-slats td')].forEach(row => {
									row.style.height = '3em';
								})
								saveUserPrefs({
									'slotDuration' : 'mediumSlots'
								});
							}
						}
					},
					header: {
						left: 'prev,next today legend onlyMine,everyOne',
						center: 'title',
						right: 'tinySlots,mediumTinySlots,mediumSlots agendaDay,agendaTwoDay,agendaThreeDay,agendaFourDay,agendaFiveDay,agendaWeek,month timelineDay,timelineTwoDay,timelineThreeDay,timelineFourDay,timelineWeek'
					},
					minTime : document.getElementById("business-hours-start").value,
					maxTime : document.getElementById("business-hours-end").value,
					slotDuration : getPreferredSlotDuration(),
					businessHours: {
					    // days of week. an array of zero-based day of week integers (0=Sunday)
					    dow: [ 1, 2, 3, 4, 5 ], // Monday - Thursday

					    start: document.getElementById("business-hours-start").value,
					    end: document.getElementById("business-hours-end").value
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
						},
						agendaThreeDay: {
							type: 'agenda',
							duration: { days: 3 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						agendaFourDay: {
							type: 'agenda',
							duration: { days: 4 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						agendaFiveDay: {
							type: 'agenda',
							duration: { days: 5 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						agendaWeek: {
							type: 'agenda',
							duration: { weeks: 1 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						timelineTwoDay: {
							type: 'timeline',
							duration: { days: 2 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						timelineThreeDay: {
							type: 'timeline',
							duration: { days: 3 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						},
						timelineFourDay: {
							type: 'timeline',
							duration: { days: 4 },

							// views that are more than a day will NOT do this behavior by default
							// so, we need to explicitly enable it
							groupByResource: true,

							//// uncomment this line to group by day FIRST with resources underneath
							groupByDateAndResource: true
						}
					},
					height: (screen.availHeight * .7),
					weekends: showWeekends,
					weekNumbers : true,
 					weekNumberCalculiation: 'ISO',
					//// uncomment this line to hide the all-day slot
					allDaySlot: false,

					resources: function(callback){
						$.ajax({
							url : "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=getResources",
							success : function(data) {
								var data = JSON.parse(data);
								window.Schedular.resources = {};
								for (var i = 0; i < data.length; i++) {
									window.Schedular.resources[data[i].id] = {
									id 		: data[i].id,
									title 	: data[i].title
									};
								}
								callback(data);
							}
						});
					},
					// resources: getResources(),
					events: [],
					eventAfterRender : function(event, element, view) {
						var contentDiv = element[0].firstChild;
						var div = document.createElement("div");
						div.className = "fc-content__custom";
						div.innerText = event.description;
						contentDiv.appendChild(div);

						if (event.eventStatus == "Completed") {
							var completedSign = document.createElement("span");
							completedSign.className = "slds-icon_container slds-icon-utility-check event-completed-mark";
							completedSign.innerHTML = "<svg class=\"slds-icon slds-icon_xx-small slds-icon-text-default\" aria-hidden=\"true\"><use xlink:href=\"include/LD/assets/icons/utility-sprite/svg/symbols.svg#check\"></use></svg>";
							contentDiv.appendChild(completedSign);
						} else if (event.eventStatus == "Cancelled") {
							var completedSign = document.createElement("span");
							completedSign.className = "slds-icon_container slds-icon-utility-check event-completed-mark";
							completedSign.innerHTML = "<svg class=\"slds-icon slds-icon_xx-small slds-icon-text-error\" aria-hidden=\"true\"><use xlink:href=\"include/LD/assets/icons/utility-sprite/svg/symbols.svg#error\"></use></svg>";
							contentDiv.appendChild(completedSign);							
						}

						if (event.location != null) {
							var div = document.createElement("div");
							div.className = "fc-content__custom";
							div.innerHTML = "<a href=\"https://www.google.nl/maps/place/" + encodeURIComponent(event.location) + "\" target=\"_blank\">" + event.location + "</a>";
							contentDiv.appendChild(div); 
						}

						// console.log(event.existingRelations);
						if (event.existingRelations != undefined && event.existingRelations.length > 0) {
							for (var i = 0; i < event.existingRelations.length; i++) {
								var div 		= document.createElement("div");
								div.className 	= "fc-content__custom";

								var bold 		= document.createElement("b");
								bold.innerText 	= event.existingRelations[i].translatedFieldName + ": ";

								var link 		= document.createElement("a");
								link.href 		= "index.php?action=DetailView&module=" + event.existingRelations[i].modulename + "&record=" + event.existingRelations[i].relcrmid;
								link.target 	= "_blank";
								link.innerText 	= event.existingRelations[i].label;

								div.appendChild(bold);
								div.appendChild(link);

								contentDiv.appendChild(div);								
							}
						}

						// Set extra css class when event is marked provisional
						if (event.provisional) {
							// element[0].style.opacity = 0.6;
							var bgCol = element[0].style.backgroundColor;
							element[0].style.backgroundColor = "rgba(" + bgCol.substring(4, bgCol.length -1) + ", 0.3)";
							element[0].style.opacity = 0.8;
						}
					},
					viewRender : function(view, element) {
						getEvents({
							start : view.activeRange.start._d,
							end : view.activeRange.end._d
						});
						saveUserPrefs({
							"view" : view
						});
					},
					eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) {
						Schedular.CurrentEvent.setCurrent(event);
						Schedular.CurrentEvent.update();
						Schedular.UI.hide();
					},
					eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
						Schedular.CurrentEvent.setCurrent(event);
						Schedular.CurrentEvent.update();
						Schedular.UI.hide();
					},
					select: function(start, end, jsEvent, view, resource) {
						Schedular.CurrentEvent.setCurrent({
							id 					: undefined,
							start 				: start,
							end 				: end,
							resourceId 			: resource.id, // Force resource to be obtained from global object
							title				: "",
							description 		: "",
							eventType 			: "",
							newEvent 			: true,
							existingRelations 	: [] // Force empty array to prevent error from "setExistingRelations"
						});
						Schedular.UI.show();
						Schedular.UI.fill();
					},
					eventClick: function(calEvent, jsEvent, view) {
						if (jsEvent.originalEvent.target.href == undefined) {
							// Only open the UI if it wasn't a link
							Schedular.CurrentEvent.clear();
							Schedular.CurrentEvent.setCurrent(calEvent);
							Schedular.UI.clear();
							Schedular.UI.show();
							Schedular.UI.fill();
						}				
					}
				});

				var eventUi = document.getElementById("schedular-event-ui");
				// target elements with the "draggable" class
				interact('#schedular-event-ui__draghandle', {
						context : eventUi
					}).draggable({
						// enable inertial throwing
						// inertia: true,
						// keep the element within the area of it's parent
						restrict: {
							restriction: "div#schedular",
							endOnly: true,
							elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
						},
						// enable autoScroll
						autoScroll: true,
						// call this function on every dragmove event
						onmove: dragMoveListener,
						onend : function(e) {
							e.target.parentElement.classList.remove("no-transition");
						}
				});

				interact('#schedular-eventtypes-legends__header').draggable({
						// enable inertial throwing
						// inertia: true,
						// keep the element within the area of it's parent
						restrict: {
							restriction: "div#schedular",
							endOnly: true,
							elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
						},
						// enable autoScroll
						autoScroll: true,
						// call this function on every dragmove event
						onmove: dragMoveListener
				});

				function dragMoveListener (event) {
					var target = event.target.parentElement,
					// keep the dragged position in the data-x/data-y attributes
					x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
					y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

					// translate the element
					target.style.webkitTransform =
					target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';

					// update the posiion attributes
					target.setAttribute('data-x', x);
					target.setAttribute('data-y', y);

					target.classList.add("no-transition");
				}

				document.getElementById("close-schedular-eventtypes-legend").addEventListener("click", function(){
					document.getElementById("schedular-eventtypes-legends").classList.toggle("active");
				});

				window.setTimeout(function(){
					const mondayCells = document.getElementsByClassName('fc-mon');
					mondayCells[mondayCells.length - 1].classList.add('fc-mon-last');
					const tueCells = document.getElementsByClassName('fc-tue');
					tueCells[tueCells.length - 1].classList.add('fc-tue-last');
					const wedCells = document.getElementsByClassName('fc-wed');
					wedCells[wedCells.length - 1].classList.add('fc-wed-last');
					const thuCells = document.getElementsByClassName('fc-thu');
					thuCells[thuCells.length - 1].classList.add('fc-thu-last');
					if ($('#schedular').fullCalendar('option', 'slotDuration') === '00:30:00') {
						[...document.querySelectorAll('.fc-time-grid .fc-slats td')].forEach(row => {
							row.style.height = '3em';
						})
					}
				},1000);

				clearInterval(int); // Schedular is launched, stop the interval
			}
		}, 400);
	}

	function getEvents(dates) {
		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
	    	if (this.readyState == 4 && this.status == 200) {
    			var events = JSON.parse(r.response);
				$("#schedular").fullCalendar("removeEvents");
				$("#schedular").fullCalendar("renderEvents", events);
		    }
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=getevents&start="+dates.start.toJSON()+"&end="+dates.end.toJSON(), true);
		r.send();
	}

	function saveUserPrefs(params) {
		var data = {};
		data.currentView = params.view == undefined ? "" : params.view.type;
		data.show = params.show == undefined ? "" : params.show;
		data.slotDuration = params.slotDuration == undefined ? "" : params.slotDuration;

		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			}
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=saveUserPrefs&data="+encodeURIComponent(JSON.stringify(data)), true);
		r.send();
	}

	function getUserPreferredView() {
		var prefView = document.getElementById("preferred-view").value;
		if (prefView != "") {
			return prefView;
		} else {
			return 'agendaDay';
		}
	}

	const getPreferredSlotDuration = () => {
		const pref_view = document.getElementById('preferred_slotduration').value
		const viewToTimeMap = {
			tinySlots: '00:10:00',
			mediumTinySlots: '00:15:00',
			mediumSlots: '00:30:00'
		}
		return viewToTimeMap[pref_view]
	}

});



var Schedular = {};

Schedular.UI = {
	el 			  	: (function(){
							return document.getElementById("schedular-event-ui");
						})(),
	loader 			  	: (function(){
							return document.getElementById("schedular-ui-loader");
						})(),
	link 			: (function(){
							return document.getElementById("sch-visit-event-link");
						})(),
	closeListener 	: (function(){
							document.getElementById("sch-cancel-event-ui").addEventListener("click", function(){
								Schedular.UI.clear();
								Schedular.UI.hide();
							});
						})(),
	saveListener 	: (function(){
							document.getElementById("sch-save-event-ui").addEventListener("click", function(){
								if (Schedular.CurrentEvent.newEvent == false) {
									Schedular.CurrentEvent.update();
								} else if (Schedular.CurrentEvent.newEvent == true) {
									Schedular.CurrentEvent.create();
								}
							});
						})(),
	deleteListener : (function(){
							document.getElementById("sch-delete-event-ui").addEventListener("click", function(){
								if (Schedular.CurrentEvent.newEvent == false) {
									Schedular.CurrentEvent.delete();
								}
							});
						})(),
	state 		   : false
};
Schedular.UI.show = function(){
	this.fields.name.focus();
	this.el.classList.add("active");
	this.state = true;
}
Schedular.UI.hide = function(){
	this.el.classList.remove("active");
	this.state = false;
}
Schedular.UI.setLoader = function(){
	this.loader.classList.add("active");
}
Schedular.UI.removeLoader = function(){
	this.loader.classList.remove("active");
}
Schedular.UI.clear = function(){
	var inputs = this.el.getElementsByTagName("input");
	var textareas = this.el.getElementsByTagName("textarea");
	var existingRelations = this.el.getElementsByClassName("existing-relations");
	var eventTypes = document.getElementById("event-types").getElementsByTagName("option");

	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "text" || inputs[i].type == "number" || inputs[i].type == "hidden") {
			inputs[i].value = "";
		} else if (inputs[i].type == "radio" || inputs[i].type == "checkbox") {
			inputs[i].checked = false;
		}
		inputs[i].classList.remove("sch-has-error");
	}

	for (var i = 0; i < textareas.length; i++) {
		textareas[i].value = "";
		textareas[i].innerText = "";
		textareas[i].innerHTML = "";
	}

	for (var i = 0; i < existingRelations.length; i++) {
		existingRelations[i].innerHTML = "";
	}

	eventTypes[0].selected = true;
	this.link.href = "";
}
Schedular.UI.fill = function(){
	this.fields.name.value 			= Schedular.CurrentEvent.title;
	this.fields.location.value 		= Schedular.CurrentEvent.location != undefined ? Schedular.CurrentEvent.location : "";
	this.fields.description.value 	= Schedular.CurrentEvent.description;
	this.fields.startDate.innerText	= Schedular.CurrentEvent.start.format(window.userDateFormat.toUpperCase());
	this.fields.startTime.innerText	= Schedular.CurrentEvent.startTime;
	this.fields.endDate.innerText 	= Schedular.CurrentEvent.end.format(window.userDateFormat.toUpperCase());
	this.fields.endTime.innerText 	= Schedular.CurrentEvent.endTime;
	this.fields.resource.innerText 	= Schedular.CurrentEvent.resource.title;
	this.fields.provisional.checked = Schedular.CurrentEvent.provisional;
	this.fields.notify.checked 		= Schedular.CurrentEvent.notify;
	this.fields.notifyads.value		= Schedular.CurrentEvent.notifyads || '';
	this.setEventLink();
	this.setCurrentEventType(Schedular.CurrentEvent.eventType);
	this.setExistingRelations(Schedular.CurrentEvent.relations);
}
Schedular.UI.setCurrentEventType = function(typeToSet){
	if (typeToSet != "") {
		for (var i = 0; i < this.fields.eventTypes.length; i++) {
			this.fields.eventTypes[i].selected = false;
			if (this.fields.eventTypes[i].value == typeToSet) {
				toSelect = this.fields.eventTypes[i];
			}
		}
		toSelect.selected = true;
	}
}
Schedular.UI.getCurrentEventType = function() {
	for (var i = 0; i < this.fields.eventTypes.length; i++) {
		if (this.fields.eventTypes[i].selected) {
			return this.fields.eventTypes[i].value;
			break;
		}
	}
}
Schedular.UI.setExistingRelations = function(relations) {
	for (var i = 0; i < relations.length; i++) {
		var newPill 	= Schedular.UI.createRelation(relations[i]);
		var parent 		= document.getElementsByClassName("existing-relations__" + relations[i].modulename)[0];
		var relationId 	= parent.getAttribute("data-relid");
		if (parent != undefined) {
			newPill.setAttribute("relation-id", relationId);
			parent.appendChild(newPill);
		}
	}
}
Schedular.UI.createRelation = function(relation) {
	var pill 		= document.createElement("span");
	pill.className 	= "slds-pill slds-pill_link existing-relation";
	// pill.setAttribute("data-reactroot", "");
	pill.setAttribute("relation-modulename", relation.modulename);
	pill.setAttribute("relation-relcrmid", relation.relcrmid);

	var link 		= document.createElement("a");
	link.href 		= "index.php?action=DetailView&module=" + relation.modulename + "&record=" + relation.relcrmid;
	link.target 	= "_blank";
	link.className 	= "slds-pill__action";
	link.title 		= relation.label;

	var label 		= document.createElement("span");
	label.className = "slds-pill__label";
	label.innerText = relation.label;

	link.appendChild(label);
	pill.appendChild(link);

	var button 			= document.createElement("button");
	button.className 	= "slds-button slds-button_icon slds-pill__remove";
	button.title 		= "Remove";

	var svg 			= document.createElement("svg");
	svg.className 		= "slds-button__icon";
	svg.setAttribute("aria-hidden", "true");

	var use 			= document.createElement("span");
	// var use 			= document.createElement("use");
	// use.setAttribute("xlink:href", "include/LD/assets/icons/utility-sprite/svg/symbols.svg#close");
	use.innerText 		= "X";

	var ass 			= document.createElement("span");
	ass.className 		= "slds-assistive-text";
	ass.innerText 		= "Remove";

	svg.appendChild(use);
	button.appendChild(svg);
	button.appendChild(ass);
	pill.appendChild(button);

	button.addEventListener("click", Schedular.CurrentEvent.removeExistingRelation);

	return pill;
}
Schedular.UI.fields = {
	name 		: document.getElementById("schedular_name"),
	description	: document.getElementById("schedular_description"),
	startDate	: document.getElementById("schedular-event-ui__startdate"),
	startTime	: document.getElementById("schedular-event-ui__starttime"),
	endDate		: document.getElementById("schedular-event-ui__enddate"),
	endTime		: document.getElementById("schedular-event-ui__endtime"),
	resource	: document.getElementById("schedular-event-ui__resourcename"),
	eventTypes 	: document.getElementById("event-types").getElementsByTagName("option"),
	location 	: document.getElementById("schedular_loc"),
	provisional : document.getElementById("schedular_provisional"),
	notify		: document.getElementById("schedular_notify"),
	notifyads	: document.getElementById("schedular_notifyads")
};
Schedular.UI.validate = function() {
	var inputs = this.el.getElementsByTagName("input");
	var hasError = [];
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].classList.remove("sch-has-error");
		if (inputs[i].getAttribute("data-required") == "true" && inputs[i].value == "") {
			hasError.push(inputs[i]);
		}
		// Check relations that need at least one entity,
		// except when the eventtype is either 'zaak' or 'vrij'
		// and the relationtype is 'SalesOrder' or 'Account'
		if (
			(
				Schedular.CurrentEvent.columnFields.schedular_eventtype.toLowerCase() === 'zaak' ||
				Schedular.CurrentEvent.columnFields.schedular_eventtype.toLowerCase() === 'vrij'
			) &&
			inputs[i].hasAttribute("data-is-mandatory-rel") &&
			(
				inputs[i].getAttribute("data-module") === 'SalesOrder' ||
				inputs[i].getAttribute("data-module") === 'Accounts'
			)
		) {
			continue
		}

		if (inputs[i].getAttribute("data-is-mandatory-rel") == "true") {
			var relatedModule = inputs[i].getAttribute("data-module");
			var relatedEntityCount = 0;
			for (var r = 0; r < Schedular.CurrentEvent.relations.length; r++) {
				if (Schedular.CurrentEvent.relations[r].modulename == relatedModule) {
					relatedEntityCount = 1;
				}
			}
			if (relatedEntityCount == 0) {
				hasError.push(inputs[i]);
			}
		}
	}
	if (hasError.length > 0) {
		for (var i = 0; i < hasError.length; i++) {
			hasError[i].classList.add("sch-has-error");
		}
		return false;
	} else {
		return true;
	}
}
Schedular.UI.setEventLink = function () {
	if (Schedular.CurrentEvent.id == undefined) {
		this.link.href 		= "javascript:void(0)";
		this.link.target 	= "_self";
		document.getElementById("sch-visit-event-ui").setAttribute("disabled", "");
	} else {
		this.link.href 		= "index.php?module=Schedular&action=DetailView&record=" + Schedular.CurrentEvent.id;
		this.link.target 	= "_blank";
		document.getElementById("sch-visit-event-ui").removeAttribute("disabled");
	}
}

Schedular.CurrentEvent = {
	id 			: undefined,
	start 		: undefined, // Moment JS obj
	end			: undefined, // Moment JS obj
	startDate	: "1970-01-01",
	startTime	: "00:00:00",
	endDate		: "1970-01-01",
	endTime		: "00:00:00",
	resource 	: {
		id 	: "",
		name: ""
	},
	title 		: "",
	description : "",
	eventType 	: "",
	columnFields: {},
	event 		: {},
	newEvent 	: false,
	relations	: [],
	relToRemove : [],
	location 	: undefined,
	provisional : false,
	notify 		: false,
	notifyads	: ''
};
Schedular.CurrentEvent.clear = function() {
	this.id 			= undefined;
	this.start 			= undefined; // Moment JS obj
	this.end			= undefined; // Moment JS obj
	this.startDate		= "1970-01-01";
	this.startTime		= "00:00:00";
	this.endDate		= "1970-01-01";
	this.endTime		= "00:00:00";
	this.resource 		= {
		id 	: "",
		name: ""
	};
	this.title 			= "";
	this.description 	= "";
	this.eventType 		= "";
	this.columnFields	= {};
	this.event 			= {};
	this.newEvent		= false;
	this.relations		= [];
	this.relToRemove 	= [];
	this.location 		= undefined;
	this.provisional 	= false;
	this.notify		 	= false;
	this.notifyads	 	= '';
}

Schedular.CurrentEvent.setCurrent = function(event) {
	this.clear();
	this.id 			= event.id;
	this.start  		= event.start;
	this.end 			= event.end;
	this.startDate 		= event.start.format("YYYY-MM-DD");
	this.startTime 		= event.start.format("HH:mm:ss");
	this.endDate 		= event.end.format("YYYY-MM-DD");
	this.endTime 		= event.end.format("HH:mm:ss");
	this.resource 		= typeof event.resourceId == "object" ? event.resourceId : window.Schedular.resources[event.resourceId];
	this.title 			= event.title;
	this.description	= event.description;
	this.eventType 		= event.eventType;
	this.event 	 		= event;
	this.newEvent 		= event.newEvent == true ? true : false;
	this.relations 		= event.existingRelations;
	this.location 		= event.location;
	this.provisional 	= event.provisional;
	this.notify		 	= event.notify;
	this.notifyads	 	= event.notifyads;
	// console.log("Current Event: ");
	// console.log(event);
}
Schedular.CurrentEvent.ajax = function(functionName, callback) {
	console.log("CurrentEvent AJAX call for " + functionName);
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		callback(r.response);
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=" + functionName + "&data="+encodeURIComponent(JSON.stringify(this)), true);
	r.send();
}
Schedular.CurrentEvent.setColumnFields = function() {
	this.columnFields = {
		"schedular_startdate"	: this.startDate,
		"schedular_starttime"	: this.startTime,
		"schedular_enddate"		: this.endDate,
		"schedular_endtime"		: this.endTime,
		"assigned_user_id"		: this.resource.id,
		"description"			: this.description,
		"schedular_eventtype"	: this.eventType,
		"schedular_name"		: this.title
	}
}
Schedular.CurrentEvent.setRelations = async function() {
	const existingRelations = [...document.getElementsByClassName("existing-relation")]
	const soRelations = existingRelations.filter(r => r.getAttribute('relation-modulename') === 'SalesOrder')
	const relSoIds = soRelations.map(so => so.getAttribute('relation-relcrmid'))
	const response = await fetch(
		`index.php?module=Schedular&action=SchedularAjax&file=ajax&function=areSosSameAccount&soIds=${encodeURIComponent(JSON.stringify(relSoIds))}`
	)
	let sosAreSameAccount = false
	try {
		sosAreSameAccount = await response.json()
	} catch (e) {
		alert('Het lukte niet om te kijken of je geen orders van meerdere accounts hebt gekozen')
		throw new Error('Could not do AJAX to check if SO\'s are from multiple accounts')
	}
	if (!sosAreSameAccount && relSoIds.length > 0) {
		alert('Je hebt orders van verschillende klanten aan deze afspraak gekoppeld')
		throw new Error('Trying to save SalesOrders from multiple accounts')
	}
	existingRelations.forEach((r, i) => {
		this.relations[i] = {
			modulename: r.getAttribute('relation-modulename'),
			relcrmid: r.getAttribute('relation-relcrmid')
		}
	}, this)
}
Schedular.CurrentEvent.getColumnFieldsFromUI = function() {
	this.columnFields.description			= Schedular.UI.fields.description.value;
	this.columnFields.schedular_eventtype	= Schedular.UI.getCurrentEventType();
	this.columnFields.schedular_name		= Schedular.UI.fields.name.value;
	this.columnFields.schedular_location	= Schedular.UI.fields.location.value;
	this.columnFields.schedular_provisional	= Schedular.UI.fields.provisional.checked ? 1 : 0;
	this.columnFields.schedular_notify		= Schedular.UI.fields.notify.checked ? 1 : 0;
	this.columnFields.schedular_notifyads	= Schedular.UI.fields.notifyads.value;
}
Schedular.CurrentEvent.update = function() {
	if (this.id == undefined) {
		throw new Error("No event set as current");
	}
	this.setColumnFields();
	this.setRelations();
	if (Schedular.UI.state == true) Schedular.CurrentEvent.getColumnFieldsFromUI();

	if (Schedular.UI.state == true) {
		if (Schedular.UI.validate() == true) {
			Schedular.UI.setLoader();
			this.ajax("updateEvent", callback);
		}
	} else {
		this.ajax("updateEvent", callback);
	}

	function callback(response) {
		Schedular.UI.removeLoader();
		var result = JSON.parse(response);
		if (Schedular.UI.state == true) Schedular.CurrentEvent.reRender(result);
	}
}
Schedular.CurrentEvent.create = function() {
	this.setColumnFields();
	this.setRelations();
	if (Schedular.UI.state == true) Schedular.CurrentEvent.getColumnFieldsFromUI();
	// console.log(this);

	if (Schedular.UI.validate() == true) {
		Schedular.UI.setLoader();
		this.ajax("createEvent", callback);
	}

	function callback(response) {
		// console.log(response);
		Schedular.UI.removeLoader();
		var result = JSON.parse(response);
		if (Schedular.UI.state == true) Schedular.CurrentEvent.render(result);
	}
}
Schedular.CurrentEvent.delete = function() {
	Schedular.UI.setLoader();
	var currentEvent = this;
	this.ajax("deleteEvent", callback);

	function callback(response) {
		Schedular.UI.removeLoader();
		response = JSON.parse(response);
		if (response.deleteResult == true) {
			$('#schedular').fullCalendar('removeEvents', currentEvent.id);
			currentEvent.clear();
			Schedular.UI.clear();
			Schedular.UI.hide();
			if (response.remainingCount > 0) {
				var msg = 'Er zijn nog ' + response.remainingCount + ' afspraken over voor de order waar deze aan gekoppeld was.';
				msg += ' De order is dus nog niet terug op \'gemaakt\' gezet.';
				alert(msg);
			}
		}
	}
}
Schedular.CurrentEvent.reRender = function(cbResult) {
	Schedular.CurrentEvent.event.title 				= cbResult.schedular_name;
	Schedular.CurrentEvent.event.description 		= cbResult.description;
	Schedular.CurrentEvent.event.backgroundColor	= cbResult.bgcolor;
	Schedular.CurrentEvent.event.borderColor		= shadeColor(cbResult.bgcolor, -40);
	Schedular.CurrentEvent.event.existingRelations	= cbResult.existingRelations;
	Schedular.CurrentEvent.event.eventType			= cbResult.schedular_eventtype;
	Schedular.CurrentEvent.event.location			= cbResult.schedular_location;
	Schedular.CurrentEvent.event.provisional		= cbResult.schedular_provisional;
	Schedular.CurrentEvent.event.notify				= cbResult.schedular_notify;
	Schedular.CurrentEvent.event.notifyads			= cbResult.schedular_notifyads;
	$('#schedular').fullCalendar('updateEvent', Schedular.CurrentEvent.event);

	Schedular.UI.clear();
	Schedular.UI.hide();
}
Schedular.CurrentEvent.render = function(cbResult) {
	var event = {
		id 					: cbResult.event.id,
		resourceId 			: cbResult.event.assigned_user_id,
		start 				: cbResult.event.schedular_startdate + "T" + cbResult.event.schedular_starttime,
		end 				: cbResult.event.schedular_enddate + "T" + cbResult.event.schedular_endtime,
		title 				: cbResult.event.schedular_name,
		description 		: cbResult.event.description,
		backgroundColor		: cbResult.event.bgcolor,
		textColor 			: "#000000",
		borderColor 		: shadeColor(cbResult.event.bgcolor, -40),
		existingRelations	: cbResult.event.existingRelations,
		eventType 			: cbResult.event.schedular_eventtype,
		provisional 		: cbResult.event.schedular_provisional,
		notify				: cbResult.event.schedular_notify,
		notifyads			: cbResult.event.schedular_notifyads
	};
	$('#schedular').fullCalendar('renderEvent', event);

	Schedular.UI.clear();
	Schedular.UI.hide();
}
Schedular.CurrentEvent.removeExistingRelation = function() {
	var el = this; // "This" is the button element the event listener lives on
	while (el = el.parentElement) {
		if (el.classList.contains("existing-relation")) {
			var parent = el;
			break;
		}
	}
	var relationToRemove = {
		"modulename" 	: parent.getAttribute("relation-modulename"),
		"relcrmid" 		: parent.getAttribute("relation-relcrmid")
	};
	Schedular.CurrentEvent.relToRemove.push(relationToRemove);
	// Remove from current event JS object relations
	for (var i = 0; i < Schedular.CurrentEvent.relations.length; i++) {
		if (Schedular.CurrentEvent.relations[i].relcrmid == relationToRemove.relcrmid) {
			Schedular.CurrentEvent.relations.splice(i);
		}
	}
	// Remove from DOM
	parent.parentElement.removeChild(parent);
}

/* ======= Auto complete part relations ====== */
var acInputs = document.getElementsByClassName("sch-relation-autocomplete-input");
for (var i = 0; i < acInputs.length; i++) {
	(function(_i){
		var ac = new Sch_AutocompleteRelation(acInputs[_i], _i);
		acInputs[_i].addEventListener("input", function(e){
			throttle(ac.get(e), 500);
		});
	})(i);
}

Schedular.AutoComplete = {};

Schedular.AutoComplete.Current = {
	"inputField" 		: undefined,
	"suggestionList" 	: undefined,
	"selectedItem"		: undefined,
	"instance" 			: undefined
};

Schedular.AutoComplete.Current.clear = function() {
	this.inputField.value 	= "";
	this.inputField			= undefined;
	this.suggestionList 	= undefined;
	this.selectedItem		= undefined;
	this.instance 			= undefined;
};

Schedular.AutoComplete.Current.setFocus = function(item) {
	for (var i = 0; i < this.suggestionList.children.length; i++) {
		this.suggestionList.children[i].firstChild.classList.remove("slds-has-focus");
	}
	item.firstChild.classList.add("slds-has-focus");
};

Schedular.AutoComplete.HandleKeys = function(e) {
	if (Schedular.AutoComplete.Current.suggestionList != undefined) {
		if (e.keyCode == 27) {
			// ESC
			Schedular.AutoComplete.Current.suggestionList.hide();
			Schedular.AutoComplete.Current.inputField.value = "";
			Schedular.AutoComplete.Current.clear();
		} else if (e.keyCode == 40) {
			// Down arrow
			if (Schedular.AutoComplete.Current.selectedItem == undefined) {
				Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.suggestionList.firstChild;
				Schedular.AutoComplete.Current.setFocus(Schedular.AutoComplete.Current.selectedItem);
			} else {
				if (Schedular.AutoComplete.Current.selectedItem.nextSibling == null) {
					Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.selectedItem;
				} else {
					Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.selectedItem.nextSibling;
					Schedular.AutoComplete.Current.setFocus(Schedular.AutoComplete.Current.selectedItem);
				}
			}
		} else if (e.keyCode == 38) {
			// Up arrow
			if (Schedular.AutoComplete.Current.selectedItem == undefined) {
				Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.suggestionList.lastChild;
				Schedular.AutoComplete.Current.setFocus(Schedular.AutoComplete.Current.selectedItem);
			} else {
				if (Schedular.AutoComplete.Current.selectedItem.previousSibling == null) {
					Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.selectedItem;
				} else {
					Schedular.AutoComplete.Current.selectedItem = Schedular.AutoComplete.Current.selectedItem.previousSibling;
					Schedular.AutoComplete.Current.setFocus(Schedular.AutoComplete.Current.selectedItem);
				}
			}
		} else if (e.keyCode == 13) {
			// Enter
			if (Schedular.AutoComplete.Current.instance != undefined) {
				Schedular.AutoComplete.Current.instance.select({
					label 	: Schedular.AutoComplete.Current.selectedItem.getAttribute("data-label"),
					value 	: Schedular.AutoComplete.Current.selectedItem.getAttribute("data-crmid"),
					location: Schedular.AutoComplete.Current.selectedItem.getAttribute("data-location")
				});
			}
		}
	}
}

function Sch_AutocompleteRelation(target, i) {
	this.inputField 	= target;
	this.data 			= JSON.parse(target.getAttribute("data-ac"));
	this.targetUL 		= document.getElementsByClassName("sch-relation-autocomplete__target")[i];
	// this.hiddenInput	= document.getElementsByClassName("sch-relation-autocomplete__hidden")[i];
	this.displayFields 	= this.data.schedular_relmodule_retfields.split(",");
	this.moduleName 	= this.data.schedular_relmodule_name;
	this.maxResults 	= 5;
	this.relationCont 	= document.getElementsByClassName("existing-relations__" + target.getAttribute("data-module"))[0];
	this.relationId 	= this.relationCont.getAttribute("data-relid");
	this.filterRelId 	= this.inputField.getAttribute("data-filterrel-id");
	this.locFields 		= this.data.schedular_fillslocation != "" ? this.data.schedular_fillslocation.split(",") : undefined;
	this.notifyadsFields= this.data.schedular_fillsnotifyads != "" ? this.data.schedular_fillsnotifyads.split(",") : undefined;

	this.targetUL.show 	= function() {
		if (!this.classList.contains("active")) {
			(function(){
				var allAcLists = document.getElementsByClassName("sch-relation-autocomplete__target");
				for (var i = 0; i < allAcLists.length; i++) {
					allAcLists[i].hide();
				}
			})();
			this.style.opacity = 1;
			this.classList.add("active");
		}
	}
	this.targetUL.hide 	= function() {
		if (this.classList.contains("active")) {
			this.style.opacity = 0;
			this.classList.remove("active");
			this.innerHTML = "";
		}	
	}
	this.targetUL.style.transition = "opacity 100ms ease";
}

Sch_AutocompleteRelation.prototype.get = function(e) {
	var term = e.target.value;
	if (term.length > 3) {
		this.data.term = term;
		this.data.relatedRecords = this.getRelatedRecords();
		var acInstance = this;

		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    		// console.log(r.response);
	    		acInstance.set(JSON.parse(r.response));
	    		// console.log(JSON.parse(r.response));
		    }
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=acRelation&data="+encodeURIComponent(JSON.stringify(this.data)), true);
		r.send();
	} else {
		this.clearTargetUL();
		this.targetUL.hide();
	}
}

Sch_AutocompleteRelation.prototype.set = function(items) {
	if (items.length > 0) {
		this.clearTargetUL();
		this.targetUL.show();
		var acInstance = this;
		var limit = acInstance.maxResults < items.length ? acInstance.maxResults : items.length;

		for (var i = 0; i < limit; i++) {

			var li = this.buildListItem(items[i]);
			this.targetUL.appendChild(li);

			li.addEventListener("click", function(e){
				acInstance.select({
					label 		: this.getAttribute("data-label"),
					value 		: this.getAttribute("data-crmid"),
					location 	: this.getAttribute("data-location"),
					notifyads	: this.getAttribute("data-notifyads")
				});
			});

		}

		// Add the currently used nodes in the global Schedular object
		Schedular.AutoComplete.Current.inputField 		= this.inputField;
		Schedular.AutoComplete.Current.suggestionList 	= this.targetUL;
		// add the JS instance to the global object
		Schedular.AutoComplete.Current.instance 		= this;
		// Set the first result as selected
		Schedular.AutoComplete.Current.selectedItem		= this.targetUL.firstChild;
		Schedular.AutoComplete.Current.setFocus(this.targetUL.firstChild);
	} else {
		// Show a message when no records are found
		Schedular.AutoComplete.Current.inputField 		= this.inputField; 	/* These two lines make sure the keybindings*/
		Schedular.AutoComplete.Current.suggestionList 	= this.targetUL;	/* work when no records are found */
		this.clearTargetUL();
		this.targetUL.show();
		this.targetUL.innerHTML = "<span style=\"display: inline-block; width: 100%; text-align: center;\" class=\"slds-icon_container slds-icon-standard-unmatched\" title=\"Description of icon when needed\"><svg class=\"slds-icon slds-icon-text-error\" aria-hidden=\"true\"><use xlink:href=\"include/LD/assets/icons/standard-sprite/svg/symbols.svg#unmatched\"></use></svg><span class=\"slds-assistive-text\">Description of icon</span></span>";
	}
}

Sch_AutocompleteRelation.prototype.select = function(params) {
	var label = params.label;
	var value = params.value;

	// TO-DO: remove when relations are collected from pills
	// this.inputField.value 	= label;
	// this.hiddenInput.value 	= value;

	var modName = this.moduleName;
	var newRelation = Schedular.UI.createRelation({
		modulename 	: modName,
		relcrmid 	: params.value,
		label 		: params.label
	});
	newRelation.setAttribute("relation-id", this.relationId);
	this.relationCont.appendChild(newRelation);

	if (params.location != "" && params.location != undefined) { document.getElementById("schedular_loc").value = params.location; }
	if (params.notifyads != "" && params.notifyads != undefined) { document.getElementById("schedular_notifyads").value = params.notifyads; }

	// Housekeeping after selection
	this.clearTargetUL();
	this.targetUL.hide();
	Schedular.AutoComplete.Current.clear();
}

Sch_AutocompleteRelation.prototype.getRelatedRecords = function() {
	var AllExistingRelations 	= document.getElementsByClassName("existing-relation");
	var relationsToFilterOn 	= [];
	for (var i = 0; i < AllExistingRelations.length; i++) {
		if(AllExistingRelations[i].getAttribute("relation-id") == this.filterRelId) {
			relationsToFilterOn.push(AllExistingRelations[i].getAttribute("relation-relcrmid"));
		}
	}
	return relationsToFilterOn;
}

Sch_AutocompleteRelation.prototype.buildListItem = function(item) {
	var li = document.createElement("li");
	li.className = "slds-listbox__item";
	li.setAttribute("role", "presentation");
	li.setAttribute("data-crmid", item.crmid);
	li.setAttribute("data-label", item[this.displayFields[0]]);

	var span = document.createElement("span");
	span.setAttribute("class", "slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta");
	span.setAttribute("role", "option");

	li.appendChild(span);

	span = document.createElement("span");
	span.setAttribute("class", "slds-media__figure");

	li.children[0].appendChild(span);

	span = document.createElement("span");
	span.setAttribute("class", "slds-icon_container slds-icon-standard-account");
	span.setAttribute("title", "TO FILL!");

	li.children[0].children[0].appendChild(span);

	var svg = document.createElement("svg");
	svg.setAttribute("class", "slds-icon slds-icon_small");
	svg.setAttribute("aria-hidden", "true");

	li.children[0].children[0].children[0].appendChild(svg);

	var use = document.createElement("use");
	use.setAttribute("xlink:href", "include/LD/assets/icons/standard-sprite/svg/symbols.svg#account");

	li.children[0].children[0].children[0].children[0].appendChild(use);

	span = document.createElement("span");
	span.setAttribute("class", "slds-assistive-text");
	span.innerText = "Description of icon";

	li.children[0].children[0].children[0].appendChild(span);

	span = document.createElement("span");
	span.setAttribute("class", "slds-media__body");

	li.children[0].appendChild(span);

	span = document.createElement("span");
	span.setAttribute("class", "slds-listbox__option-text slds-listbox__option-text_entity");
	span.innerHTML = item[this.displayFields[0]];

	li.children[0].children[1].appendChild(span);

	span = document.createElement("span");
	span.setAttribute("class", "slds-listbox__option-meta slds-listbox__option-meta_entity");
	span.innerText = this.buildSecondaryReturnFields(item);

	li.children[0].children[1].appendChild(span);

	// Add the location to a data attribute if set
	if (this.locFields != undefined) {
		var locDataAttr = "";
		for (var i = 0; i < this.locFields.length; i++) {
			locDataAttr += item[this.locFields[i]] + " ";
		}
		li.setAttribute("data-location", locDataAttr);
	}
	// Add the notify e-mail address fields
	if (this.notifyadsFields != undefined && item.hasOwnProperty(this.notifyadsFields[0])) {
		li.setAttribute("data-notifyads", item[this.notifyadsFields[0]]);
	}

	return li;
}

Sch_AutocompleteRelation.prototype.buildSecondaryReturnFields = function(item) {
	var returnString = "";
	for (var i = 0; i < this.displayFields.length; i++) {
		if (i != 0) {
			returnString = returnString + item[this.displayFields[i]];
			if (i < this.displayFields.length - 1) {
				returnString += "\n";
			}
		}
	}
	return returnString;
}

Sch_AutocompleteRelation.prototype.clearTargetUL = function () {
	while (this.targetUL.firstChild) {
	    this.targetUL.removeChild(this.targetUL.firstChild);
	}
}

window.addEventListener("keydown", Schedular.AutoComplete.HandleKeys);

/* https://medium.com/@_jh3y/throttling-and-debouncing-in-javascript-b01cad5c8edf */

var throttle = function(func, limit) {
  var inThrottle = undefined;
  return function() {
    var args = arguments,
      context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      return setTimeout(function() {
        return inThrottle = false;
      }, limit);
    }
  };
};

// https://stackoverflow.com/a/13532993
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

function getTranslatedAjax(label, module, id) {
		if (module == undefined) module = "Schedular";
		var data = {
			module : module,
			label : label
		};
		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    		window.Schedular.isTranslated[id] = r.response;
	    		document.getElementById(id).innerText = r.response;
		    }
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=translate&data="+encodeURIComponent(JSON.stringify(data)), true);
		r.send();
}
