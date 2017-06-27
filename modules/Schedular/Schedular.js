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
					minTime : "08:00:00",
					maxTime : "19:00:00",
					slotDuration : "00:15:00",
					businessHours: {
					    // days of week. an array of zero-based day of week integers (0=Sunday)
					    dow: [ 1, 2, 3, 4, 5 ], // Monday - Thursday

					    start: '08:00', // a start time (10am in this example)
					    end: '18:00', // an end time (6pm in this example)
					},
					views: {
						agendaTwoDay: {
							type: 'agenda',
							duration: { days: 3 },

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
					eventAfterRender : function(event, element, view) {
						console.log(event);
						var contentDiv = element[0].firstChild;
						var div = document.createElement("div");
						div.className = "fc-content__custom";
						div.innerText = event.description;
						contentDiv.appendChild(div);

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
					},
					viewRender : function(view, element) {
						getEvents({
							start : view.activeRange.start._d,
							end : view.activeRange.end._d
						});
					},
					eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) {
						Schedular.CurrentEvent.setCurrent(event);
						Schedular.CurrentEvent.update();
						Schedular.UI.hide();
						// var sEvent = new SchedularEvent(event);
						// sEvent.updateEventDragDrop();
					},
					eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
						Schedular.CurrentEvent.setCurrent(event);
						Schedular.CurrentEvent.update();
						Schedular.UI.hide();
						// var sEvent = new SchedularEvent(event);
						// sEvent.updateEventDragDrop();
					},
					select: function(start, end, jsEvent, view, resource) {
						Schedular.CurrentEvent.setCurrent({
							id 			: undefined,
							start 		: start,
							end 		: end,
							resourceId 	: resource.id, // Force resource to be obtained from global object
							title		: "",
							description : "",
							eventType 	: "",
							newEvent 	: true
						});
						Schedular.UI.show();
						Schedular.UI.fill();
						// Schedular.CurrentEvent.current(event);
						// var sEvent = new SchedularEvent({
						// 		"start" 	: start,
						// 		"end" 		: end,
						// 		"_id"		: null,
						// 		"resourceId": resource,
						// 		"title"		: null,
						// 		"eventType"	: null
						// 	});
						// sEvent.addNewEvent();
					},
					eventClick: function(calEvent, jsEvent, view) {
						if (jsEvent.originalEvent.target.href == undefined) {
							// Only open the UI if it wasn't a link
							Schedular.CurrentEvent.setCurrent(calEvent);
							Schedular.UI.show();
							Schedular.UI.fill();
						}
						// var sEvent = new SchedularEvent({
						// 		"start" 	: calEvent.start,
						// 		"end" 		: calEvent.end,
						// 		"_id"		: calEvent.id,
						// 		"resourceId": {
						// 			"id" 		: calEvent.resourceId,
						// 			"title" 	: window.schedularResources[calEvent.resourceId]
						// 		},
						// 		"title"		: calEvent.title,
						// 		"eventType"	: calEvent.eventType,
						// 		"description": calEvent.description
						// 	});
						// sEvent.updateEventUI();					
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
		window.Schedular.resources = {};
		for (var i = 0; i < resources.length; i++) {
			var r = {};
			r.id = resources[i].getElementsByClassName("resource__id")[0].innerText;
			r.title = resources[i].getElementsByClassName("resource__name")[0].innerText;
			window.Schedular.resources[r.id] = {
				id 		: r.id,
				title 	: r.title
			};
			ret.push(r);
		}
		return ret;
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

});



