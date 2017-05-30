<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-radio.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-tabs.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-button.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-checkbox.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-notify.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/Schedular.css">
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
		</ul>
		<div id="tab-scoped-1" class="slds-tabs_scoped__content slds-show" role="tabpanel" aria-labelledby="tab-scoped-1__item">
			<div class="slds-form slds-form_horizontal">
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
						      <input style="background-color: {$event_type.eventtype_bgcolor};" readonly value="{$event_type.eventtype_bgcolor}" id="event-bgcolor-{$event_type.schedular_eventtypeid}" class="slds-input event-type__background-color" placeholder="Kleur" type="text">
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
				<label class="slds-form-element__label" for="select-01">{$MOD.select_module}</label>
					<div class="slds-form-element__control">
						<div class="slds-select_container">
							<select class="slds-select" id="select-01">
								{foreach from=$ent_modules item=module key=key}
								<option value={$module.name}>{$module.name|@getTranslatedString}</option>
								{/foreach}
							</select>
						</div>
					</div>
				</div>
			</div>
			<article class="slds-card">
				<div class="slds-card__header slds-grid">
					<header class="slds-media slds-media_center slds-has-flexi-truncate">
						<div class="slds-media__figure">
							<span class="slds-icon_container slds-icon-standard-contact" title="description of icon when needed">
								<svg class="slds-icon slds-icon_small" aria-hidden="true">
								<use xlink:href="include/LD/assets/icons/standard-sprite/svg/symbols.svg#contact"></use>
								</svg>
							</span>
						</div>
						<div class="slds-media__body">
							<h2>
								<a href="javascript:void(0);" class="slds-card__header-link slds-truncate" title="[object Object]">
									<span class="slds-text-heading_small">Card Header</span>
								</a>
							</h2>
						</div>
					</header>
					<div class="slds-no-flex">
						<button class="slds-button slds-button_neutral">New</button>
					</div>
				</div>
				<div class="slds-card__body slds-card__body_inner">Card Body (custom goes in here)</div>
				<footer class="slds-card__footer">Card Footer</footer>
			</article>
		</div>
	</div>
	<!-- Toast -->
	<div id="toast" style="display: none;">
		<div class="slds-notify_container slds-is-relative">
			<div class="slds-notify slds-notify_toast slds-theme_success" role="alert">
				<span class="slds-assistive-text">success</span>
				<span class="slds-icon_container slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top" title="Description of icon when needed">
					<svg class="slds-icon slds-icon_small" aria-hidden="true">
						<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#success"></use>
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
	<!-- // Toast -->
	<!-- Hidden lang DIV -->
	<div style="display: none;">
		<div id="toast-message__users-saved">{$MOD.toast_users_saved}</div>
		<div id="toast-message__event-types-saved">{$MOD.toast_eventtypes_saved}</div>
	</div>
	<!-- // Hidden lang DIV -->
</div>
<script type="text/javascript">
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
</script>