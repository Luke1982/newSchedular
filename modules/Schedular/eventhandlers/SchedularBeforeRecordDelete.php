<?php
Class SchedularBeforeRecordDelete extends VTEventHandler {

	public function handleEvent($eventName, $entityData){
		ob_start(); // Output to buffer so AJAX calls from Schedular are not polluted

		if ($entityData->getModuleName() == 'Schedular') {
			global $current_user, $adb, $log;

			$sch_id = $entityData->getId();
			$r = $adb->pquery("SELECT * FROM vtiger_crmentityrel WHERE crmid = ?", array($sch_id));
			
			while ($related_record = $adb->fetch_array($r)) {
				require_once('modules/' . $related_record['relmodule'] . '/' . $related_record['relmodule'] . '.php');
				$rec = new $related_record['relmodule']();
				$rec->retrieve_entity_info($related_record['relcrmid'], $related_record['relmodule']);
				$rec->id = $related_record['relcrmid'];
				$rec->mode = 'edit';

				if (file_exists('modules/Schedular/eventhandlers/modules_beforerecorddelete/for' . $related_record['relmodule'] . '.php')) {
					include('modules/Schedular/eventhandlers/modules_beforerecorddelete/for' . $related_record['relmodule'] . '.php');
				}

				$handler = vtws_getModuleHandlerFromName($related_record['relmodule'], $current_user);
				$meta = $handler->getMeta();
				$rec->column_fields = DataTransform::sanitizeRetrieveEntityInfo($rec->column_fields, $meta);

				$_REQUEST['ajxaction'] = '';
				$_REQUEST['action'] = $related_record['relmodule'] . 'Ajax';
				$rec->save($related_record['relmodule']);
			}
		}

		ob_end_clean();

	}

}