<script lang="ts">
	import { Switch } from '$ui/switch/index';

	let { name, id, checked = $bindable(false), ref = $bindable(null), ...restProps } = $props();
</script>

<input {name} {id} type="hidden" value={checked ? 1 : 0} hidden />
<Switch {...restProps} bind:checked bind:ref />
