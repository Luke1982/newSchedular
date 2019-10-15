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

	$r = $adb->pquery("SELECT vtiger_entityname.*, vtiger_crmentityrel.relcrmid FROM vtiger_crmentityrel LEFT JOIN vtiger_entityname ON vtiger_crmentityrel.relmodule=vtiger_entityname.modulename WHERE vtiger_crmentityrel.crmid = ?", array($id));

	while ($relation = $adb->fetch_array($r)) {
		if ($relation['relcrmid'] != 0) {
			$fieldnames = explode(',', $relation['fieldname']);
			$qu = "SELECT " . $fieldnames[0] . " FROM " . $relation['tablename'] . " WHERE " . $relation['entityidfield'] . " = ?";
			$pa = array($relation['relcrmid']);
			$re = $adb->pquery($qu, $pa);
			$relation['label'] = $adb->query_result($re, 0, $fieldnames[0]);
			$relation['translatedFieldName'] = getTranslatedString(getFieldLabelFromColumnName($fieldnames[0]), $relation['modulename']);
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
		$prepared_event['eventStatus'] = $event['schedular_eventstatus'];
		$prepared_event['location'] = $event['schedular_location'];
		$prepared_event['provisional'] = $event['schedular_provisional'] == 1 ? true : false;
		$prepared_event['notify'] = $event['schedular_notify'] == 1 ? true : false;
		$prepared_event['existingRelations'] = getRelatedRecords($event['crmid']);

		if (isPermitted('Schedular', 'DetailView', $event['crmid']) == 'yes')
			$events[] = $prepared_event;
	}
	echo json_encode($events);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'getResources') {
// error_reporting(E_ALL);
// ini_set("display_errors", "on"); 
	global $adb, $current_user;
	$user_prefs = json_decode(file_get_contents('modules/Schedular/schedular_userprefs.json'), true);

	if ($user_prefs[$current_user->id]['show'] == 'onlyMine') {
		$r = $adb->pquery("SELECT id, CONCAT(first_name, ' ', last_name) AS title FROM vtiger_users WHERE id = ?", array($current_user->id));
		echo '[' . json_encode($adb->fetch_array($r)) . ']';
	} else {
		// Get the selected users
		$r = $adb->pquery("SELECT * FROM vtiger_schedularsettings WHERE schedular_settingsid = ?", array(1));
		$sel_users = explode(',', $adb->query_result($r, 0, 'schedular_available_users'));

		// Get the users
		$r = $adb->pquery("SELECT id, CONCAT(first_name, ' ', last_name) AS title FROM vtiger_users", array());
		$users = array();
		while ($user = $adb->fetch_array($r)) {
			if (in_array($user['id'], $sel_users)) {
				$users[] = $user;
			}
		}
		echo json_encode($users);
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'acRelation') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);

	$addressModules = array(
			'Accounts',
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
	if ($data['schedular_filterrel_field'] != '') {
		$selectfields .= $data['schedular_filterrel_field'] . ' AS ' . $data['schedular_filterrel_field'] . ', ';
	}
	$selectfields .= $table_index . ' AS crmid';
	$searchfield = $data['filterfields'][0];
	$custom_filters = $data['customfilters'];

	$q = "SELECT " . $selectfields . " FROM " . $table_name;

	if (in_array($searchMod, $addressModules)) {
		if ($searchMod == 'SalesOrder') {
			$address_table_prefix 		= 'vtiger_so';
			$address_ship_modulename 	= 'soship';
			$address_bill_modulename 	= 'sobill';
		} else {
			$address_table_prefix 		= $table_name;
			$address_ship_modulename 	= $single_module_name;
			$address_bill_modulename 	= $single_module_name;
		}

		$q .= " INNER JOIN " . $address_table_prefix . "shipads ON " . $table_name . "." . $table_index . "=" .  $address_table_prefix . "shipads." . $address_ship_modulename . "addressid";
		$q .= " INNER JOIN " . $address_table_prefix . "billads ON " . $table_name . "." . $table_index . "=" .  $address_table_prefix . "billads." . $address_bill_modulename . "addressid";
	}

	if ($searchMod == 'Contacts') {
		$q .= " INNER JOIN vtiger_contactaddress ON vtiger_contactdetails.contactid=vtiger_contactaddress.contactaddressid";
	}

	// join the vtiger_crmentity table and exclude deleted records
	$q .= " LEFT JOIN vtiger_crmentity ON " . $table_name . "." . $table_index . "=vtiger_crmentity.crmid";
	$q .= " WHERE (vtiger_crmentity.deleted = 0)";

	$q .= " AND (" . $searchfield . " LIKE '%" . $term . "%'";

	if (count($data['filterfields']) == 1) { $q .= ")"; } // close the condition group if only one filterfield is supplied

	if (count($data['filterfields']) > 1) {
		for ($i=0; $i < count($data['filterfields']); $i++) { 
			if ($i != 0) {$q .= " OR " . $data['filterfields'][$i] . " LIKE '%" . $term . "%'";}
			// close the condition group on the last filter
			if ($i == (count($data['filterfields']) - 1)) { $q .= ")"; }
		}
	}

	// Implement custom filters
	if (count($custom_filters) > 0 && $custom_filters[0] != '') {
		$q .= " AND (";
		for ($i=0; $i < count($custom_filters); $i++) { 
			list($column, $value) = explode('=', $custom_filters[$i]);
			$q .= $table_name . "." . $column . " = '" . $value . "'";
			if ($i < (count($custom_filters) - 1)) {
				$q .= " OR ";
			}
		}
		$q .= ")";
	}

	// echo $q;

	$r = $adb->query($q);
	
	if ($adb->getAffectedRowCount($r) > 0) {
		$results = [];
		while ($res = $adb->fetch_array($r)) {
			if ($data['schedular_filterrel_id'] != '') {
				if (in_array($res[$data['schedular_filterrel_field']], $data['relatedRecords'])) {
					$results[] = $res;
				}
			} else {
				$results[] = $res;
			}
		}
		echo json_encode($results);
	} else {
		echo '[]';
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

	foreach ($data['relToRemove'] as $rel_to_remove) {
		$r = $adb->pquery("DELETE FROM vtiger_crmentityrel WHERE crmid = ? AND module = ? AND relcrmid = ? AND relmodule = ?", array(
				$data['id'],
				'Schedular',
				$rel_to_remove['relcrmid'],
				$rel_to_remove['modulename']				
			));
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
				require_once('include/utils/utils.php');
				require_once('modules/Schedular/Schedular.php');
				$s = new Schedular();
				relateEntities($s, 'Schedular', $data['id'], $new_relation['modulename'], array($new_relation['relcrmid']));
			}
		}
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
	$r = $adb->pquery("UPDATE vtiger_schedularsettings SET schedular_available_users = ? WHERE schedular_settingsid = ?", array($data, 1));
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

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'saveGeneralSettings') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);
	$q = "UPDATE vtiger_schedularsettings SET business_hours_start = ?, business_hours_end = ?, row_height = ? WHERE schedular_settingsid = ?";
	$p = array($data['business_hours_start'], $data['business_hours_end'], $data['row_height'], 1);
	$r = $adb->pquery($q, $p);
	echo "true";
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'createRelation') {
	global $adb;
	include_once('vtlib/Vtiger/Module.php');
	$data = json_decode($_REQUEST['data'], true);

	$r = $adb->pquery("SELECT * FROM vtiger_schedular_relations WHERE schedular_relmodule_name = ?", array($data['moduleName']));
	if ($adb->getAffectedRowCount($r) > 0) {
		echo json_encode(array('result' => 'exists'));
	} else {
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

	$r = $adb->pquery("UPDATE vtiger_schedular_relations SET schedular_relmodule_filterfields = ?, schedular_relmodule_retfields = ?, schedular_filterrel_id = ?, schedular_filterrel_field = ?, schedular_customfilters = ?, schedular_fillslocation = ?, schedular_mandatory = ? WHERE schedular_relid = ?",
			array(
				$data['filterFields'],
				$data['returnFields'],
				$data['inclRelId'],
				$data['incRelFiltField'],
				$data['customFilters'],
				$data['fillslocation'],
				$data['isMandatory'],
				$data['relationId']
				)
		);

	if ($adb->getAffectedRowCount($r) == 1) {
		echo 'true';
	}  else {
		// echo 'false';
		echo '<pre>';
		var_dump($data);
		echo '</pre>';
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
	$s->column_fields['schedular_eventstatus'] = 'Planned';
	$s->column_fields['schedular_provisional'] = $data['provisional'] == true ? 1 : 0;
	$s->column_fields['schedular_notify'] = $data['notify'] == true ? 1 : 0;

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
	$s->column_fields['schedular_provisional'] = $s->column_fields['schedular_provisional'] == 1 ? true : false;
	$s->column_fields['schedular_notify'] = $s->column_fields['schedular_notify'] == 1 ? true : false;

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
				require_once('include/utils/utils.php');
				relateEntities($s, 'Schedular', $s->id, $new_relation['modulename'], array($new_relation['relcrmid']));
			}
		}
	}
	$new_event['event']['existingRelations'] = getRelatedRecords($s->column_fields['id']);
	echo json_encode($new_event);
	// var_dump($data);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'deleteEvent') {
	global $current_user, $adb;

	require_once('modules/Schedular/Schedular.php');
	$data = json_decode($_REQUEST['data'], true);

	$s = new Schedular();
	$s->mode = 'edit';
	$s->trash('Schedular', $data['id']);

	if ($s->id == NULL) {
		$result = array(
			'deleteResult' => true,
			'remainingCount' => $_REQUEST['remaining_schedular_count'],
		);
		echo json_encode($result);
	} else {
		echo "false";
	}
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'getEventDBInfo') {
	global $adb;
	$data = json_decode($_REQUEST['data'], true);

	$r = $adb->pquery("SELECT * FROM vtiger_schedular WHERE schedularid = ?", array($data['id']));
	echo json_encode($adb->fetch_array($r));
	// var_dump($data);
}

if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'saveUserPrefs') {
	global $current_user;

	$data = json_decode($_REQUEST['data'], true);

	$user_prefs = json_decode(file_get_contents('modules/Schedular/schedular_userprefs.json'), true);

	if ($data['currentView'] != '') {
		$user_prefs[$current_user->id]['preferredView'] = $data['currentView'];
	}
	if ($data['show'] != '') {
		$user_prefs[$current_user->id]['show'] = $data['show'];
	}
	file_put_contents('modules/Schedular/schedular_userprefs.json', json_encode($user_prefs));
}