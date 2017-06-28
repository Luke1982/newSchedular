<?php
/*+**********************************************************************************
 * The contents of this file are subject to the coreBOS CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  MajorLabel
 * The Initial Developer of the Original Code is MajorLabel.
 * All Rights Reserved.
 ************************************************************************************/

// https://gist.github.com/chaoszcat/5325115#file-gistfile1-php
function shadeColor($color, $percent) {
	$num = base_convert(substr($color, 1), 16, 10);
	$amt = round(2.55 * $percent);
	$r = ($num >> 16) + $amt;
	$b = ($num >> 8 & 0x00ff) + $amt;
	$g = ($num & 0x0000ff) + $amt;
	
	return '#'.substr(base_convert(0x1000000 + ($r<255?$r<1?0:$r:255)*0x10000 + ($b<255?$b<1?0:$b:255)*0x100 + ($g<255?$g<1?0:$g:255), 10, 16), 1);
}

function getRelatedRecords($id) {
	global $adb;
	$records = array();

	$r = $adb->pquery("SELECT vtiger_entityname.fieldname, vtiger_entityname.entityidfield, vtiger_entityname.tablename, vtiger_entityname.entityidcolumn, vtiger_entityname.modulename, vtiger_crmentityrel.relcrmid FROM vtiger_crmentityrel LEFT JOIN vtiger_entityname ON vtiger_crmentityrel.relmodule=vtiger_entityname.modulename WHERE vtiger_crmentityrel.crmid = ?", array($id));

	while ($relation = $adb->fetch_array($r)) {
		if ($relation['relcrmid'] != 0) {
			$qu = "SELECT " . $relation['fieldname'] . " FROM " . $relation['tablename'] . " WHERE " . $relation['entityidfield'] . " = ?";
			$pa = array($relation['relcrmid']);
			$re = $adb->pquery($qu, $pa);
			$relation['label'] = $adb->query_result($re, 0, $relation['fieldname']);
			$relation['translatedFieldName'] = getTranslatedString(getFieldLabelFromColumnName($relation['fieldname']), $relation['modulename']);
			$records[] = $relation;
		}
	}

	return $records;
}

