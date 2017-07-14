<?php
/*+**********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ************************************************************************************/
require_once('data/CRMEntity.php');
require_once('data/Tracker.php');

class Schedular extends CRMEntity {
	var $db, $log; // Used in class functions of CRMEntity

	var $table_name = 'vtiger_schedular';
	var $table_index= 'schedularid';
	var $column_fields = Array();

	/** Indicator if this is a custom module or standard module */
	var $IsCustomModule = true;
	var $HasDirectImageField = false;
	/**
	 * Mandatory table for supporting custom fields.
	 */
	var $customFieldTable = Array('vtiger_schedularcf', 'schedularid');
	// related_tables variable should define the association (relation) between dependent tables
	// FORMAT: related_tablename => Array ( related_tablename_column[, base_tablename, base_tablename_column] )
	// Here base_tablename_column should establish relation with related_tablename_column
	// NOTE: If base_tablename and base_tablename_column are not specified, it will default to modules (table_name, related_tablename_column)
	// Uncomment the line below to support custom field columns on related lists
	// var $related_tables = Array('vtiger_payslipcf'=>array('payslipid','vtiger_payslip', 'payslipid'));

	/**
	 * Mandatory for Saving, Include tables related to this module.
	 */
	var $tab_name = Array('vtiger_crmentity', 'vtiger_schedular', 'vtiger_schedularcf');

	/**
	 * Mandatory for Saving, Include tablename and tablekey columnname here.
	 */
	var $tab_name_index = Array(
		'vtiger_crmentity' => 'crmid',
		'vtiger_schedular'   => 'schedularid',
		'vtiger_schedularcf' => 'schedularid');

	/**
	 * Mandatory for Listing (Related listview)
	 */
	var $list_fields = Array (
		/* Format: Field Label => Array(tablename => columnname) */
		// tablename should not have prefix 'vtiger_'
		'schedular_no'=> Array('schedular' => 'schedular_no'),
		'Assigned To' => Array('crmentity' => 'smownerid')
	);
	var $list_fields_name = Array(
		/* Format: Field Label => fieldname */
		'schedular_no'=> 'schedular_no',
		'Assigned To' => 'assigned_user_id'
	);

	// Make the field link to detail view from list view (Fieldname)
	var $list_link_field = 'schedular_no';

	// For Popup listview and UI type support
	var $search_fields = Array(
		/* Format: Field Label => Array(tablename => columnname) */
		// tablename should not have prefix 'vtiger_'
		'schedular_no'=> Array('schedular' => 'schedular_no')
	);
	var $search_fields_name = Array(
		/* Format: Field Label => fieldname */
		'schedular_no'=> 'schedular_no'
	);

	// For Popup window record selection
	var $popup_fields = Array('schedular_no');

	// Placeholder for sort fields - All the fields will be initialized for Sorting through initSortFields
	var $sortby_fields = Array();

	// For Alphabetical search
	var $def_basicsearch_col = 'schedular_no';

	// Column value to use on detail view record text display
	var $def_detailview_recname = 'schedular_no';

	// Required Information for enabling Import feature
	var $required_fields = Array('schedular_no'=>1);

	// Callback function list during Importing
	var $special_functions = Array('set_import_assigned_user');

	var $default_order_by = 'schedular_no';
	var $default_sort_order='ASC';
	// Used when enabling/disabling the mandatory fields for the module.
	// Refers to vtiger_field.fieldname values.
	var $mandatory_fields = Array('createdtime', 'modifiedtime', 'schedular_no');

	function __construct() {
		global $log;
		$this_module = get_class($this);
		$this->column_fields = getColumnFields($this_module);
		$this->db = PearDatabase::getInstance();
		$this->log = $log;
		$sql = 'SELECT 1 FROM vtiger_field WHERE uitype=69 and tabid = ? limit 1';
		$tabid = getTabid($this_module);
		$result = $this->db->pquery($sql, array($tabid));
		if ($result and $this->db->num_rows($result)==1) {
			$this->HasDirectImageField = true;
		}
	}

	function save_module($module) {
		if ($this->HasDirectImageField) {
			$this->insertIntoAttachment($this->id,$module);
		}
	}

