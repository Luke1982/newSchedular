<?php
/*+**********************************************************************************
 * The contents of this file are subject to the coreBOS CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  MajorLabel
 * The Initial Developer of the Original Code is MajorLabel.
 * All Rights Reserved.
 ************************************************************************************/
if (isset($_REQUEST['function']) && $_REQUEST['function'] == 'getevents') {
	// global $adb;
	// $r = $adb->pquery("SELECT * FROM vtiger_schedular WHERE schedular_starttime > ? AND schedular_endttime < ?", array($_REQUEST['starttime'], $_REQUEST['endtime']));
	// $events = array();
	// while ($event = $adb->fetch_array($r)) {
	// 	$events[] = $event;
	// }
	// echo json_encode($events);
	echo strtotime($_REQUEST['starttime']);
	echo $_REQUEST['endtime'];
}