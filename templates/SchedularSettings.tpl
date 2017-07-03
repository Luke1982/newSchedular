{* {include file="modules/Schedular/SchedularComponents.tpl"} *}
{* <link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-radio.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-tabs.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-button.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-checkbox.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-notify.css">
 *}
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/Schedular.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/salesforce-lightning-design-system.min.css">
<script type="text/javascript" src="modules/Schedular/lib/js/SchedularSettings.js"></script>
<script type="text/javascript" src="modules/Schedular/lib/js/colorpicker.min.js"></script>
<div style="padding: 2%;">
	<div class="slds-tabs_scoped">
		<ul class="slds-tabs_scoped__nav" role="tablist">
			<li class="slds-tabs_scoped__item slds-is-active" title="{$MOD.resources}" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-scoped-1" id="tab-scoped-1__item">{$MOD.resources}</a>
			</li>
			<li class="slds-tabs_scoped__item" title="{$MOD.schedular_eventtype}" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-2" id="tab-scoped-2__item">{$MOD.schedular_eventtype}</a>
			</li>
			<li class="slds-tabs_scoped__item" title="{$MOD.relations}" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-3" id="tab-scoped-3__item">{$MOD.relations}</a>
			</li>
			<li class="slds-tabs_scoped__item" title="{$MOD.general_settings}" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-4" id="tab-scoped-4__item">{$MOD.general_settings}</a>
			</li>
		</ul>
		<div id="tab-scoped-1" class="slds-tabs_scoped__content slds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item">
			<div class="slds-form slds-form_stacked">
				<fieldset class="slds-form-element">
					<legend class="slds-form-element__legend slds-form-element__label">{$MOD.av_users}</legend>
					<div class="slds-form-element__control">
						<div class="slds-checkbox_button-group">
							{foreach from=$av_users item='av_user'}
							<span class="slds-button slds-checkbox_button">
								<input id="user-{$av_user.id}" name="checkbox" type="checkbox" class="available-users__checkbox"{if $av_user.selected == true}checked="checked"{/if}>
								<label class="slds-checkbox_button__label" for="user-{$av_user.id}">
									<span class="slds-checkbox_faux">{$av_user.first_name}&nbsp;{$av_user.last_name}</span>
								</label>
							</span>
							{/foreach}
						</div>
					</div>
				</fieldset>
				<fieldset class="slds-form-element">
					<button class="slds-button slds-button_brand" id="save-available-users">
						<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#database"></use>
						</svg>{$MOD.save_users}</button>
				</fieldset>
			</div>
		</div>
		<div id="tab-scoped-2" class="slds-tabs_scoped__content slds-hide" role="tabpanel" aria-labelledby="tab-scoped-2__item">
			{foreach from=$event_types item=event_type key=key name=name}
			<div class="event-type__content">
				<div class="slds-form slds-form_stacked">
					<div class="slds-form-element">
						<h2>{$event_type.schedular_eventtype|@getTranslatedString:'Schedular'}</h2>
					</div>
					<div class="slds-form-element">
						<label class="slds-form-element__label" for="event-bgcolor-{$event_type.schedular_eventtypeid}">{$MOD.background_color}</label>
						<div class="slds-form-element__control">
						      <input style="background-color: {if isset($event_type.eventtype_bgcolor)}{$event_type.eventtype_bgcolor}{/if};" readonly value="{if isset($event_type.eventtype_bgcolor)}{$event_type.eventtype_bgcolor}{/if}" id="event-bgcolor-{$event_type.schedular_eventtypeid}" class="slds-input event-type__background-color" placeholder="Kleur" type="text">
						      <div class="event-type__colorpicker">
							      <div class="event-type__colorpicker-picker"></div>
							      <div class="event-type__colorpicker-slider"></div>
						      </div>
						</div>
					</div>
				</div>
			</div>
			{/foreach}
			<button class="slds-button slds-button_brand" id="save-event-settings">
				<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
					<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#database"></use>
				</svg>{$MOD.save_eventsettings}
			</button>					
		</div>
		<div id="tab-scoped-3" class="slds-tabs_scoped__content slds-hide" role="tabpanel" aria-labelledby="tab-scoped-3__item">
			<div class="slds-form slds-form_stacked" style="margin: 10px 0;">
				<div class="slds-form-element">
				<label class="slds-form-element__label" for="select-module-to-relate">{$MOD.select_module}</label>
					<div class="slds-form-element__control">
						<div class="slds-select_container">
							<select class="slds-select" id="select-module-to-relate">
								{foreach from=$ent_modules item=module key=key}
								<option value={$module.name}>{$module.name|@getTranslatedString}</option>
								{/foreach}
							</select>
						</div>
					</div>
				</div>
				<button class="slds-button slds-button_brand" id="create-relation">
					<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
						<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#database"></use>
					</svg>{$MOD.add_relation}
				</button>
			</div>
			<div id="schedular-relations">
			{* <pre>{$schedular_relations|print_r}</pre> *}
			{foreach from=$schedular_relations item=relation key=key}
				{* Removed to support Smarty 2 *}
				{* {call relationcard template='false' relation=$relation} *}
				<article class="slds-card schedular-relation" id="relation-{$relation.schedular_relid}" data-modulename="{$relation.schedular_relmodule_name}">
					<div class="slds-card__header slds-grid">
						<header class="slds-media slds-media_center slds-has-flexi-truncate">
							<div class="slds-media__figure">
								<span class="slds-icon_container slds-icon-standard-contact" title="">
									<svg class="slds-icon slds-icon_small" aria-hidden="true">
										<use xlink:href="include/LD/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
									</svg>
								</span>
							</div>
							<div class="slds-media__body">
								<h2>
									<span class="slds-text-heading_small"><span class="schedular-relation__id">{$relation.schedular_relid}</span>&nbsp;<span class="schedular-relation__module-name">{$relation.schedular_relmodule_name}</span></span>
								</h2>
							</div>
						</header>
						<div class="slds-no-flex">
							<button class="slds-button slds-button_neutral schedular-relation__remove">Remove</button>
							<button class="slds-button slds-button_neutral schedular-relation__update">Update</button>
						</div>
					</div>
					<div class="slds-card__body slds-card__body_inner">
						<div class="slds-form slds-form_horizontal">
							<div class="slds-form-element">
								<label class="slds-form-element__label" for="text-input-id-1">{$MOD.filter_fields}</label>
								<div class="slds-form-element__control">
									<input id="" class="slds-input relation__filterfields" placeholder="Enter comma separated search fields" type="text" value="{$relation.schedular_relmodule_filterfields}">
								</div>
							</div>
							<div class="slds-form-element">
								<label class="slds-form-element__label" for="text-input-id-1">{$MOD.return_fields}</label>
								<div class="slds-form-element__control">
									<input id="" class="slds-input relation__retfields" placeholder="Enter comma separated return fields" type="text" value="{$relation.schedular_relmodule_retfields}">
								</div>
							</div>
							<div class="slds-form-element">
								<label class="slds-form-element__label" for="text-input-id-1">{$MOD.include_relation_id}</label>
								<div class="slds-form-element__control">
									<input id="" class="slds-input relation__include-id" placeholder="Enter relation ID you want to include in the search" type="text" value="{$relation.schedular_filterrel_id}">
								</div>
							</div>
							<div class="slds-form-element">
								<label class="slds-form-element__label" for="text-input-id-1">{$MOD.relation_filterfield}</label>
								<div class="slds-form-element__control">
									<input id="" class="slds-input relation__included-rel-filterfield" placeholder="Filter field for the included relation's CRM ID" type="text" value="{$relation.schedular_filterrel_field}">
								</div>
							</div>
						</div>
					</div>
					<footer class="slds-card__footer"></footer>
				</article>
			{/foreach}
			</div>
		</div>
		<div id="tab-scoped-4" class="slds-tabs_scoped__content slds-hide" role="tabpanel" aria-labelledby="tab-scoped-4__item">
			<div class="slds-form slds-form_stacked" style="margin: 10px 0;">
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="select-module-to-relate">{$MOD.business_hours_start}</label>
					<div class="slds-form-element__control">
						<input id="business-hours-start" class="slds-input" value="{$general_settings.business_hours_start}" placeholder="{$MOD.business_hours_start}" type="text">
					</div>
				</div>
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="select-module-to-relate">{$MOD.business_hours_end}</label>
					<div class="slds-form-element__control">
						<input id="business-hours-end" class="slds-input" value="{$general_settings.business_hours_end}" placeholder="{$MOD.business_hours_end}" type="text">
					</div>
				</div>
				<button class="slds-button slds-button_brand" id="save-general-settings">
					<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
						<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#database"></use>
					</svg>{$MOD.save_general_settings}
				</button>
			</div>
		</div>
	</div>
	<!-- Relation card template -->
	{* Call removed to support Smarty 2 *}
	{* {call relationcard template='true'} *}
	<article class="slds-card schedular-relation" id="relation-template" style="display: none;">
		<div class="slds-card__header slds-grid">
			<header class="slds-media slds-media_center slds-has-flexi-truncate">
				<div class="slds-media__figure">
					<span class="slds-icon_container slds-icon-standard-contact" title="">
						<svg class="slds-icon slds-icon_small" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
						</svg>
					</span>
				</div>
				<div class="slds-media__body">
					<h2>
						<span class="slds-text-heading_small"><span class="schedular-relation__id">{$relation.schedular_relid}</span>&nbsp;<span class="schedular-relation__module-name">{$relation.schedular_relmodule_name}</span></span>
					</h2>
				</div>
			</header>
			<div class="slds-no-flex">
				<button class="slds-button slds-button_neutral schedular-relation__remove">Remove</button>
				<button class="slds-button slds-button_neutral schedular-relation__update">Update</button>
			</div>
		</div>
		<div class="slds-card__body slds-card__body_inner">
			<div class="slds-form slds-form_horizontal">
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="text-input-id-1">{$MOD.filter_fields}</label>
					<div class="slds-form-element__control">
						<input id="" class="slds-input relation__filterfields" placeholder="Enter comma separated search fields" type="text" value="{$relation.schedular_relmodule_filterfields}">
					</div>
				</div>
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="text-input-id-1">{$MOD.return_fields}</label>
					<div class="slds-form-element__control">
						<input id="" class="slds-input relation__retfields" placeholder="Enter comma separated return fields" type="text" value="{$relation.schedular_relmodule_retfields}">
					</div>
				</div>
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="text-input-id-1">{$MOD.include_relation_id}</label>
					<div class="slds-form-element__control">
						<input id="" class="slds-input relation__include-id" placeholder="Enter relation ID you want to include in the search" type="text" value="{$relation.schedular_filterrel_id}">
					</div>
				</div>
				<div class="slds-form-element">
					<label class="slds-form-element__label" for="text-input-id-1">{$MOD.relation_filterfield}</label>
					<div class="slds-form-element__control">
						<input id="" class="slds-input relation__included-rel-filterfield" placeholder="Filter field for the included relation's CRM ID" type="text" value="{$relation.schedular_filterrel_field}">
					</div>
				</div>
			</div>
		</div>
		<footer class="slds-card__footer"></footer>
	</article>
	<!-- // Relation card template -->
	<!-- Toasts -->
	<div id="toast" style="display: none;">
		<div class="slds-notify_container">
			<div class="slds-notify slds-notify_toast slds-theme_TOASTTYPE" role="alert">
				<span class="slds-assistive-text">TOASTTYPE</span>
				<span class="slds-icon_container slds-icon-utility-TOASTTYPE slds-m-right_small slds-no-flex slds-align-top" title="Description of icon when needed">
					<svg class="slds-icon slds-icon_small" aria-hidden="true">
						<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#TOASTTYPE"></use>
					</svg>
				</span>
				<div class="slds-notify__content">
					<h2 class="slds-text-heading_small" id="toasttext"></h2>
				</div>
				<button class="slds-button slds-button_icon slds-notify__close slds-button_icon-inverse" title="Close" id="close-toast">
					<svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
						<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
					</svg>
					<span class="slds-assistive-text">Close</span>
				</button>
			</div>
		</div>
	</div>
	<!-- // Toasts -->
	<!-- Hidden lang DIV -->
	<div style="display: none;">
		<div id="toast-message__users-saved">{$MOD.toast_users_saved}</div>
		<div id="toast-message__event-types-saved">{$MOD.toast_eventtypes_saved}</div>
		<div id="toast-message__relation-updated">{$MOD.toast_relation_updated}</div>
		<div id="toast-message__relation-exists">{$MOD.toast_relation_exists}</div>
		<div id="toast-message__relation-removed">{$MOD.toast_relation_removed}</div>
		<div id="toast-message__general-settings-saved">{$MOD.toast_general_settings_saved}</div>
	</div>
	<!-- // Hidden lang DIV -->
