<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-radio.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-tabs.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-button.css">
<link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-checkbox.css">
{* <link rel="stylesheet" type="text/css" href="modules/Schedular/lib/css/slds-icon.css"> *}
<div style="padding: 2%;">
	<div class="slds-tabs_scoped">
		<ul class="slds-tabs_scoped__nav" role="tablist">
			<li class="slds-tabs_scoped__item slds-is-active" title="{$MOD.resources}" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="0" aria-selected="true" aria-controls="tab-scoped-1" id="tab-scoped-1__item">{$MOD.resources}</a>
			</li>
			<li class="slds-tabs_scoped__item" title="Item Two" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-2" id="tab-scoped-2__item">Item Two</a>
			</li>
			<li class="slds-tabs_scoped__item" title="Item Three" role="presentation">
				<a class="slds-tabs_scoped__link" href="javascript:void(0);" role="tab" tabindex="-1" aria-selected="false" aria-controls="tab-scoped-3" id="tab-scoped-3__item">Item Three</a>
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
								<input id="user-{$av_user.id}" name="checkbox" type="checkbox" checked="checked">
								<label class="slds-checkbox_button__label" for="user-{$av_user.id}">
									<span class="slds-checkbox_faux">{$av_user.first_name}&nbsp;{$av_user.last_name}</span>
								</label>
							</span>
							{/foreach}
						</div>
					</div>
				</fieldset>
				<fieldset class="slds-form-element">
					<button class="slds-button slds-button_brand">
						<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#database"></use>
						</svg>{$MOD.save_users}</button>					
				</fieldset>
			</div>
		</div>
		<div id="tab-scoped-2" class="slds-tabs_scoped__content slds-hide" role="tabpanel" aria-labelledby="tab-scoped-2__item">Item Two Content</div>
		<div id="tab-scoped-3" class="slds-tabs_scoped__content slds-hide" role="tabpanel" aria-labelledby="tab-scoped-3__item">Item Three Content</div>
	</div>
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
	});
</script>