var Schedular = {};
Schedular.UI = {
	el 			  : (function(){
						return document.getElementById("schedular-event-ui");
					})(),
	closeListener : (function(){
						document.getElementById("sch-cancel-event-ui").addEventListener("click", function(){
							Schedular.UI.clear();
							Schedular.UI.hide();
						});
					})(),
	saveListener : (function(){
						document.getElementById("sch-save-event-ui").addEventListener("click", function(){
							if (Schedular.CurrentEvent.newEvent == false) {
								Schedular.CurrentEvent.update();
							} else if (Schedular.CurrentEvent.newEvent == true) {
								Schedular.CurrentEvent.create();
							}
						});
					})(),
	state 		   : false
};
Schedular.UI.show = function(){
	this.el.classList.add("active");
	this.state = true;
}
Schedular.UI.hide = function(){
	this.el.classList.remove("active");
	this.state = false;
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
			inputs[i].checked == false;
		}
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
}
Schedular.UI.fill = function(){
	this.fields.name.value 			= Schedular.CurrentEvent.title;
	this.fields.description.value 	= Schedular.CurrentEvent.description;
	this.fields.startDate.innerText	= Schedular.CurrentEvent.start.format("DD-DD-YYYY");
	this.fields.startTime.innerText	= Schedular.CurrentEvent.startTime;
	this.fields.endDate.innerText 	= Schedular.CurrentEvent.end.format("DD-DD-YYYY");
	this.fields.endTime.innerText 	= Schedular.CurrentEvent.endTime;
	this.fields.resource.innerText 	= Schedular.CurrentEvent.resource.title;
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
		var newPill = Schedular.UI.createRelation(relations[i]);
		var parent = document.getElementsByClassName("existing-relations__" + relations[i].modulename)[0];
		if (parent != undefined) {
			parent.appendChild(newPill);
		}
	}
}
Schedular.UI.createRelation = function(relation) {
	var pill 		= document.createElement("span");
	pill.className 	= "slds-pill slds-pill_link existing-relation";
	pill.setAttribute("data-reactroot", "");
	pill.setAttribute("relation-modulename", relation.modulename);
	pill.setAttribute("relation-relcrmid", relation.relcrmid);

	var link 		= document.createElement("a");
	link.href 		= "javascript:void(0);";
	link.className 	= "slds-pill__action";
	link.title 		= relation.label;

	var label 		= document.createElement("span");
	label.className = "slds-pill__label";
	label.innerText = relation.label;

	link.appendChild(label);
	pill.appendChild(link);

	var button 			= document.createElement("button");
	button.className 	= "slds-button slds-button_icon slds-button_icon slds-pill__remove";
	button.title 		= "Remove";

	var svg 			= document.createElement("svg");
	svg.className 		= "slds-button__icon";
	svg.setAttribute("aria-hidden", "true");

	var use 			= document.createElement("use");
	use.setAttribute("xlink:href", "include/LD/assets/icons/utility-sprite/svg/symbols.svg#close");

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
	eventTypes 	: document.getElementById("event-types").getElementsByTagName("option")
};
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
	relations	: {},
	relToRemove : []
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
	this.relations		= {};
	this.relToRemove 	= [];
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
	// console.log("Current Event: ");
	// console.log(event);
}
Schedular.CurrentEvent.ajax = function(functionName, callback) {
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
Schedular.CurrentEvent.setRelations = function() {
	var relationInputs = document.getElementsByClassName("relation-autocomplete-input");
	var hiddenRelationInputs = document.getElementsByClassName("relation-autocomplete__hidden");
	var relations = {};

	if (relationInputs != undefined) {
		for (var i = 0; i < relationInputs.length; i++) {
			var relData 	= JSON.parse(relationInputs[i].getAttribute("data-ac"));
			relations[relData.schedular_relmodule_name] = hiddenRelationInputs[i].value;
		}
	}
	this.relations = relations;
}
Schedular.CurrentEvent.getColumnFieldsFromUI = function() {
	this.columnFields.description			= Schedular.UI.fields.description.value;
	this.columnFields.schedular_eventtype	= Schedular.UI.getCurrentEventType();
	this.columnFields.schedular_name		= Schedular.UI.fields.name.value;
	// console.log("Column fields fetched from UI");
	// console.log(this.columnFields);
}
Schedular.CurrentEvent.update = function() {
	if (this.id == undefined) {
		throw new Error("No event set as current");
	}
	this.setColumnFields();
	this.setRelations();
	if (Schedular.UI.state == true) Schedular.CurrentEvent.getColumnFieldsFromUI();

	this.ajax("updateEvent", callback);

	function callback(response) {
		var result = JSON.parse(response);
		if (Schedular.UI.state == true) Schedular.CurrentEvent.reRender(result);
	}
}
Schedular.CurrentEvent.create = function() {
	this.setColumnFields();
	this.setRelations();
	if (Schedular.UI.state == true) Schedular.CurrentEvent.getColumnFieldsFromUI();
	console.log(this);

	this.ajax("createEvent", callback);

	function callback(response) {
		var result = JSON.parse(response);
		// console.log(response);
		if (Schedular.UI.state == true) Schedular.CurrentEvent.render(result);
	}
}
Schedular.CurrentEvent.reRender = function(cbResult) {
	Schedular.CurrentEvent.event.title 				= cbResult.schedular_name;
	Schedular.CurrentEvent.event.description 		= cbResult.description;
	Schedular.CurrentEvent.event.backgroundColor	= cbResult.bgcolor;
	Schedular.CurrentEvent.event.borderColor		= shadeColor(cbResult.bgcolor, -40);
	Schedular.CurrentEvent.event.existingRelations	= cbResult.existingRelations;
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
		eventType 			: cbResult.event.schedular_eventtype
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
	parent.parentElement.removeChild(parent);
}

/* ======= Auto complete part relations ====== */
var acInputs = document.getElementsByClassName("relation-autocomplete-input");
for (var i = 0; i < acInputs.length; i++) {
	(function(_i){
		var ac = new AutocompleteRelation(acInputs[_i], _i);
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
				value 	: Schedular.AutoComplete.Current.selectedItem.getAttribute("data-crmid")
			});
		}
	}

}