</div>
<script type="text/javascript">
{literal}
	window.addEventListener("load", function(){
		var tabHeads = document.getElementsByClassName("slds-tabs_scoped__item");
		var tabs = document.getElementsByClassName("slds-tabs_scoped__content");
		for (var i = 0; i < tabHeads.length; i++) {
			(function(_i){
				tabHeads[_i].addEventListener("click", function(e){
					setActive(_i);
				});
			})(i);
		}
		function setActive(t) {
			for (var i = 0; i < tabHeads.length; i++) {
				tabHeads[i].classList.remove("slds-is-active");
				tabs[i].classList.remove("slds-show");
				tabs[i].classList.add("slds-hide");
			}
			tabHeads[t].classList.add("slds-is-active");
			tabs[t].classList.remove("slds-hide");
			tabs[t].classList.add("slds-show");
		}

		var colorPickers = document.getElementsByClassName("event-type__colorpicker-picker");
		var colorSliders = document.getElementsByClassName("event-type__colorpicker-slider");
		var bgColorInputs = document.getElementsByClassName("event-type__background-color");
		for (var i = 0; i < colorPickers.length; i++) {
			(function(_i){
		        ColorPicker(colorSliders[_i], colorPickers[_i], function(hex, hsv, rgb) {
	        		bgColorInputs[_i].value = hex;
	        		bgColorInputs[_i].style.backgroundColor = hex;
	        	});
        	})(i);
		}
	});
{/literal}
</script>