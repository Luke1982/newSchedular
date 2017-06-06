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
	insertStylesheet("modules/Schedular/lib/css/Schedular.css");

	var scripts = [
		"modules/Schedular/lib/js/jquery.min.js",
		"modules/Schedular/lib/js/moment.min.js",
		"modules/Schedular/lib/js/fullcalendar.min.js",
		"modules/Schedular/lib/js/scheduler.min.js",
		"modules/Schedular/lib/js/interact.min.js"
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
					viewRender : function(view, element) {
						getEvents({
							start : view.activeRange.start._d,
							end : view.activeRange.end._d
						});
					},
					eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) {
						var sEvent = new SchedularEvent(event);
						sEvent.updateEventDragDrop();
					},
					eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
						var sEvent = new SchedularEvent(event);
						sEvent.updateEventDragDrop();
					},
					select: function(start, end, jsEvent, view, resource) {
						var sEvent = new SchedularEvent({
								"start" 	: start,
								"end" 		: end,
								"_id"		: null,
								"resourceId": resource,
								"title"		: null
							});
						sEvent.addNewEvent();
					},
					eventClick: function(calEvent, jsEvent, view) {
						// console.log(calEvent);
						var sEvent = new SchedularEvent({
								"start" 	: calEvent.start,
								"end" 		: calEvent.end,
								"_id"		: calEvent.id,
								"resourceId": {
									"id" 		: calEvent.resourceId,
									"title" 	: window.schedularResources[calEvent.resourceId]
								},
								"title"		: calEvent.title
							});
						sEvent.updateEventUI();					
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

				clearInterval(int); // Schedular is launched, stop the interval
			}
		}, 400);
	}

	function getResources() {
		var resources = document.getElementsByClassName("resource");
		var ret = [];
		window.schedularResources = {};
		for (var i = 0; i < resources.length; i++) {
			var r = {};
			r.id = resources[i].getElementsByClassName("resource__id")[0].innerText;
			r.title = resources[i].getElementsByClassName("resource__name")[0].innerText;
			window.schedularResources[r.id] = r.title;
			ret.push(r);
		}
		return ret;
	}

	function getEvents(dates) {
		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
	    	if (this.readyState == 4 && this.status == 200) {
    			console.log(JSON.parse(r.response));
				$("#schedular").fullCalendar("removeEvents");
				$("#schedular").fullCalendar("renderEvents", JSON.parse(r.response));
		    }
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=getevents&start="+dates.start.toJSON()+"&end="+dates.end.toJSON(), true);
		r.send();
	}

});

/* Factory for the Schedular Event object.
 * Takes an event from fullcalendar as an argument
 */
function SchedularEvent(event) {
	console.log(event);
	if (typeof event == "object") {
		this._event 	= event,
		this.startTime 	= event.start._d.toISOString(),
		this.endTime 	= event.end._d.toISOString(),
		this.id 		= event._id,
		this.resource 	= event.resourceId,
		this.title		= event.title;
		this.startObj	= event.start;
		this.endObj		= event.end;
	}
	this.ui = document.getElementById("schedular-event-ui");
}

/*
 * Instance method that updates an existing event
 */
SchedularEvent.prototype.updateEvent = function() {
	this.actualizeSaveData();

	var data = {};
	var inputs = document.getElementById("schedular-savedata").getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		data[inputs[i].getAttribute("data-columnfield")] = inputs[i].value;
	}

	// console.log(data);

	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		// console.log(r.response);
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=updateevent&data="+encodeURIComponent(JSON.stringify(data)), true);
	r.send();
}

/*
 * Instance method that updates an existing event
 * when it's been dragged or resized
 */
SchedularEvent.prototype.updateEventDragDrop = function() {
	this.actualizeSaveData();

	var data = {};
	data.schedular_startdate = this.startObj.format("YYYY-MM-DD");
	data.schedular_starttime = this.startObj.format("HH:mm:ss");
	data.schedular_enddate = this.endObj.format("YYYY-MM-DD");
	data.schedular_endtime = this.endObj.format("HH:mm:ss");
	data.assigned_user_id = this.resource.id == undefined ? this.resource : this.resource.id;
	data.schedularid = this.id;

	// console.log(data);

	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		// console.log(r.response);
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=updateevent&data="+encodeURIComponent(JSON.stringify(data)), true);
	r.send();
}

