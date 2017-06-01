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
					<input id="" class="slds-input relation__filterfields" placeholder="Enter comma separated search fields" type="text">
				</div>
			</div>
			<div class="slds-form-element">
			<label class="slds-form-element__label" for="text-input-id-1">{$MOD.return_fields}</label>
				<div class="slds-form-element__control">
					<input id="" class="slds-input relation__retfields" placeholder="Enter comma separated return fields" type="text">
				</div>
			</div>
			<div class="slds-form-element">
			<label class="slds-form-element__label" for="text-input-id-1">{$MOD.include_relation_id}</label>
				<div class="slds-form-element__control">
					<input id="" class="slds-input relation__include-id" placeholder="Enter relation ID you want to include in the search" type="text">
				</div>
			</div>
			<div class="slds-form-element">
			<label class="slds-form-element__label" for="text-input-id-1">{$MOD.relation_filterfield}</label>
				<div class="slds-form-element__control">
					<input id="" class="slds-input relation__included-rel-filterfield" placeholder="Filter field for the included relation's CRM ID" type="text">
				</div>
			</div>
		</div>
	</div>
	<footer class="slds-card__footer">Card Footer</footer>
</article>
{/function}