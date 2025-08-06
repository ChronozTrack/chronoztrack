<script lang="ts">
	import type { PageProps } from './$types';
	import * as Tabs from '$ui/tabs/index';
	import { Button } from '$ui/button/index';
	import OptionsTable from '$lib/components/options-table.svelte';
	import { PlusIcon, SaveIcon, TrashIcon } from '@lucide/svelte/icons';
	import { OPTIONS_TAB } from '$lib/defaults/menus';

	let { data }: PageProps = $props();
	let userOptions = $derived(OPTIONS_TAB.filter((opt) => data.appOptions?.[opt.id].length > 0));
	let currentTab = $derived(String(userOptions[0]?.id));
	$inspect(currentTab);
</script>

<div class="md:min-w-3xl">
	<Tabs.Root bind:value={currentTab} class="flex-col justify-start gap-4">
		<div class="flex items-center justify-between">
			<Tabs.List>
				{#each userOptions as tab}
					{#if data.appOptions[tab.id].length > 0}
						<Tabs.Trigger value={tab.id}><tab.icon /><span>{tab.title}</span></Tabs.Trigger>
					{/if}
				{/each}
			</Tabs.List>
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm"><SaveIcon /><span>Save</span></Button>
				<Button variant="outline" size="sm" disabled><TrashIcon /><span>Clear</span></Button>
				<Button variant="outline" size="sm"><PlusIcon /><span>Add</span></Button>
			</div>
		</div>
		{#each userOptions as opt}
			<Tabs.Content value={opt.id} class="relative flex flex-col overflow-auto">
				<div class="overflow-hidden rounded-lg border p-2">
					<OptionsTable data={data.appOptions[opt.id]} options={opt} />
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>
