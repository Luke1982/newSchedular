
function SchedularSettings() {
	this.saveAvUsersButton = document.getElementById("save-available-users");
	this.saveEvTypeSettingsButton = document.getElementById("save-event-settings");

	this.saveAvUsersButton.addEventListener("click", function(){
		settings.saveAvUsers();
	});
	this.saveEvTypeSettingsButton.addEventListener("click", function(){
		settings.saveEventTypeSettings();
	});
}

SchedularSettings.prototype.save = function(data) {
	var functionToCall = data.action;
	var endPoint = "index.php?module=Schedular&action=SchedularAjax&file=ajax";
	var dataToSave = encodeURIComponent(JSON.stringify(data.toSave));
	var callback = data.callback;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // if (JSON.parse(r.response) == true) {
	       		callback(xhttp.response);
	       // }
	    }
	};
	xhttp.open("GET", endPoint + "&function=" + functionToCall + "&data=" + dataToSave, true);
	xhttp.send(); 
}

SchedularSettings.prototype.saveAvUsers = function() {
	var checkboxes = document.getElementsByClassName("available-users__checkbox");
	var selectedUsers = "";

	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked == true) {
			var userId = checkboxes[i].id.slice(-1);
			selectedUsers += userId + ",";
		}
	}

	selectedUsers = selectedUsers.substr(0, selectedUsers.length - 1);
	this.save({
		"action" 	: "saveAvailableUsers",
		"toSave"	: {
			"users"		: selectedUsers
		},
		"callback"	: function(response) {
			if (response == "true") {
				window.settings.toast("toast-message__users-saved");
			}
		}
	});
}

SchedularSettings.prototype.saveEventTypeSettings = function() {
	var eventBgColorInputs = document.getElementsByClassName("event-type__background-color");
	var eventTypes = {};
	for (var i = 0; i < eventBgColorInputs.length; i++) {
		var eventId = eventBgColorInputs[i].id.slice(-1);
		// console.log(eventId);
		eventTypes[eventId] = {
			"colors" : {
				"bg" : eventBgColorInputs[i].value
			}
		}
	}
	this.save({
		"action" 	: "saveEventTypeSettings",
		"toSave"	: {
			"eventTypes"	: eventTypes
		},
		"callback"	: function(response) {
			if (response == "true") {
				window.settings.toast("toast-message__event-types-saved");
			}
		}
	});
}

SchedularSettings.prototype.toast = function(message, type) {
	var toastDiv = document.getElementById("toast");
	var toastText = document.getElementById("toasttext");
	var closeToast = document.getElementById("close-toast");

	toastDiv.style.display = "block";
	toastText.innerText = document.getElementById(message).innerText;
	closeToast.addEventListener("click", function(){
		toastDiv.style.display = "none";
	});
}

window.addEventListener("load", function(){
	window.settings = new SchedularSettings();
});