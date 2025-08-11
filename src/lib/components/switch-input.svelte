<script lang="ts">
	import { Switch } from '$ui/switch/index';

	let { name, checked = $bindable(false), ref = $bindable(null), ...restProps } = $props();
</script>

<input {name} type="hidden" value={checked ? '1' : ''} hidden />
<Switch {...restProps} bind:checked bind:ref />
