<script lang="ts">
	import { Loader2Icon } from '@lucide/svelte/icons';
	let { isBusy = $bindable(false), children } = $props();
</script>

{#if isBusy}
	<Loader2Icon class="animate-spin" />
{:else}
	{@render children?.()}
{/if}
