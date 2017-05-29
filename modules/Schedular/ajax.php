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
	$start_time = new DateTime($_REQUEST['start']);
	$end_time = new DateTime($_REQUEST['end']);
	$start_time = $start_time->format("Y-m-d H:m:s");
	$end_time = $end_time->format("Y-m-d H:m:s");

	// $r = $adb->pquery("SELECT * FROM vtiger_schedular", array());
	$r = $adb->pquery("SELECT * FROM vtiger_schedular INNER JOIN vtiger_crmentity ON vtiger_crmentity.crmid=vtiger_schedular.schedularid WHERE vtiger_schedular.schedular_starttime >= ? AND vtiger_schedular.schedular_endtime <= ?", array($start_time, $end_time));
	$events = array();
	while ($event = $adb->fetch_array($r)) {
		$prepared_event = array();
		$prepared_event['id'] = $event['crmid'];
		$prepared_event['resourceId'] = $event['smownerid'];
		$start = new DateTime($event['schedular_starttime']);
		$prepared_event['start'] = $start->format("Y-m-d\TH:m:s");
		$end = new DateTime($event['schedular_endtime']);
		$prepared_event['end'] = $end->format("Y-m-d\TH:m:s");
		$prepared_event['title'] = $event['description'];
		$events[] = $prepared_event;
	}
	echo json_encode($events);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'updateevent') {
	global $current_user;
	require_once('modules/Schedular/Schedular.php');

	$event = json_decode($_REQUEST['event'], true);

	$new_start_time = new DateTime($event['startTime']);
	$new_end_time = new DateTime($event['endTime']);
	$new_start_time = $new_start_time->format("Y-m-d H:m:s");
	$new_end_time = $new_end_time->format("Y-m-d H:m:s");

	$rec = new Schedular();
	$rec->retrieve_entity_info($event['id'], 'Schedular');
	$rec->id = $event['id'];
	$rec->mode = 'edit';

	$rec->column_fields['schedular_starttime'] = $new_start_time;
	$rec->column_fields['schedular_endtime'] = $new_end_time;

	$handler = vtws_getModuleHandlerFromName('Schedular', $current_user);
	$meta = $handler->getMeta();
	$rec->column_fields = DataTransform::sanitizeRetrieveEntityInfo($rec->column_fields, $meta);

	echo "<pre>";
	var_dump($rec->column_fields);
	echo "</pre>";

	$rec->save('Schedular');
}