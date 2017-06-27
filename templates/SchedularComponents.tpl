{function name='relationcard' template='false' relation=[]}
<article class="slds-card schedular-relation" id="{if $template == 'true'}relation-template{else}relation-{$relation.schedular_relid}{/if}" {if $template == 'false'}data-modulename="{$relation.schedular_relmodule_name}"{/if} {if $template == 'true'}style="display: none;"{/if}>
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
	<footer class="slds-card__footer">Card Footer</footer>
</article>
{/function}

{function name='relationautocomplete' relation=[]}
<fieldset class="slds-form-element">
	<label class="slds-form-element__label" for="combobox-unique-id">Search {$relation.schedular_relmodule_name|@getTranslatedString:$relation.schedular_relmodule_name}</label>
	<div class="slds-form-element__control">
		<div class="slds-combobox_container">
			<div class="slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" aria-expanded="true" aria-haspopup="listbox" role="combobox">
				<div class="slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right">
					<input type="hidden" class="relation-autocomplete__hidden" name="" value="">
					<input class="slds-input slds-combobox__input relation-autocomplete-input" id="search-{$relation.schedular_relmodule_name|strtolower}" aria-activedescendant="schedular-relation-{$relation.schedular_relid}" aria-autocomplete="list" aria-controls="schedular-relation-{$relation.schedular_relid}" autocomplete="off" role="textbox" placeholder="Search {$relation.schedular_relmodule_name|@getTranslatedString:$relation.schedular_relmodule_name}" type="text" data-ac='{$relation.json}' data-relid="{$relation.schedular_relid}">
					<span class="slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right" title="Description of icon when needed">
						<svg class="slds-icon slds-icon slds-icon_x-small slds-icon-text-default" aria-hidden="true">
							<use xlink:href="include/LD/assets/icons/utility-sprite/svg/symbols.svg#search"></use>
						</svg>
						<span class="slds-assistive-text">Description of icon</span>
					</span>
				</div>
				<div id="listbox-unique-id" role="listbox" class="">
					<ul class="slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid relation-autocomplete__target" style="opacity : 0;" role="presentation">
{* 						<li role="presentation" class="slds-listbox__item">
							<span id="listbox-option-unique-id-01" class="slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta slds-has-focus" role="option">
								<span class="slds-media__figure">
									<span class="slds-icon_container slds-icon-standard-account" title="Description of icon when needed">
										<svg class="slds-icon slds-icon_small" aria-hidden="true">
											<use xlink:href="include/LD/assets/icons/standard-sprite/svg/symbols.svg#account"></use>
										</svg>
										<span class="slds-assistive-text">Description of icon</span>
									</span>
								</span>
								<span class="slds-media__body">
									<span class="slds-listbox__option-text slds-listbox__option-text_entity">Acme</span>
									<span class="slds-listbox__option-meta slds-listbox__option-meta_entity">Account • San Francisco</span>
								</span>
							</span>
						</li> *}
					</ul>
				</div>
			</div>
		</div>
	</div>
</fieldset>
<fieldset class="slds-form-element">
  <label class="slds-form-element__label" for="input-unique-id">Existing {$relation.schedular_relmodule_name|@getTranslatedString:$relation.schedular_relmodule_name}</label>
  <div class="slds-form-element__control existing-relations existing-relations__{$relation.schedular_relmodule_name}">
  	
  </div>
</fieldset>
{/function}