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
						AND vtiger_schedular.schedular_enddate <= ? 
						AND vtiger_crmentity.deleted = ?", array($start_date, $end_date, 0));
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

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'createRelation') {
	global $adb;
	include_once('vtlib/Vtiger/Module.php');
	$data = json_decode($_REQUEST['data'], true);

	$r = $adb->pquery("INSERT INTO vtiger_schedular_relations (schedular_relmodule_name) VALUES (?)", array($data['moduleName']));
	if ($adb->getAffectedRowCount($r) == 1) {

		$moduleInstance = Vtiger_Module::getInstance('Schedular');
		$relatedModule = Vtiger_Module::getInstance($data['moduleName']);
		$relationLabel = $data['moduleName'];
		$moduleInstance->setRelatedList($relatedModule, $relationLabel, Array('ADD','SELECT'));

		$r = $adb->query("SELECT * FROM vtiger_schedular_relations ORDER BY schedular_relid DESC LIMIT 1");
		$new_row = $adb->fetch_array($r);
		$new_row['result'] = 'success';
		echo json_encode($new_row);

	} else {
		echo json_encode(array('result' => 'fail'));
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'deleteRelation') {
	global $adb;
	include_once('vtlib/Vtiger/Module.php');

	$data = json_decode($_REQUEST['data'], true);
	$r = $adb->pquery("DELETE FROM vtiger_schedular_relations WHERE schedular_relid = ?", array($data['relationId']));
	if ($adb->getAffectedRowCount($r) == 1) {

		$moduleInstance = Vtiger_Module::getInstance('Schedular');
		$relatedModule = Vtiger_Module::getInstance($data['moduleName']);
		$relationLabel = $data['moduleName'];
		$moduleInstance->unsetRelatedList($relatedModule, $relationLabel);

		echo 'true';

	} else {
		echo 'false';
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'updateRelation') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);

	$r = $adb->pquery("UPDATE vtiger_schedular_relations SET 
		schedular_relmodule_filterfields = ?, 
		schedular_relmodule_retfields = ?, 
		schedular_filterrel_id = ?, 
		schedular_filterrel_field = ? WHERE schedular_relid = ?", 
			array(
				$data['filterFields'], 
				$data['returnFields'], 
				$data['inclRelId'], 
				$data['inclRelFiltField'], 
				$data['relationId']
				)
		);

	if ($adb->getAffectedRowCount($r) == 1) {
		echo 'true';
	}  else {
		echo 'false';
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'createEvent') {
	global $current_user, $adb;
	require_once('modules/Schedular/Schedular.php');
	$data = json_decode($_REQUEST['data'], true);

	$s = new Schedular();
	$s->mode = 'create';
	$s->column_fields['created_user_id'] = $current_user->id;
	$s->column_fields['createdtime'] = date('Y-m-d H:i:s');
	$s->column_fields['modifiedtime'] = date('Y-m-d H:i:s');

	foreach ($data as $cf => $value) {
		$s->column_fields[$cf] = $value;
	}

	$handler = vtws_getModuleHandlerFromName('Schedular', $current_user);
	$meta = $handler->getMeta();
	$s->column_fields = DataTransform::sanitizeRetrieveEntityInfo($s->column_fields, $meta);	

	$s->save('Schedular');

	$r = $adb->pquery("SELECT vtiger_schedular_eventcolors.eventtype_bgcolor 
		FROM vtiger_schedular_eventcolors INNER JOIN vtiger_schedular_eventtype 
		ON vtiger_schedular_eventcolors.eventtype_id=vtiger_schedular_eventtype.schedular_eventtypeid 
		WHERE vtiger_schedular_eventtype.schedular_eventtype = ?", array($s->column_fields['schedular_eventtype']));
	$bgColor = $adb->query_result($r, 0, 'eventtype_bgcolor');

	$s->column_fields['id'] = $s->id;
	$s->column_fields['bgcolor'] = $bgColor;

	$new_event = array(
			'creation' => 'success',
			'event' => $s->column_fields
		);
	echo json_encode($new_event);
}