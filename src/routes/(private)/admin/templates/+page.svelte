<script lang="ts">
	import type { PageProps } from './$types';
	import type { UserAction, TableTemplates, OptionsCore } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { TableDataState } from '$lib/data-utils';
	import { SCHEDULE_TEMPLATE } from '$lib/defaults/app-defaults';
	import { Button } from '$ui/button/index';
	import * as Select from '$ui/select/index';
	import * as Dialog from '$ui/dialog/index';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import TemplateForm from '$lib/components/template-form.svelte';
	import SchedTemplateTable from '$lib/components/sched-template-table.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import DialogConfirm from '$lib/components/dialog-confirm.svelte';
	import { tick } from 'svelte';

	let { data }: PageProps = $props();

	const departments = new Map<number, OptionsCore>(
		data.templateOptions.departments.map((d) => [d.id, d])
	);
	const jobs = new Map<number, OptionsCore>(data.templateOptions.jobs.map((j) => [j.id, j]));
	const timeEvents = new Map<string, OptionsCore>(
		data.templateOptions.time_events.map((t) => [t.code, t])
	);

	const templateData = new TableDataState<TableTemplates, 'id'>([], ['id']);

	let isBusy = $state(false);
	let openForm = $state(false);
	let showDialog = $state(false);
	let currentValue = $state<TableTemplates | undefined>(undefined);
	let formAction = $state('');
	let actionState = $state<UserAction>('read');
	let deptFormElem = $state<HTMLFormElement | null>(null);
	let templateFormElem = $state<HTMLFormElement | null>(null);
	let selectedDept = $derived(departments.get(0));

	const onSelectDept: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { templates } = result.data;
				templateData.data = templates.rows;
			} else if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}

			isBusy = false;
		};
	};

	const onPostTemplates: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { rows, error } = result.data;
				if (error) {
					console.error(error);
				} else {
					if (actionState === 'delete') {
						templateData.remove(rows);
					} else {
						templateData.update(rows);
					}

					openForm = false;
				}
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			} else if (result.type === 'error') {
				console.error(result.error);
			}
			isBusy = false;
			onAction();
		};
	};

	function onAction(action: UserAction = 'read', entry?: TableTemplates) {
		if (action === 'delete') {
			showDialog = true;
		} else {
			formAction = `?/${action}`;
			actionState = action;

			if (entry?.id) {
				currentValue = structuredClone(entry);
			} else {
				if (action === 'create') {
					currentValue = structuredClone(SCHEDULE_TEMPLATE);
				} else if (action === 'read') {
					currentValue = entry;
				}

				//Update: actionsState and actionForm only
			}
		}
		if (currentValue && !openForm) {
			openForm = true;
		}
	}

	function onOpenChange(open: boolean) {
		if (!open) onAction();
	}

	async function onValueChange(value: string) {
		if (value) {
			await tick();
			deptFormElem?.requestSubmit();
		}
	}

	async function onConfirmDelete() {
		showDialog = false;
		actionState = 'delete';
		formAction = '?/delete';
		await tick();

		templateFormElem?.requestSubmit();
	}

	function setDepartment(v: string){
		selectedDept = departments.get(Number(v))
	}

	function getDepartment(){
		return String(selectedDept?.id ?? '')
	}
</script>

{#if currentValue}
	<Dialog.Root bind:open={openForm} {onOpenChange}>
		<DialogConfirm
			bind:open={showDialog}
			description={`Do you want to delete the template <strong>${currentValue?.name ?? 'Template'}</strong>`}
			action="delete"
			onConfirm={onConfirmDelete}
		/>
		<Dialog.Content class="min-w-4xl" interactOutsideBehavior="ignore">
			<Dialog.Header>
				<Dialog.Title>
					{actionState === 'create' ? 'Template Form' : currentValue.name}
				</Dialog.Title>
				<Dialog.Description></Dialog.Description>
			</Dialog.Header>
			<form
				method="POST"
				action={formAction}
				use:enhance={onPostTemplates}
				bind:this={templateFormElem}
			>
				<TemplateForm
					{isBusy}
					bind:data={currentValue}
					deptOption={departments}
					jobOption={jobs}
					timeEventOption={timeEvents}
					currentDept={selectedDept}
					action={actionState}
				/>
				<Dialog.Footer>
					<div class="flex items-center justify-end gap-2">
						{#if actionState === 'read'}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={() => onAction('update')}
								disabled={isBusy}>Edit</Button
							>
							<Button
								type="button"
								class="text-destructive"
								variant="outline"
								size="sm"
								onclick={() => onAction('delete')}
								disabled={isBusy}>Delete</Button
							>
						{:else if actionState !== 'delete'}
							<Button type="submit" variant="outline" size="sm" disabled={isBusy}>
								{actionState === 'update' ? 'Save Changes' : 'Add Template'}
							</Button>
						{/if}
					</div>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<div class="w-full max-w-2xl overflow-auto md:max-w-6xl">
	<div class="flex-col justify-start gap-4">
		<div class="flex items-center justify-end">
			<div class="flex items-center gap-2">
				<form
					method="POST"
					action="?/get-templates"
					use:enhance={onSelectDept}
					bind:this={deptFormElem}
				>
					<Select.Root type="single" bind:value={getDepartment, setDepartment} name="departmentId" {onValueChange}>
						<Select.Trigger class="w-[180px]"
							>{selectedDept?.name ?? 'Select Department'}</Select.Trigger
						>
						<Select.Content>
							<Select.Group>
								<Select.Label>Department</Select.Label>
								{#each departments.entries() as [id, dept] (id)}
									<Select.Item value={String(id)}>{dept.name}</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</form>

				<Button
					variant="outline"
					size="sm"
					onclick={() => onAction('create')}
					disabled={!selectedDept || isBusy}
				>
					<BusyIcon {isBusy}><Plus /></BusyIcon>
					<span class="hidden md:inline">Add</span>
				</Button>
			</div>
		</div>
		<div class="mt-4 space-y-2 rounded-lg border p-2">
			<SchedTemplateTable
				data={templateData.data}
				deptOption={departments}
				jobOption={jobs}
				{onAction}
			/>
		</div>
	</div>
</div>
