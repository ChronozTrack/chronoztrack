<script lang="ts">
	import type { PageProps } from './$types';
	import type { TableTemplates } from '$lib/app-types';
	import { DraftState } from '$lib/data-utils';
	import { SCHEDULE_TEMPLATE } from '$lib/defaults/app-defaults';
	import { Button } from '$ui/button/index';
	import { Skeleton } from '$ui/skeleton/index';
	import * as Select from '$ui/select/index';
	import * as Dialog from '$ui/dialog/index';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import TemplateForm from '$lib/components/template-form.svelte';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { tick } from 'svelte';

	let { data }: PageProps = $props();
	const { departments = [], jobs = [], timeEvents = [] } = data.templateOptions;
	const templateData = new DraftState<TableTemplates>('templates', {
		primary: ['id'],
		isRequired: true
	});
	const templateDraft = new DraftState<TableTemplates>(
		'templates',
		{ primary: ['id'], isRequired: true },
		SCHEDULE_TEMPLATE
	);

	let activeDeptId = $state('');
	let isBusy = $state(false);
	let openForm = $state(false);
	let selectedDept = $derived(departments.find((dept) => dept.id === Number(activeDeptId)));
	let draftData = $derived.by(() => {
		if (templateDraft.actionState === 'create') {
			return {
				action: '?/create',
				data: templateDraft.newEntries.values().next().value
			};
		} else if (templateDraft.actionState === 'update') {
			return {
				action: '?/update',
				data: templateDraft.modifiedEntries.values().next().value
			};
		} else if (templateDraft.actionState === 'delete') {
			return {
				action: '?/delete',
				data: templateDraft.removedEnries.values().next().value
			};
		}

		return {
			action: '',
			data: undefined
		};
	});

	async function onAddTemplate() {
		templateDraft.addEntry();
		await tick();
		openForm = true;
	}

	function onAdd() {
		templateDraft.addEntry();
	}

	function onEdit(entry: TableTemplates) {
		templateDraft.updateEntry(entry);
	}

	function onDelete(entry: TableTemplates) {
		templateDraft.deleteEntry(entry);
	}

	function onOpenChange(open: boolean) {
		if (!open) {
			templateDraft.discardAllChanges();
		}
	}
</script>

{#if draftData.action && draftData.data}
	<Dialog.Root bind:open={openForm} {onOpenChange}>
		<Dialog.Content
			onEscapeKeydown={(e) => e.preventDefault()}
			interactOutsideBehavior="ignore"
			class="min-w-4xl"
		>
			<Dialog.Header>
				<Dialog.Title>Add Template</Dialog.Title>
				<Dialog.Description>Add Schedule Template</Dialog.Description>
			</Dialog.Header>
			<form method="POST" action={draftData.action}>
				<TemplateForm
					{isBusy}
					deptOption={departments}
					jobOption={jobs}
					eventsOption={timeEvents}
					data={draftData.data}
				/>
				<Dialog.Footer>
					<Button type="submit">Save Changes</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<div class="w-full max-w-2xl overflow-auto md:max-w-4xl">
	<div class="flex-col justify-start gap-4">
		<div class="flex items-center justify-between">
			<form action="">
				<Select.Root type="single" bind:value={activeDeptId} name="departmentId">
					<Select.Trigger class="w-[180px]"
						>{selectedDept?.name ?? 'Select Department'}</Select.Trigger
					>
					<Select.Content>
						<Select.Group>
							<Select.Label>Department</Select.Label>
							{#each departments as dept (dept.id)}
								<Select.Item value={String(dept.id)}>{dept.name}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</form>
			<div class="flex items-center gap-2">
				{#if selectedDept}
					<!-- <Button variant="outline" size="sm"> -->
					<!-- 	<BusyIcon {isBusy}><Save /></BusyIcon> -->
					<!-- 	<span class="hidden md:inline">Save</span> -->
					<!-- </Button> -->
					<!-- <Button variant="outline" size="sm"> -->
					<!-- 	<BusyIcon {isBusy}> -->
					<!-- 		<Trash class="text-destructive" /> -->
					<!-- 	</BusyIcon> -->
					<!-- 	<span class="hidden md:inline">Clear</span> -->
					<!-- </Button> -->
					<Button variant="outline" size="sm" onclick={onAddTemplate} disabled={!selectedDept}>
						<BusyIcon {isBusy}><Plus /></BusyIcon>
						<span class="hidden md:inline">Add</span>
					</Button>
				{/if}
			</div>
		</div>
		<div class="relative flex flex-col overflow-auto pt-4">
			<div class="space-y-2 rounded-lg border p-2">
				<Skeleton class="h-9" />
				<Skeleton class="h-9" />
				<Skeleton class="h-9" />
				<Skeleton class="h-9" />
			</div>
		</div>
	</div>
</div>
