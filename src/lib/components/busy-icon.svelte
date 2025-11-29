<script lang="ts">
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { Snippet } from 'svelte';
	let { isBusy = $bindable(false), children }: { isBusy: boolean; children?: Snippet } = $props();
</script>

{#if isBusy}
	<LoaderCircle class="animate-spin" />
{:else}
	{@render children?.()}
{/if}
