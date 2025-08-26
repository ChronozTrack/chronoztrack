<script lang="ts" generics="Data extends Record<string, unknown>">
	import { enhance } from '$app/forms';
	import type { WithElementRef } from '$lib/utils';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type FormProps = WithElementRef<HTMLFormAttributes> & {
		data: Map<string, Data>;
		table: string;
		dataKeys?: (keyof Data)[];
		enhanceFunction: SubmitFunction;
	};

	let {
		table,
		data,
		dataKeys = [],
		ref = $bindable(),
		enhanceFunction,
		...restProps
	}: FormProps = $props();
</script>

<form bind:this={ref} method="POST" {...restProps} use:enhance={enhanceFunction}>
	{#each data as [mapKey, item], idx (mapKey)}
		{@const keys = dataKeys.length > 0 ? dataKeys : Object.keys(item)}
		{#each keys as k}
			{#if Object.hasOwn(item, k)}
				{@const inputName = `${table}[${idx}][${String(k)}]`}
				<input type="hidden" value={item[k]} name={inputName} />
			{/if}
		{/each}
	{/each}
</form>
