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
	<div class="slds-form slds-form_horizontal">
		<div class="slds-form-element">
			<label class="slds-form-element__label" for="input-id-01">Title</label>
			<div class="slds-form-element__control">
				<input id="input-id-01" class="slds-input" placeholder="Placeholder Text" type="text">
			</div>
		</div>
		<div class="slds-form-element">
			<label class="slds-form-element__label" for="input-id-02">Textarea Label</label>
			<div class="slds-form-element__control">
				<textarea id="input-id-02" class="slds-textarea" placeholder="Placeholder Text"></textarea>
			</div>
		</div>
		<fieldset class="slds-form-element">
			<legend class="slds-form-element__legend slds-form-element__label">Checkbox Group label</legend>
			<div class="slds-form-element__control">
				<span class="slds-checkbox">
					<input name="default" id="checkbox-285" type="checkbox">
					<label class="slds-checkbox__label" for="checkbox-285">
						<span class="slds-checkbox_faux"></span>
						<span class="slds-form-element__label">All opportunities owned by you</span>
					</label>
				</span>
				<span class="slds-checkbox">
					<input name="default" id="checkbox-286" type="checkbox">
					<label class="slds-checkbox__label" for="checkbox-286">
						<span class="slds-checkbox_faux"></span>
						<span class="slds-form-element__label">All contacts in the account owned by you</span>
					</label>
				</span>
			</div>
		</fieldset>
		<fieldset class="slds-form-element">
			<legend class="slds-form-element__legend slds-form-element__label">Checkbox Group label</legend>
			<div class="slds-form-element__control">
				<span class="slds-radio">
					<input id="radio-287" name="options" type="radio">
					<label class="slds-radio__label" for="radio-287">
						<span class="slds-radio_faux"></span>
						<span class="slds-form-element__label">Lead Generation</span>
					</label>
				</span>
				<span class="slds-radio">
					<input id="radio-288" name="options" type="radio">
					<label class="slds-radio__label" for="radio-288">
						<span class="slds-radio_faux"></span>
						<span class="slds-form-element__label">Education Leads</span>
					</label>
				</span>
			</div>
		</fieldset>
		<fieldset class="slds-form-element">
			<label class="slds-form-element__label" for="select-01">Select Label</label>
			<div class="slds-form-element__control">
				<div class="slds-select_container">
					<select class="slds-select" id="select-01">
						<option>Option One</option>
						<option>Option Two</option>
						<option>Option Three</option>
					</select>
				</div>
			</div>
		</fieldset>
	</div>
</div>
<!-- // Add / Edit Event UI -->
<script type="text/javascript" src="modules/Schedular/Schedular.js"></script>