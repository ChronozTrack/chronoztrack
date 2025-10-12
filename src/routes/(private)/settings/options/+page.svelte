<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsBaseTable, DialogAction, AppOptionsType } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import OptionsTable from '$lib/components/options-table.svelte';
	import DialogConfirm from '$lib/components/dialog-confirm.svelte';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import PostActionForm from '$lib/components/post-action-form.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash';
	import * as Tabs from '$ui/tabs/index';
	import { Button } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import { Skeleton } from '$ui/skeleton/index';
	import { OPTIONS_TAB } from '$lib/defaults/menus';
	import { DIALOG_MESSAGES } from '$lib/defaults/app-defaults';
	import { DraftState, TableDataState } from '$lib/data-utils';
	import { slide } from 'svelte/transition';
	import { applyAction } from '$app/forms';
	import { tick } from 'svelte';

	let { data }: PageProps = $props();
	const optionsDraft = new DraftState<OptionsBaseTable>(
		'',
		{ primary: ['id'] },
		{
			code: '',
			name: '',
			description: '',
			active: true,
			locked: true
		}
	);

	const optionsData: Record<AppOptionsType, TableDataState<OptionsBaseTable, 'id'>> = {
		jobs: new TableDataState<OptionsBaseTable, 'id'>(data.settingsOptions?.jobs ?? [], ['id']),
		roles: new TableDataState<OptionsBaseTable, 'id'>(data.settingsOptions?.roles ?? [], ['id']),
		departments: new TableDataState<OptionsBaseTable, 'id'>(
			data.settingsOptions?.departments ?? [],
			['id']
		),
		time_events: new TableDataState<OptionsBaseTable, 'id'>(
			data.settingsOptions?.time_events ?? [],
			['id']
		)
	};

	let isBusy = $state(false);
	let formElem: HTMLFormElement | undefined = $state();
	let pendingAction: DialogAction | null = $state(null);
	let showDialog = $state(false);
	let dialogAction: string = $state('Continue');
	let dialogDescription: string = $state('Are you sure you want to proceed?');

	let userOptions = $derived(
		OPTIONS_TAB.filter((opt) => data.settingsOptions?.[opt.id].length > 0)
	);
	let activeTab: AppOptionsType = $derived(userOptions[0]?.id);
	let postForm = $derived.by(() => {
		let temp: {
			data: Map<string, OptionsBaseTable>;
			action: string;
			dataKeys: (keyof OptionsBaseTable)[];
		} = {
			data: new Map<string, OptionsBaseTable>(),
			action: '',
			dataKeys: ['id', 'code', 'name', 'active', 'description']
		};
		if (optionsDraft.actionState === 'create') {
			temp.data = optionsDraft.newEntries;
			temp.action = '?/create';
		} else if (optionsDraft.actionState === 'update') {
			temp.data = optionsDraft.modifiedEntries;
			temp.action = '?/update';
		}
		return temp;
	});

	function onEdit(data: OptionsBaseTable) {
		optionsDraft.entity = activeTab;
		optionsDraft.updateEntry(data);
	}

	function onAdd() {
		optionsDraft.entity = activeTab;
		optionsDraft.addEntry();
	}

	function onDiscard(refId: string | OptionsBaseTable) {
		optionsDraft.discardEntry(refId);
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
		if (pendingAction === 'save' && formElem) {
			formElem.requestSubmit();
		} else if (pendingAction === 'clear') {
			optionsDraft.discardAllChanges();
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
					optionsData[activeTab].update(rows);
					optionsDraft.discardAllChanges();
				}
			} else if (result.type === 'error') {
				console.error(result.error);
			}
			applyAction(result);
			isBusy = false;
		};
	};

</script>

{#if postForm.action.length > 0}
	<PostActionForm
		hidden
		table={optionsDraft.entity}
		enhanceFunction={formSubmission}
		bind:ref={formElem}
		{...postForm}
	/>
{/if}

<DialogConfirm
	bind:open={showDialog}
	description={dialogDescription}
	action={dialogAction}
	{onConfirm}
/>

{#await data.settingsOptions}
	<div class="w-full max-w-2xl space-y-4 md:max-w-5xl">
		<Skeleton class="h-9" />
		<div class="space-y-2 rounded-lg border p-2">
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
		</div>
	</div>
{:then settingsOptions}
	<div class="w-full max-w-2xl overflow-auto md:max-w-5xl">
		<Tabs.Root bind:value={activeTab} class="flex-col justify-start gap-4">
			<div class="flex items-center justify-between">
				<Tabs.List>
					{#each userOptions as tab}
						{#if settingsOptions[tab.id].length > 0}
							<Tabs.Trigger
								value={tab.id}
								disabled={optionsDraft.hasChanges && tab.id !== activeTab}
								><tab.icon /><span>{tab.title}</span></Tabs.Trigger
							>
						{/if}
					{/each}
				</Tabs.List>

				<div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={!optionsDraft.hasChanges || isBusy}
						onclick={() => onPendingAction('save')}
					>
						<BusyIcon {isBusy}><Save /></BusyIcon>
						<span class="hidden md:inline">Save</span>
						{#if optionsDraft.hasChanges}
							<Badge
								variant="destructive"
								class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
								>{optionsDraft.modifiedEntries.size || optionsDraft.newEntries.size}
							</Badge>
						{/if}
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={!optionsDraft.hasChanges || isBusy}
						onclick={() => onPendingAction('clear')}
					>
						<BusyIcon {isBusy}><Trash class="text-destructive" /></BusyIcon>
						<span class="hidden md:inline">Clear</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={optionsDraft.modifiedEntries.size > 0 || isBusy}
						onclick={onAdd}
					>
						<BusyIcon {isBusy}><Plus /></BusyIcon>
						<span class="hidden md:inline">Add</span>
					</Button>
				</div>
			</div>
			{#each userOptions as opt}
				<Tabs.Content value={opt.id} class="relative flex flex-col overflow-auto">
					{#if activeTab === opt.id}
						<div class="overflow-hidden rounded-lg border p-2" transition:slide>
							<fieldset disabled={isBusy}>
								<OptionsTable
									data={optionsData[opt.id].data}
									table={opt.id}
									options={opt}
									{onEdit}
									{onDiscard}
									{optionsDraft}
								/>
							</fieldset>
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</div>
{:catch}
	<h1>Server Error!</h1>
{/await}