	/**
	 * Apply security restriction (sharing privilege) query part for List view.
	 */
	function getListViewSecurityParameter($module) {
		global $current_user;
		require('user_privileges/user_privileges_'.$current_user->id.'.php');
		require('user_privileges/sharing_privileges_'.$current_user->id.'.php');

		$sec_query = '';
		$tabid = getTabid($module);

		if($is_admin==false && $profileGlobalPermission[1] == 1 && $profileGlobalPermission[2] == 1
			&& $defaultOrgSharingPermission[$tabid] == 3) {

				$sec_query .= " AND (vtiger_crmentity.smownerid in($current_user->id) OR vtiger_crmentity.smownerid IN
					(
						SELECT vtiger_user2role.userid FROM vtiger_user2role
						INNER JOIN vtiger_users ON vtiger_users.id=vtiger_user2role.userid
						INNER JOIN vtiger_role ON vtiger_role.roleid=vtiger_user2role.roleid
						WHERE vtiger_role.parentrole LIKE '".$current_user_parent_role_seq."::%'
					)
					OR vtiger_crmentity.smownerid IN
					(
						SELECT shareduserid FROM vtiger_tmp_read_user_sharing_per
						WHERE userid=".$current_user->id." AND tabid=".$tabid."
					)
					OR (";

					// Build the query based on the group association of current user.
					if(sizeof($current_user_groups) > 0) {
						$sec_query .= " vtiger_groups.groupid IN (". implode(",", $current_user_groups) .") OR ";
					}
					$sec_query .= " vtiger_groups.groupid IN
						(
							SELECT vtiger_tmp_read_group_sharing_per.sharedgroupid
							FROM vtiger_tmp_read_group_sharing_per
							WHERE userid=".$current_user->id." and tabid=".$tabid."
						)";
				$sec_query .= ")
				)";
		}
		return $sec_query;
	}