function AutocompleteRelation(target, i) {
	this.inputField 	= target;
	this.data 			= JSON.parse(target.getAttribute("data-ac"));
	this.targetUL 		= document.getElementsByClassName("relation-autocomplete__target")[i];
	this.hiddenInput	= document.getElementsByClassName("relation-autocomplete__hidden")[i];
	this.displayFields 	= this.data.schedular_relmodule_retfields.split(",");
	this.moduleName 	= this.data.schedular_relmodule_name;
	this.maxResults 	= 5;

	this.targetUL.show 	= function() {
		if (!this.classList.contains("active")) {
			(function(){
				var allAcLists = document.getElementsByClassName("relation-autocomplete__target");
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
		}	
	}
	this.targetUL.style.transition = "opacity 100ms ease";
}

AutocompleteRelation.prototype.get = function(e) {
	var term = e.target.value;
	if (term.length > 3) {
		this.data.term = term;
		var acInstance = this;

		var r = new XMLHttpRequest();
		r.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    		acInstance.set(JSON.parse(r.response));
	    		// console.log(r.response);
		    }
		};
		r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=acRelation&data="+encodeURIComponent(JSON.stringify(this.data)), true);
		r.send();
	} else {
		this.clearTargetUL();
		this.targetUL.hide();
	}
}

AutocompleteRelation.prototype.set = function(items) {
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
					value 		: this.getAttribute("data-crmid")
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
	}
}

AutocompleteRelation.prototype.select = function(params) {
	var label = params.label;
	var value = params.value;

	this.inputField.value 	= label;
	this.hiddenInput.value 	= value;

	// Housekeeping after selection
	this.clearTargetUL();
	this.targetUL.hide();
	Schedular.AutoComplete.Current.clear();
}

AutocompleteRelation.prototype.buildListItem = function(item) {

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
	span.innerText = this.buildSecondayReturnFields(item);

	li.children[0].children[1].appendChild(span);

	return li;
}

AutocompleteRelation.prototype.buildSecondayReturnFields = function(item) {
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

AutocompleteRelation.prototype.clearTargetUL = function () {
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

function getTranslatedAjax(label, module) {
	if (module == undefined) module = "Schedular";
	var data = {
		module : module,
		label : label
	};
	var r = new XMLHttpRequest();
	r.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    		return r.response;
	    }
	};
	r.open("GET", "index.php?module=Schedular&action=SchedularAjax&file=ajax&function=translate&data="+encodeURIComponent(JSON.stringify(data)), true);
	r.send();	
}