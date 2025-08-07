<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsBaseTable } from '$lib/app-types';
	import * as Tabs from '$ui/tabs/index';
	import { Button } from '$ui/button/index';
	import OptionsTable from '$lib/components/options-table.svelte';
	import { PlusIcon, SaveIcon, TrashIcon } from '@lucide/svelte/icons';
	import { OPTIONS_TAB } from '$lib/defaults/menus';
	import { DataState } from '$lib/data-utils/data-state.svelte';

	let { data }: PageProps = $props();
	let userOptions = $derived(OPTIONS_TAB.filter((opt) => data.appOptions?.[opt.id].length > 0));
	let currentTab = $derived(String(userOptions[0]?.id));

	let dataState = new DataState<OptionsBaseTable>(null, {
		code: '',
		name: '',
		description: '',
		active: true,
		locked: true
	});

	function onEdit(data: OptionsBaseTable) {
		dataState.table = currentTab;
		dataState.editData(data);
	}

	function onDiscard(id: number) {
		dataState.cancelEdit(id);
	}
	
	function onAdd(){
		dataState.table = currentTab;
		dataState.addData();
	}
	
	function onClear() {
		dataState.discardChanges();
	}

</script>

<div class="w-full max-w-2xl overflow-auto md:max-w-4xl">
	<Tabs.Root bind:value={currentTab} class="flex-col justify-start gap-4">
		<div class="flex items-center justify-between">
			<Tabs.List>
				{#each userOptions as tab}
					{#if data.appOptions[tab.id].length > 0}
						<Tabs.Trigger value={tab.id} disabled={dataState.hasChanges && tab.id !== currentTab}
							><tab.icon /><span>{tab.title}</span></Tabs.Trigger>
					{/if}
				{/each}
			</Tabs.List>
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" disabled={!dataState.hasChanges}
					><SaveIcon /><span class="hidden md:inline">Save</span>
				</Button>
				<Button variant="outline" size="sm" disabled={!dataState.hasChanges} onclick={onClear}
					><TrashIcon /><span class="hidden md:inline">Clear</span>
				</Button>
				<Button variant="outline" size="sm" disabled={dataState.updatedData.size > 0} onclick={onAdd}
					><PlusIcon /><span class="hidden md:inline">Add</span>
				</Button>
			</div>
		</div>
		{#each userOptions as opt}
			{#key currentTab}
				<Tabs.Content value={opt.id} class="relative flex flex-col overflow-auto">
					<div class="overflow-hidden rounded-lg border p-2">
						<OptionsTable
							data={data.appOptions[opt.id]}
							table={opt.id}
							options={opt}
							createdData={dataState.createdData}
							updatedData={dataState.updatedData}
							{onEdit}
							{onDiscard}
							{dataState} />
					</div>
				</Tabs.Content>
			{/key}
		{/each}
	</Tabs.Root>
</div>
