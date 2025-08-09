<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsBaseTable } from '$lib/app-types';
	import * as Tabs from '$ui/tabs/index';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import * as Dialog from '$ui/dialog/index';
	import OptionsTable from '$lib/components/options-table.svelte';
	import { PlusIcon, SaveIcon, TrashIcon } from '@lucide/svelte/icons';
	import { OPTIONS_TAB } from '$lib/defaults/menus';
	import { DataState } from '$lib/data-utils/data-state.svelte';

	const dataState = new DataState<OptionsBaseTable>(null, {
		code: '',
		name: '',
		description: '',
		active: true,
		locked: true
	});

	let { data }: PageProps = $props();
	let userOptions = $derived(OPTIONS_TAB.filter((opt) => data.appOptions?.[opt.id].length > 0));
	let currentTab = $derived(String(userOptions[0]?.id));
	let formAction = $derived.by(() => {
		const table = dataState.table;
		switch (dataState.actionState) {
			case 'create':
				return `?/create-${table}`;
			case 'update':
				return `?/update-${table}`;
			default:
				return '';
		}
	});

	let formInputs = $derived.by(() => {
		if (!dataState.hasChanges) {
			return [];
		}

		switch (dataState.actionState) {
			case 'create':
				return dataState.createdData;
			case 'update':
				return dataState.updatedData;
			default:
				return [];
		}
	});

	let dialog: HTMLDialogElement;

	function onEdit(data: OptionsBaseTable) {
		dataState.table = currentTab;
		dataState.editData(data);
	}

	function onAdd() {
		dataState.table = currentTab;
		dataState.addData();
	}

	function onDiscard(id: number) {
		dataState.cancelEdit(id);
	}

	function onRemove(id: string) {
		dataState.removeNewData(id);
	}

	function onClear() {
		dataState.discardChanges();
	}

	$inspect(formInputs);
</script>

{#if formInputs.length && formAction}
	<form hidden action={formAction} method="POST" id="form-options">
		{#each formInputs as data (data.id)}
			{@const inputName = (prefix: string) => `${prefix}_${data.id}`}
			<input type="hidden" name={inputName('code')} value={data.code} />
			<input type="hidden" name={inputName('name')} value={data.name} />
			<input type="hidden" name={inputName('description')} value={data.description} />
			<input type="hidden" name={inputName('active')} value={data.active ? '1' : ''} />
		{/each}
	</form>
{/if}

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
				<Button
					variant="outline"
					size="sm"
					disabled={!dataState.hasChanges}
					onclick={() => dialog.showModal()}
					><SaveIcon /><span class="hidden md:inline">Save</span>
					{#if dataState.hasChanges}
						<Badge
							variant="destructive"
							class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
							>{dataState.updatedData.length || dataState.createdData.length}</Badge>
					{/if}
				</Button>

				<Button variant="outline" size="sm" disabled={!dataState.hasChanges} onclick={onClear}
					><TrashIcon /><span class="hidden md:inline">Clear</span>
				</Button>

				<Button
					variant="outline"
					size="sm"
					disabled={dataState.updatedData.length > 0}
					onclick={onAdd}
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
							{onEdit}
							{onDiscard}
							{onRemove}
							{dataState} />
					</div>
				</Tabs.Content>
			{/key}
		{/each}
	</Tabs.Root>
</div>
