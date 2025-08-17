<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsBaseTable, DialogAction } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import OptionsTable from '$lib/components/options-table.svelte';
	import DialogConfirm from '$lib/components/dialog-confirm.svelte';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import * as Tabs from '$ui/tabs/index';
	import { Button } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import { Skeleton } from '$ui/skeleton/index';
	import { PlusIcon, SaveIcon, TrashIcon } from '@lucide/svelte/icons';
	import { OPTIONS_TAB } from '$lib/defaults/menus';
	import { DIALOG_MESSAGES } from '$lib/defaults/app-defaults';
	import { DraftState, AppOptionsData } from '$lib/data-utils';
	import { slide } from 'svelte/transition';
	import { applyAction, enhance } from '$app/forms';
	import { tick } from 'svelte';

	let { data }: PageProps = $props();
	const optionsDraft = new DraftState<OptionsBaseTable>(
		'',
		{ omit: ['id'] },
		{
			code: '',
			name: '',
			description: '',
			active: true,
			locked: true
		}
	);

	const optionsData = new AppOptionsData(data.settingsOptions);

	let isBusy = $state(false);
	let form: HTMLFormElement | undefined = $state();
	let pendingAction: DialogAction | null = $state(null);
	let showDialog = $state(false);
	let dialogAction: string = $state('Continue');
	let dialogDescription: string = $state('Are you sure you want to proceed?');

	let userOptions = $derived(
		OPTIONS_TAB.filter((opt) => data.settingsOptions?.[opt.id].length > 0)
	);
	let activeTab = $derived(userOptions[0]?.id);
	let formAction = $derived.by(() => {
		switch (optionsDraft.actionState) {
			case 'create':
				return `?/create`;
			case 'update':
				return `?/update`;
			default:
				return '';
		}
	});

	function onEdit(data: OptionsBaseTable) {
		optionsDraft.entity = activeTab;
		optionsDraft.editEntry(data);
	}

	function onAdd() {
		optionsDraft.entity = activeTab;
		optionsDraft.addEntry();
	}

	function onDiscard(refId: string) {
		optionsDraft.cancelUpdate(refId);
	}

	function onRemove(refId: string) {
		optionsDraft.removeNewEntry(refId);
	}

	function onPendingAction(action: DialogAction) {
		pendingAction = action;
		dialogDescription = DIALOG_MESSAGES['settings.options']?.[action] ?? dialogDescription;
		dialogAction = String(action); //
		showDialog = true;
	}

	async function onConfirm() {
		showDialog = false;
		await tick();
		if (pendingAction === 'save' && form) {
			form.requestSubmit();
		} else if (pendingAction === 'clear') {
			optionsDraft.discardChanges();
		}

		pendingAction = null;
	}

	const formSubmission: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { rows, error } = result.data;
				if (error) {
					console.error(error);
				} else {
					optionsData.updateOptions(activeTab, rows);
					optionsDraft.discardChanges();
				}
			} else if (result.type === 'error') {
				console.error(result.error);
			}
			applyAction(result);
			isBusy = false;
		};
	};
</script>

<DialogConfirm
	bind:open={showDialog}
	description={dialogDescription}
	action={dialogAction}
	{onConfirm} />

{#await data.settingsOptions}
	<div class="w-full max-w-2xl space-y-4 md:max-w-4xl">
		<Skeleton class="h-9" />
		<div class="space-y-2 rounded-lg border p-2">
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
		</div>
	</div>
{:then settingsOptions}
	<div class="w-full max-w-2xl overflow-auto md:max-w-4xl">
		<Tabs.Root bind:value={activeTab} class="flex-col justify-start gap-4">
			<div class="flex items-center justify-between">
				<Tabs.List>
					{#each userOptions as tab}
						{#if settingsOptions[tab.id].length > 0}
							<Tabs.Trigger
								value={tab.id}
								disabled={optionsDraft.hasChanges && tab.id !== activeTab}
								><tab.icon /><span>{tab.title}</span></Tabs.Trigger>
						{/if}
					{/each}
				</Tabs.List>

				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={!optionsDraft.hasChanges || isBusy}
						onclick={() => onPendingAction('save')}>
						<BusyIcon {isBusy}><SaveIcon /></BusyIcon>
						<span class="hidden md:inline">Save</span>
						{#if optionsDraft.hasChanges}
							<Badge
								variant="destructive"
								class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
								>{optionsDraft.modifiedEntries.length || optionsDraft.newEntries.length}
							</Badge>
						{/if}
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={!optionsDraft.hasChanges || isBusy}
						onclick={() => onPendingAction('clear')}>
						<BusyIcon {isBusy}><TrashIcon class="text-destructive" /></BusyIcon>
						<span class="hidden md:inline">Clear</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={optionsDraft.modifiedEntries.length > 0 || isBusy}
						onclick={onAdd}>
						<BusyIcon {isBusy}><PlusIcon /></BusyIcon>
						<span class="hidden md:inline">Add</span>
					</Button>
				</div>
			</div>
			{#each userOptions as opt}
				<Tabs.Content value={opt.id} class="relative flex flex-col overflow-auto">
					{#if activeTab === opt.id}
						<div class="overflow-hidden rounded-lg border p-2" transition:slide>
							<form
								method="POST"
								id="form-options"
								bind:this={form}
								action={formAction}
								use:enhance={formSubmission}>
								<fieldset disabled={isBusy}>
									<OptionsTable
										data={optionsData.table(opt.id)}
										table={opt.id}
										options={opt}
										{onEdit}
										{onDiscard}
										{onRemove}
										{optionsDraft} />
								</fieldset>
							</form>
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</div>
{:catch}
	<h1>Server Error!</h1>
{/await}
