<?php
/*+**********************************************************************************
 * The contents of this file are subject to the coreBOS CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  MajorLabel
 * The Initial Developer of the Original Code is MajorLabel.
 * All Rights Reserved.
 ************************************************************************************/
if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'getevents') {
	global $adb;
	$start_date = new DateTime($_REQUEST['start']);
	$end_date = new DateTime($_REQUEST['end']);
	$start_date = $start_date->format("Y-m-d");
	$end_date = $end_date->format("Y-m-d");

	// $r = $adb->pquery("SELECT * FROM vtiger_schedular", array());
	$r = $adb->pquery("SELECT * FROM vtiger_schedular INNER JOIN vtiger_crmentity 
						ON vtiger_crmentity.crmid=vtiger_schedular.schedularid INNER JOIN vtiger_schedular_eventtype 
						ON vtiger_schedular.schedular_eventtype=vtiger_schedular_eventtype.schedular_eventtype INNER JOIN vtiger_schedular_eventcolors 
						ON vtiger_schedular_eventtype.schedular_eventtypeid=vtiger_schedular_eventcolors.eventtype_id 
						WHERE vtiger_schedular.schedular_startdate >= ? 
						AND vtiger_schedular.schedular_enddate <= ?", array($start_date, $end_date));
	$events = array();
	while ($event = $adb->fetch_array($r)) {
		$prepared_event = array();
		$prepared_event['id'] = $event['crmid'];
		$prepared_event['resourceId'] = $event['smownerid'];
		$start = new DateTime($event['schedular_startdate'] . ' ' . $event['schedular_starttime']);
		$prepared_event['start'] = $start->format("Y-m-d\TH:m:s");
		$end = new DateTime($event['schedular_enddate'] . ' ' . $event['schedular_endtime']);
		$prepared_event['end'] = $end->format("Y-m-d\TH:m:s");
		$prepared_event['title'] = $event['description'];
		$prepared_event['backgroundColor'] = $event['eventtype_bgcolor'];
		$prepared_event['borderColor'] = '#ffffff';
		$prepared_event['textColor'] = '#000000';
		$events[] = $prepared_event;
	}
	echo json_encode($events);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'updateevent') {
	global $current_user;
	require_once('modules/Schedular/Schedular.php');

	$event = json_decode($_REQUEST['event'], true);

	$new_start = new DateTime($event['startTime']);
	$new_end = new DateTime($event['endTime']);
	$new_start_time = $new_start->format("H:m:s");
	$new_end_time = $new_end->format("H:m:s");
	$new_start_date = $new_start->format("Y-m-d");
	$new_end_date = $new_end->format("Y-m-d");

	$rec = new Schedular();
	$rec->retrieve_entity_info($event['id'], 'Schedular');
	$rec->id = $event['id'];
	$rec->mode = 'edit';

	$rec->column_fields['schedular_starttime'] = $new_start_time;
	$rec->column_fields['schedular_endtime'] = $new_end_time;
	$rec->column_fields['schedular_startdate'] = $new_start_date;
	$rec->column_fields['schedular_enddate'] = $new_end_date;
	$rec->column_fields['assigned_user_id'] = $event['resource'];

	$handler = vtws_getModuleHandlerFromName('Schedular', $current_user);
	$meta = $handler->getMeta();
	$rec->column_fields = DataTransform::sanitizeRetrieveEntityInfo($rec->column_fields, $meta);
	
	$rec->save('Schedular');
	echo "true";
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'saveAvailableUsers') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);
	$r = $adb->pquery("REPLACE INTO vtiger_schedularsettings SET schedular_settingsid = ?, schedular_available_users = ?", array(1, $data));
	if ($adb->getAffectedRowCount($r) >= 1) {
		echo "true";
	} else {
		echo "false";
	} 
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'saveEventTypeSettings') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);
	foreach ($data['eventTypes'] as $eventtype_id => $eventtype) {
		$r = $adb->pquery("INSERT INTO vtiger_schedular_eventcolors (eventtype_id, eventtype_bgcolor) VALUES (?,?) ON DUPLICATE KEY UPDATE eventtype_bgcolor = ?", array($eventtype_id, $eventtype['colors']['bg'], $eventtype['colors']['bg']));
	}
	echo 'true';
}