<script lang="ts">
	import type { PageProps } from './$types';
	import * as Tabs from '$ui/tabs/index';
	import OptionsTable from '$lib/components/options-table.svelte';
	import { OPTIONS_TAB } from '$lib/defaults/menus';

	let { data }: PageProps = $props();
	let userOptions = $derived(OPTIONS_TAB.filter((opt) => data.appOptions?.[opt.id].length > 0));
	let currentTab = $derived(String(userOptions[0]?.id));
	$inspect(currentTab)
</script>

<div class="rounded-lg p-4 shadow-md md:min-w-3xl">
	<Tabs.Root bind:value={currentTab} class="flex-col justify-start gap-4">
		<Tabs.List>
			{#each userOptions as tab}
				{#if data.appOptions[tab.id].length > 0}
					<Tabs.Trigger value={tab.id}><tab.icon /><span>{tab.title}</span></Tabs.Trigger>
				{/if}
			{/each}
		</Tabs.List>
		{#each userOptions as opt}
			<Tabs.Content value={opt.id} class="relative flex flex-col overflow-auto">
				<div class="overflow-hidden rounded-lg border p-2">
					<OptionsTable data={data.appOptions[opt.id]} options={opt}/>
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>
