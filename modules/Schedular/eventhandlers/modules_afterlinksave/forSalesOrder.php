<?php

// $source_focus is the originating Schedular record
// $linked_focus is the related module's record
$linked_focus->column_fields['sostatus'] = 'Ingepland';
$linked_focus->column_fields['duedate'] = $source_focus->column_fields['schedular_startdate'];
$linked_focus->column_fields['reports_to_id'] = $source_focus->column_fields['assigned_user_id'];