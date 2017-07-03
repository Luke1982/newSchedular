<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/
// include_once('modules/Vtiger/ListView.php');
global $app_strings, $mod_strings, $current_language, $adb;

// Get the selected users
$r = $adb->pquery("SELECT * FROM vtiger_schedularsettings WHERE schedular_settingsid = ?", array(1));
// Get the rest of the settings from the previous query
$general_settings = $adb->fetch_array($r);
$sel_users = explode(',', $adb->query_result($r, 0, 'schedular_available_users'));

// Get the users
$r = $adb->pquery("SELECT id, first_name, last_name FROM vtiger_users", array());
$users = array();
while ($user = $adb->fetch_array($r)) {
	if (in_array($user['id'], $sel_users)) {
		$users[] = $user;
	}
}

// Get the event types
$r = $adb->pquery("SELECT * FROM vtiger_schedular_eventtype", array());
$event_types = array();
while ($eventtype = $adb->fetch_array($r)) {
	$event_types[] = $eventtype;
}

// Get the relations
$r = $adb->pquery("SELECT * FROM vtiger_schedular_relations", array());
$relations = array();
while ($relation = $adb->fetch_array($r)) {
	$relation['filterfields'] = explode(',', $relation['schedular_relmodule_filterfields']);
	$relation['returnfields'] = explode(',', $relation['schedular_relmodule_retfields']);
	$relation['json'] = json_encode($relation);
	$relations[] = $relation;
}

$smarty->assign('MOD', $mod_strings);
$smarty->assign('APP', $app_strings);

$smarty->assign('relations', $relations);
$smarty->assign('resource_users', $users);
$smarty->assign('event_types', $event_types);
$smarty->assign('general_settings', $general_settings);
$smarty->display('modules/Schedular/SchedularView.tpl');
?>