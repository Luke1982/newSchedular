<?php

// $red is the record focus
$_REQUEST['schedular_deletion'] = true;

$sch_count = $adb->query("SELECT COUNT(vtiger_crmentityrel.crmid) AS count
						  FROM vtiger_crmentityrel 
						  INNER JOIN vtiger_crmentity ce ON vtiger_crmentityrel.crmid = ce.crmid
						  INNER JOIN vtiger_schedular sch ON ce.crmid = sch.schedularid
						  WHERE relcrmid = {$rec->id}
						  AND vtiger_crmentityrel.crmid != {$sch_id}
						  AND module = 'Schedular'
						  AND ce.deleted = 0
						  AND sch.schedular_provisional != 1
						  AND sch.schedular_eventstatus != 'Cancelled'");
$sch_count = $adb->fetch_array($sch_count)['count'];
$_REQUEST['remaining_schedular_count'] = $sch_count;

if ((int) $sch_count === 0) {
	$rec->column_fields['sostatus'] = 'Created';
	$rec->column_fields['duedate'] = '';
	$rec->column_fields['reports_to_id'] = '';
} else {
	$r = $adb->query(
		"SELECT sch.schedular_startdate AS newduedate,
				ce.smownerid AS newuser
		FROM vtiger_crmentityrel 
			INNER JOIN vtiger_crmentity ce ON vtiger_crmentityrel.crmid = ce.crmid
			INNER JOIN vtiger_schedular sch ON ce.crmid = sch.schedularid
		WHERE vtiger_crmentityrel.relcrmid = {$rec->id}
		AND vtiger_crmentityrel.crmid != {$sch_id}
		AND module = 'Schedular'
		AND ce.deleted = 0
		AND sch.schedular_provisional != 1
		AND sch.schedular_eventstatus != 'Cancelled'
		ORDER BY sch.schedular_startdate ASC LIMIT 1"
	);
	$first_remaining_appointment = $adb->fetch_array($r);
	$rec->column_fields['duedate'] = $first_remaining_appointment['newduedate'];
	$rec->column_fields['reports_to_id'] = $first_remaining_appointment['newuser'];
}
