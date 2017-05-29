<?php

// Get the users
$r = $adb->pquery("SELECT id, first_name, last_name FROM vtiger_users", array());
$users = array();
while ($user = $adb->fetch_array($r)) {
	$users[] = $user;
}

$smarty->assign('av_users', $users);
$smarty->assign('MOD',$mod_strings);
$smarty->display(vtlib_getModuleTemplate('Schedular','SchedularSettings.tpl'));