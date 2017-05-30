<?php

// Get the users
$r = $adb->pquery("SELECT id, first_name, last_name FROM vtiger_users", array());
$users = array();
while ($user = $adb->fetch_array($r)) {
	$users[] = $user;
}
// Get the currently selected user
$r = $adb->pquery("SELECT schedular_available_users FROM vtiger_schedularsettings WHERE schedular_settingsid = ?", array(1));
$sel_users = explode(',', $adb->query_result($r, 0, 'schedular_available_users'));

foreach ($users as $key => $user) {
	if (in_array($user['id'], $sel_users)) {
		$users[$key]['selected'] = true;
	}
}

// Get the event types
$r = $adb->pquery("SELECT * FROM vtiger_schedular_eventtype INNER JOIN vtiger_schedular_eventcolors ON vtiger_schedular_eventtype.schedular_eventtypeid=vtiger_schedular_eventcolors.eventtype_id", array());
$event_types = array();
while ($event_type = $adb->fetch_array($r)) {
	$event_types[] = $event_type;
}

$smarty->assign('av_users', $users);
$smarty->assign('event_types', $event_types);
$smarty->assign('MOD',$mod_strings);
$smarty->display(vtlib_getModuleTemplate('Schedular','SchedularSettings.tpl'));