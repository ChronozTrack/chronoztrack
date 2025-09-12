<script lang="ts">
	import type { PageProps } from './$types';
	import type { TableTemplates } from '$lib/app-types';
	import { Button } from '$ui/button/index';
	import { Skeleton } from '$ui/skeleton/index';
	import * as Select from '$ui/select/index';
	import * as Dialog from '$ui/dialog/index';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import TemplateForm from '$lib/components/template-form.svelte';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash';
	import Plus from '@lucide/svelte/icons/plus';
	import { DraftState } from '$lib/data-utils';

	let { data }: PageProps = $props();
	const { departments = [], jobs = [], timeEvents= [] } = data.templateOptions;

	let activeDeptId = $state('');
	let isBusy = $state(false);
	let openForm = $state(false);
	let selectedDept = $derived(departments.find((dept) => dept.id === Number(activeDeptId)));
	let templateData = new DraftState<TableTemplates>('templates', {
		primary: ['id'],
		isRequired: true
	});

	function onAddTemplate() {
		openForm = true;
	}
</script>

{#if selectedDept}
	<Dialog.Root bind:open={openForm}>
		<Dialog.Content onEscapeKeydown={(e) => e.preventDefault()} interactOutsideBehavior="ignore" class="min-w-4xl max-h-9/10">
			<Dialog.Header>
				<Dialog.Title>Add Template</Dialog.Title>
				<Dialog.Description>Add Schedule Template</Dialog.Description>
			</Dialog.Header>
			<form>
					<TemplateForm {isBusy} deptOption={departments} jobOption={jobs} eventsOption={timeEvents} data={undefined}/>
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
					<Button variant="outline" size="sm">
						<BusyIcon {isBusy}><Save /></BusyIcon>
						<span class="hidden md:inline">Save</span>
					</Button>
					<Button variant="outline" size="sm">
						<BusyIcon {isBusy}>
							<Trash class="text-destructive" />
						</BusyIcon>
						<span class="hidden md:inline">Clear</span>
					</Button>
					<Button variant="outline" size="sm" onclick={onAddTemplate}>
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