function getFieldLabelFromColumnName($column_name)  {
	global $adb;
	$r = $adb->pquery("SELECT fieldlabel FROM vtiger_field WHERE columnname = ? LIMIT 1", array($column_name));
	return $adb->query_result($r, 0, 'fieldlabel');
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'translate') {
	$data = json_decode($_REQUEST['data'], true);
	echo getTranslatedString($data['label'], $data['module']);
}

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
		$prepared_event['start'] = $event['schedular_startdate'] . 'T' . $event['schedular_starttime'];
		$prepared_event['end'] = $event['schedular_enddate'] . 'T' . $event['schedular_endtime'];
		$prepared_event['title'] = $event['schedular_name'];
		$prepared_event['backgroundColor'] = $event['eventtype_bgcolor'];
		$prepared_event['borderColor'] = shadeColor($event['eventtype_bgcolor'], -40);
		$prepared_event['textColor'] = '#000000';
		$prepared_event['description'] = $event['description'];
		$prepared_event['eventType'] = $event['schedular_eventtype'];
		$prepared_event['existingRelations'] = getRelatedRecords($event['crmid']);
		$events[] = $prepared_event;
	}
	echo json_encode($events);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'acRelation') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);

	$addressModules = array(
			'Accounts',
			'Contacts',
			'Invoice',
			'SalesOrder',
			'Quotes'
		);

	$searchMod = $data['schedular_relmodule_name'];
	require_once('modules/' . $searchMod . '/' . $searchMod . '.php');

	$inst = new $searchMod();
	$table_name = $inst->table_name;
	$table_index = $inst->table_index;
	$single_module_name = str_replace('vtiger_', '', $table_name);
	$term = $data['term'];

	$selectfields = '';
	foreach ($data['returnfields'] as $returnfield) {
		$selectfields .= $returnfield . ' AS ' . $returnfield . ', ';
	}
	$selectfields .= $table_index . ' AS crmid';
	$searchfield = $data['filterfields'][0];

	$q = "SELECT " . $selectfields . " FROM " . $table_name;

	if (in_array($searchMod, $addressModules)) {
		$q .= " INNER JOIN " . $table_name . "shipads ON " . $table_name . "." . $table_index . "=" .  $table_name . "shipads." . $single_module_name . "addressid";
		$q .= " INNER JOIN " . $table_name . "billads ON " . $table_name . "." . $table_index . "=" .  $table_name . "billads." . $single_module_name . "addressid";
	}

	$q .= " WHERE " . $table_name . "." . $searchfield . " LIKE '%" . $term . "%'";

	// var_dump($q);

	$r = $adb->query($q);
	
	if ($adb->getAffectedRowCount($r) > 0) {
		$results = [];
		while ($res = $adb->fetch_array($r)) {
			$results[] = $res;
		}
		echo json_encode($results);
	} else {
		echo "[]";
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'updateEvent') {
	global $current_user, $adb;
	require_once('modules/Schedular/Schedular.php');

	$data = json_decode($_REQUEST['data'], true);

	$rec = new Schedular();
	$rec->retrieve_entity_info($data['id'], 'Schedular');
	$rec->id = $data['id'];
	$rec->mode = 'edit';

	foreach ($data['columnFields'] as $cf => $value) {
		$rec->column_fields[$cf] = $value;
	}

	foreach ($data['relations'] as $new_relation) {
		if ($new_relation != '') {
			$r = $adb->pquery("SELECT * FROM vtiger_crmentityrel WHERE crmid = ? AND module = ? AND relcrmid = ? AND relmodule = ?", array(
					$data['id'],
					'Schedular',
					$new_relation['relcrmid'],
					$new_relation['modulename']					
				));
			if ($adb->getAffectedRowCount($r) == 0) {
				$adb->pquery("INSERT INTO vtiger_crmentityrel (crmid, module, relcrmid, relmodule) VALUES (?,?,?,?)", array(
						$data['id'],
						'Schedular',
						$new_relation['relcrmid'],
						$new_relation['modulename']	
					));
			}
		}
	}

	foreach ($data['relToRemove'] as $rel_to_remove) {
		$r = $adb->pquery("DELETE FROM vtiger_crmentityrel WHERE crmid = ? AND module = ? AND relcrmid = ? AND relmodule = ?", array(
				$data['id'],
				'Schedular',
				$rel_to_remove['relcrmid'],
				$rel_to_remove['modulename']				
			));
	}

	$handler = vtws_getModuleHandlerFromName('Schedular', $current_user);
	$meta = $handler->getMeta();
	$rec->column_fields = DataTransform::sanitizeRetrieveEntityInfo($rec->column_fields, $meta);
	
	$rec->save('Schedular');

	$result = $adb->pquery("SELECT eventtype_bgcolor FROM vtiger_schedular_eventcolors INNER JOIN vtiger_schedular_eventtype ON vtiger_schedular_eventcolors.eventtype_id=vtiger_schedular_eventtype.schedular_eventtypeid WHERE vtiger_schedular_eventtype.schedular_eventtype = ?", array($rec->column_fields['schedular_eventtype']));
	$rec->column_fields['bgcolor'] = $adb->query_result($result, 0, 'eventtype_bgcolor');
	$rec->column_fields['existingRelations'] = getRelatedRecords($data['id']);
	echo json_encode($rec->column_fields);
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
				$data['incRelFiltField'], 
				$data['relationId']
				)
		);

	var_dump($data);

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

	foreach ($data['columnFields'] as $cf => $value) {
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

	foreach ($data['relations'] as $new_relation) {
		if ($new_relation != '') {
			$r = $adb->pquery("SELECT * FROM vtiger_crmentityrel WHERE crmid = ? AND module = ? AND relcrmid = ? AND relmodule = ?", array(
					$s->column_fields['id'],
					'Schedular',
					$new_relation['relcrmid'],
					$new_relation['modulename']
				));
			if ($adb->getAffectedRowCount($r) == 0) {
				$adb->pquery("INSERT INTO vtiger_crmentityrel (crmid, module, relcrmid, relmodule) VALUES (?,?,?,?)", array(
						$s->column_fields['id'],
						'Schedular',
						$new_relation['relcrmid'],
						$new_relation['modulename']
					));
			}
		}
	}
	$new_event['event']['existingRelations'] = getRelatedRecords($s->column_fields['id']);
	echo json_encode($new_event);
	// var_dump($data);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'getEventDBInfo') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);

	$r = $adb->pquery("SELECT * FROM vtiger_schedular WHERE schedularid = ?", array($data['id']));
	echo json_encode($adb->fetch_array($r));
	// var_dump($data);
}