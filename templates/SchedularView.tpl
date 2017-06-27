{include file="modules/Schedular/SchedularComponents.tpl"}
{* <link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-button.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-icon.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-combobox.css"> *}
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/salesforce-lightning-design-system.min.css">
<div id="schedular" style="min-height: 500px;"></div>
<!-- Data DIV's -->
<div style="display: none;">
	{foreach from=$resource_users item=user key=key}
	<div class="resource resource__user">
		<div class="resource__id">{$user.id}</div>
		<div class="resource__name">{$user.first_name} {$user.last_name}</div>
	</div>
	{/foreach}
</div>
<!-- // Data DIV's -->
<!-- Add / Edit Event UI -->
<div id="schedular-event-ui">
	<div id="schedular-event-ui__draghandle">{$MOD.clicktodrag}</div>
	<div class="slds-form slds-form_horizontal">
		<fieldset class="slds-form-element">
			<table width="100%" style="color: #54698d;">
				<tbody>
					<tr style="font-weight: bold;">
						<td width="25%">{$MOD.startdate}</td>
						<td width="25%">{$MOD.starttime}</td>
						<td width="25%">{$MOD.enddate}</td>
						<td width="25%">{$MOD.endtime}</td>
					</tr>
					<tr>
						<td width="25%" id="schedular-event-ui__startdate"></td>
						<td width="25%" id="schedular-event-ui__starttime"></td>
						<td width="25%" id="schedular-event-ui__enddate"></td>
						<td width="25%" id="schedular-event-ui__endtime"></td>
					</tr>
					<tr style="font-weight: bold;">
						<td width="25%">{$MOD.resource}</td>
						<td width="25%"></td>
						<td width="25%"></td>
						<td width="25%"></td>
					</tr>
					<tr>
						<td width="25%" id="schedular-event-ui__resourcename"></td>
						<td width="25%"></td>
						<td width="25%"></td>
						<td width="25%"></td>
					</tr>										
				</tbody>
			</table>
		</fieldset>
		<div class="slds-form-element">
			<label class="slds-form-element__label" for="schedular_name">{$MOD.title}</label>
			<div class="slds-form-element__control">
				<input id="schedular_name" name="schedular_name" class="slds-input" placeholder="Placeholder Text" type="text">
			</div>
		</div>
		<div class="slds-form-element">
			<label class="slds-form-element__label" for="schedular_description">{$MOD.description}</label>
			<div class="slds-form-element__control">
				<textarea id="schedular_description" class="slds-textarea" placeholder="Description"></textarea>
			</div>
		</div>		
		<fieldset class="slds-form-element">
			<label class="slds-form-element__label" for="select-01">{$MOD.schedular_eventtype}</label>
			<div class="slds-form-element__control">
				<div class="slds-select_container">
					<select class="slds-select" id="event-types">
						{foreach from=$event_types item=event_type key=key}
						<option value="{$event_type.schedular_eventtype}">{$event_type.schedular_eventtype|@getTranslatedString:'Schedular'}</option>
						{/foreach}
					</select>
				</div>
			</div>
		</fieldset>
		{foreach from=$relations item=relation key=key name=name}
			{call name=relationautocomplete relation=$relation}
		{/foreach}
{* 		<fieldset class="slds-form-element">
			<label class="slds-form-element__label" for="schedular_description">Description</label>
			<div class="slds-form-element__control">
				<textarea id="schedular_description" class="slds-textarea" placeholder="Description"><pre>{$relations|print_r}</pre></textarea>
			</div>
		</fieldset>	 *}		
		<fieldset class="slds-form-element">
			<div class="slds-button-group" role="group">
				<button class="slds-button slds-button_neutral" id="sch-save-event-ui">{$MOD.save}</button>
				<button class="slds-button slds-button_neutral" id="sch-cancel-event-ui">{$MOD.cancel}</button>
			</div>
		</fieldset>
	</div>
	<!-- Hidden div that holds all the data to save -->
	<div id="schedular-savedata">
		<input type="hidden" id="sch-startdate" data-columnfield="schedular_startdate" value="" />
		<input type="hidden" id="sch-starttime" data-columnfield="schedular_starttime" value="" />
		<input type="hidden" id="sch-enddate" data-columnfield="schedular_enddate" value="" />
		<input type="hidden" id="sch-endtime" data-columnfield="schedular_endtime" value="" />
		<input type="hidden" id="sch-assignedto" data-columnfield="assigned_user_id" value="" />
		<input type="hidden" id="sch-description" data-columnfield="description" value="" />
		<input type="hidden" id="sch-eventtype" data-columnfield="schedular_eventtype" value="" />
		<input type="hidden" id="sch-id" data-columnfield="schedularid" value="" />
		<input type="hidden" id="sch-name" data-columnfield="schedular_name" value="" />
	</div>
	<!-- // Hidden div that holds all the data to save -->
</div>
<!-- // Add / Edit Event UI -->
<script type="text/javascript" src="modules/Schedular/Schedular.js"></script>