/*
 * Used on the select event handler of the fullcalendar function
 * handles the graphical frontend part of the creation of a new event
 */
SchedularEvent.prototype.addNewEvent = function() {

	this.startEventUI();
	newEventListeners(this); // Defined at the to of file. Not in the instance, listeners would stack

	document.getElementById("schedular-event-ui__startdate").innerText = this.startObj.format("DD-MM-YYYY");
	document.getElementById("schedular-event-ui__starttime").innerText = this.startObj.format("HH:mm:ss");
	document.getElementById("schedular-event-ui__enddate").innerText = this.endObj.format("DD-MM-YYYY");
	document.getElementById("schedular-event-ui__endtime").innerText = this.endObj.format("HH:mm:ss");
	document.getElementById("schedular-event-ui__resourcename").innerText = this.resource.title;

}

SchedularEvent.prototype.updateEventUI = function() {

	var instance = this;

	this.startEventUI();
	existingEventListeners(this); // Defined at the end of file. Not in the instance, listeners would stack

	document.getElementById("schedular-event-ui__startdate").innerText = this.startObj.format("DD-MM-YYYY");
	document.getElementById("schedular-event-ui__starttime").innerText = this.startObj.format("HH:mm:ss");
	document.getElementById("schedular-event-ui__enddate").innerText = this.endObj.format("DD-MM-YYYY");
	document.getElementById("schedular-event-ui__endtime").innerText = this.endObj.format("HH:mm:ss");
	document.getElementById("schedular-event-ui__resourcename").innerText = this.resource.title;
	document.getElementById("schedular_description").value = this.title;

	this.getEventDBInfo(handleCollectedDBInfo);

	function handleCollectedDBInfo() {
		instance.setSelectedEventType();
	}

}

/*
 * Get additional info about an event from the DB to fill the UI
 * when updating an event.
 */
SchedularEvent.prototype.getEventDBInfo = function(callback) {
	var data = {
		"id"	: this.id
	};
	var instance = this;
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		var eventDBInfo = JSON.parse(r.response);
			instance.eventType = eventDBInfo.schedular_eventtype;

			callback();
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=getEventDBInfo&data="+encodeURIComponent(JSON.stringify(data)), true);
	r.send();	
}

/*
 * Starts the event UI and sets event handlers
 */
SchedularEvent.prototype.startEventUI = function() {
	var eventTypes = document.getElementById("event-types").getElementsByTagName("option");

	document.getElementById("event-types").addEventListener("change", function(){
		for (var i = 0; i < eventTypes.length; i++) {
			if (eventTypes[i].selected) {
				document.getElementById("sch-eventtype").value = eventTypes[i].value;
				break;
			}
		}
	});

	this.ui.classList.add("active");
	this.ui.getElementsByClassName("slds-input")[0].focus();
}

/*
 * Cancells the event creation or update and clears the UI
 */
SchedularEvent.prototype.cancelEventUI = function() {
	this.clearEventUI();
	this.ui.classList.remove("active");
}

/*
 * Creates a new event (Schedular record) in coreBOS
 */
SchedularEvent.prototype.createEvent = function() {
	this.actualizeSaveData();
	var data = {};
	var inputs = document.getElementById("schedular-savedata").getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		data[inputs[i].getAttribute("data-columnfield")] = inputs[i].value;
	}

	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		var result = (JSON.parse(r.response));
    		// console.log(result);
			$("#schedular").fullCalendar("renderEvent", {
				"id"				: result.event.id,
				"resourceId"		: result.event.assigned_user_id,
				"start"				: result.event.schedular_startdate + "T" + result.event.schedular_starttime,
				"end"				: result.event.schedular_enddate + "T" + result.event.schedular_endtime,
				"title"				: result.event.description,
				"backgroundColor"	: result.event.bgcolor,
				"borderColor"		: "#ffffff",
				"textColor"			: "#000000"
			});
    		// if (r.response == "true") {
    		// 	$("#schedular").fullCalendar("renderEvent");
    		// }
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=createEvent&data="+encodeURIComponent(JSON.stringify(data)), true);
	r.send();
	// this.clearEventUI();
	// this.ui.classList.remove("active");
}

