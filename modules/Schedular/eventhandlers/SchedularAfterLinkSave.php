<?php
Class SchedularAfterLinkSave extends VTEventHandler {

	public function handleEvent($eventName, $entityData){
		ob_start(); // Output to buffer so AJAX calls from Schedular are not polluted

		if ($entityData['sourceModule'] == 'Schedular') {
			global $current_user, $adb, $log;

			$source_focus = $entityData['focus'];

			require_once('modules/' . $entityData['destinationModule'] . '/' . $entityData['destinationModule'] . '.php');

			$linked_focus = new $entityData['destinationModule']();
			$linked_focus->retrieve_entity_info($entityData['destinationRecordId'], $entityData['destinationModule']);
			$linked_focus->id = $entityData['destinationRecordId'];
			$linked_focus->mode = 'edit';

			if (file_exists('modules/Schedular/eventhandlers/modules_afterlinksave/for' . $entityData['destinationModule'] . '.php')) {
				include('modules/Schedular/eventhandlers/modules_afterlinksave/for' . $entityData['destinationModule'] . '.php');
			}

			$handler = vtws_getModuleHandlerFromName($entityData['destinationModule'], $current_user);
			$meta = $handler->getMeta();
			$linked_focus->column_fields = DataTransform::sanitizeRetrieveEntityInfo($linked_focus->column_fields, $meta);

			$_REQUEST['ajxaction'] = '';
			$_REQUEST['action'] = $entityData['destinationModule'] . 'Ajax';
			$linked_focus->save($entityData['destinationModule']);

			$log->debug("Record related to a Schedular record: ");
			$log->debug($linked_focus);
		}

		ob_end_clean();

	}

}