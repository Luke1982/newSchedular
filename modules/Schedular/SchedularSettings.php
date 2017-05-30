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

$smarty->assign('av_users', $users);
$smarty->assign('MOD',$mod_strings);
$smarty->display(vtlib_getModuleTemplate('Schedular','SchedularSettings.tpl'));