/*
 * Gets all the data from the UI and bring it into the hidden DIV
 * that holds all the values to save into coreBOS
 * Also performs some formatting to prepare for inserting in coreBOS
 */
SchedularEvent.prototype.actualizeSaveData = function() {

	document.getElementById("sch-description").value = document.getElementById("schedular_description").value;
	document.getElementById("sch-startdate").value = this.startObj.format("YYYY-MM-DD");
	document.getElementById("sch-starttime").value = this.startObj.format("HH:mm:ss");
	document.getElementById("sch-enddate").value = this.endObj.format("YYYY-MM-DD");
	document.getElementById("sch-endtime").value = this.endObj.format("HH:mm:ss");
	document.getElementById("sch-assignedto").value = this.resource.id == undefined ? this.resource : this.resource.id; 
	document.getElementById("sch-eventtype").value = this.getSelectedEventType();
	document.getElementById("sch-id").value = this.id;

}

/*
 * Returns the currently selected event type
 */
SchedularEvent.prototype.getSelectedEventType = function() {

	var eventTypes = document.getElementById("event-types").getElementsByTagName("option");
	for (var i = 0; i < eventTypes.length; i++) {
		if (eventTypes[i].selected) {
			return eventTypes[i].value;
			break;
		}
	}

}

/*
 * Set the currently selected event type based on param
 */
SchedularEvent.prototype.setSelectedEventType = function() {

	var eventTypes = document.getElementById("event-types").getElementsByTagName("option");
	console.log(this.eventType);
	for (var i = 0; i < eventTypes.length; i++) {
		eventTypes[i].selected = false;
		if (eventTypes[i].value == this.eventType) {
			toSelect = eventTypes[i];
		}
	}
	toSelect.selected = true;
}

/*
 * Clears all the inputs and textarea's in the UI
 */
SchedularEvent.prototype.clearEventUI = function() {
	var inputs = this.ui.getElementsByTagName("input");
	var textareas = this.ui.getElementsByTagName("textarea");

	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "text" || inputs[i].type == "number" || inputs[i].type == "hidden") {
			inputs[i].value = "";
		} else if (inputs[i].type == "radio" || inputs[i].type == "checkbox") {
			inputs[i].checked == false;
		}
	}

	for (var i = 0; i < textareas.length; i++) {
		textareas[i].value = "";
		textareas[i].innerText = "";
		textareas[i].innerHTML = "";
	}
}

function newEventListeners(instance) {
	window.currentSchInstance = instance;
	var cancelUI = document.getElementById("sch-cancel-event-ui");
	var saveUI = document.getElementById("sch-save-event-ui");

	cancelUI.removeEventListener("click", cancelEventUI);
	cancelUI.addEventListener("click", cancelEventUI);
	saveUI.removeEventListener("click", createEvent);
	saveUI.removeEventListener("click", updateEvent);
	saveUI.addEventListener("click", createEvent);
}

function existingEventListeners(instance) {
	window.currentSchInstance = instance;
	var cancelUI = document.getElementById("sch-cancel-event-ui");
	var saveUI = document.getElementById("sch-save-event-ui");

	cancelUI.removeEventListener("click", cancelEventUI);
	cancelUI.addEventListener("click", cancelEventUI);
	saveUI.removeEventListener("click", createEvent);
	saveUI.removeEventListener("click", updateEvent);
	saveUI.addEventListener("click", updateEvent);
}

function cancelEventUI(e) {
	window.currentSchInstance.cancelEventUI();
}

function createEvent(e) {
	window.currentSchInstance.createEvent();
}

function updateEvent(e) {
	window.currentSchInstance.updateEvent();
}