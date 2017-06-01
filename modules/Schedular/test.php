<?php

// $_REQUEST['functiontocall'] = 'getFieldAutocomplete';

// $_REQUEST['searchinmodule'] = 'Contacts';
// $_REQUEST['fields'] = 'firstname';
// $_REQUEST['returnfields'] = 'firstname,lastname,account_name';
// $_REQUEST['limit'] = 5;
// $_REQUEST['filter'] = array(
// 		'logic' => 'and',
// 		'filters' => array(
// 				array(
// 					'value' => 'Harry',
// 					'operator' => 'startswith',
// 					'field' => 'firstname',
// 					'ignoreCase' => true
// 					)
// 			)
// 	);


// echo "<pre>";
// print_r($_REQUEST['filter']);
// echo "</pre>";

// require_once('modules/Vtiger/ExecuteFunctions.php');

require_once('modules/Accounts/Accounts.php');
$acc = new Accounts();
echo $acc->table_name;