	/**
	 * Invoked when special actions are performed on the module.
	 * @param String Module name
	 * @param String Event Type (module.postinstall, module.disabled, module.enabled, module.preuninstall)
	 */
	function vtlib_handler($modulename, $event_type) {
		if($event_type == 'module.postinstall') {
			// TODO Handle post installation actions
			$this->setModuleSeqNumber('configure', $modulename, $modulename.'-', '0000001');

			global $adb;
			$adb->query("INSERT INTO vtiger_schedularsettings (schedular_settingsid, schedular_available_users, business_hours_start, business_hours_end) VALUES (1, '', '', '')");

			// Create the event handlers for linked entities
			require 'include/events/include.inc';
			$em 		= new VTEventsManager($adb);
			$eventName 	= 'corebos.entity.link.after';
			$filePath 	= 'modules/Schedular/eventhandlers/SchedularAfterLinkSave.php';
			$className 	= 'SchedularAfterLinkSave';
			$em->registerHandler($eventName, $filePath, $className);

			// Create event handlers for when a record is deleted
			$em 		= new VTEventsManager($adb);
			$eventName 	= 'vtiger.entity.beforedelete';
			$filePath 	= 'modules/Schedular/eventhandlers/SchedularBeforeRecordDelete.php';
			$className 	= 'SchedularBeforeRecordDelete';
			$em->registerHandler($eventName, $filePath, $className);
			
		} else if($event_type == 'module.disabled') {
			// TODO Handle actions when this module is disabled.
		} else if($event_type == 'module.enabled') {
			// TODO Handle actions when this module is enabled.
		} else if($event_type == 'module.preuninstall') {
			// TODO Handle actions when this module is about to be deleted.
			global $adb;
			// Delete event handler records
			$adb->pquery("DELETE FROM vtiger_eventhandlers WHERE handler_class = ?", array('SchedularAfterLinkSave'));
			$adb->pquery("DELETE FROM vtiger_eventhandlers WHERE handler_class = ?", array('SchedularBeforeRecordDelete'));
			// Delete module tables
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedularcf");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedularsettings");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_eventcolors");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_relations");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_eventstatus");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_eventstatus_seq");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_eventtype");
			$adb->query("DROP TABLE IF EXISTS vtiger_schedular_eventtype_seq");
		} else if($event_type == 'module.preupdate') {
			// TODO Handle actions before this module is updated.
			$moduleInstance = Vtiger_Module::getInstance($modulename);
			if (version_compare($moduleInstance->version, '0.3.9') == -1) {
				global $adb;
				$adb->query("ALTER TABLE vtiger_schedularsettings ADD row_height VARCHAR(56) DEFAULT NULL after business_hours_end");
			}
			if (version_compare($moduleInstance->version, '0.4.0') == -1) {
				include_once 'include/utils/utils.php';
				include_once('vtlib/Vtiger/Module.php');

				$block							= 	Vtiger_Block::getInstance('LBL_SCHEDULAR_INFORMATION', $moduleInstance);
				
				// Setup the field
				$statusField					=	new Vtiger_Field();
				$statusField->name				=	'schedular_eventstatus';
				$statusField->label				=	'schedular_eventstatus';
				$statusField->table				=	'vtiger_schedular';
				$statusField->column			=	'schedular_eventstatus';
				$statusField->columntype		=	'VARCHAR(255)';
				$statusField->uitype			=	15;
				$statusField->typeofdata		=	'V~M';
			
				$block->addField($statusField);		
				$statusField->setPicklistValues( array('Planned', 'Completed', 'Cancelled') );	
			}
			if (version_compare($moduleInstance->version, '0.4.3') == -1) {
				global $adb;
				$adb->query("ALTER TABLE vtiger_schedular_relations ADD schedular_customfilters VARCHAR(255) DEFAULT NULL after schedular_filterrel_field");
			}
			if (version_compare($moduleInstance->version, '0.4.5') == -1) {
				include_once 'include/utils/utils.php';
				include_once('vtlib/Vtiger/Module.php');

				$block						= 	Vtiger_Block::getInstance('LBL_SCHEDULAR_INFORMATION', $moduleInstance);
				
				// Setup the field
				$locField					=	new Vtiger_Field();
				$locField->name				=	'schedular_location';
				$locField->label			=	'schedular_location';
				$locField->table			=	'vtiger_schedular';
				$locField->column			=	'schedular_location';
				$locField->columntype		=	'VARCHAR(255)';
				$locField->uitype			=	1;
				$locField->typeofdata		=	'V~O';
			
				$block->addField($locField);		
			}
			if (version_compare($moduleInstance->version, '0.4.6') == -1) {
				global $adb;
				$adb->query("ALTER TABLE vtiger_schedular_relations ADD schedular_fillslocation VARCHAR(56) DEFAULT NULL after schedular_customfilters");
			}
		} else if($event_type == 'module.postupdate') {
			// TODO Handle actions after this module is updated.
			if (version_compare($moduleInstance->version, '0.4.1') == -1) {
				// Create the event handlers for linked entities
				global $adb;
				require 'include/events/include.inc';
				$em 		= new VTEventsManager($adb);
				$eventName 	= 'corebos.entity.link.after';
				$filePath 	= 'modules/Schedular/eventhandlers/SchedularAfterLinkSave.php';
				$className 	= 'SchedularAfterLinkSave';
				$em->registerHandler($eventName, $filePath, $className);	
			}
			if (version_compare($moduleInstance->version, '0.4.4') == -1) {
				// Create the event handlers for linked entities
				global $adb;
				require 'include/events/include.inc';
				$em 		= new VTEventsManager($adb);
				$eventName 	= 'vtiger.entity.beforedelete';
				$filePath 	= 'modules/Schedular/eventhandlers/SchedularBeforeRecordDelete.php';
				$className 	= 'SchedularBeforeRecordDelete';
				$em->registerHandler($eventName, $filePath, $className);	
			}
		}
	}

	/**
	 * Handle saving related module information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	// function save_related_module($module, $crmid, $with_module, $with_crmid) { }

	/**
	 * Handle deleting related module information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function delete_related_module($module, $crmid, $with_module, $with_crmid) { }

	/**
	 * Handle getting related list information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function get_related_list($id, $cur_tab_id, $rel_tab_id, $actions=false) { }

	/**
	 * Handle getting dependents list information.
	 * NOTE: This function has been added to CRMEntity (base class).
	 * You can override the behavior by re-defining it here.
	 */
	//function get_dependents_list($id, $cur_tab_id, $rel_tab_id, $actions=false) { }
}
?>
