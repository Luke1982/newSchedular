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
<script type="text/javascript" src="modules/Schedular/Schedular.js"></script>