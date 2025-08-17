<script lang="ts">
	import type { AppPages, OptionsBaseTable } from '$lib/app-types';
	import * as Table from '$ui/table/index';
	import { Button } from '$ui/button/index';
	import { Input } from '$ui/input/index';
	import { PencilIcon, TrashIcon, PencilOffIcon } from '@lucide/svelte/icons';
	import { DraftState } from '$lib/data-utils/data-state.svelte';
	import SwitchInput from '$lib/components/switch-input.svelte';

	interface OptionsTableProps {
		table: string;
		options: AppPages;
		data: OptionsBaseTable[];
		onDiscard: (refId: string) => void;
		onEdit: (data: OptionsBaseTable) => void;
		onRemove: (refId: string) => void;
		optionsDraft: DraftState<OptionsBaseTable>;
	}

	let {
		data = [],
		options,
		onDiscard,
		onRemove,
		onEdit,
		optionsDraft,
		table
	}: OptionsTableProps = $props();
</script>

<Table.Root>
	<Table.Caption>List of {options.title} option.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-1/10 text-center">Id</Table.Head>
			<Table.Head class="w-2/12">Code</Table.Head>
			<Table.Head class="w-3/12">Name</Table.Head>
			<Table.Head class="truncate">Description</Table.Head>
			<Table.Head class="w-1/10 text-center">Active</Table.Head>
			<Table.Head class="w-1/10 text-center">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as row (row.id)}
			{@const modifiedEntries = optionsDraft.modifiedEntries}
			{@const idx = modifiedEntries.findIndex((item) => item.id === row.id)}
			{@const isEdit = idx >= 0 && optionsDraft.entity === table}
			{@const inputName = (prefix: string) => `${table}[${idx}][${prefix}]`}
			<Table.Row
				class={[
					row.locked ? 'text-primary/75' : '',
					!row.active ? 'text-destructive' : '',
					isEdit ? 'bg-primary/10' : '',
					isEdit && !modifiedEntries[idx].active ? 'text-destructive' : ''
				]}>
				<Table.Cell class="text-center">{row.id}</Table.Cell>
				{#if isEdit}
					<input type="hidden" name={inputName('id')} value={row.id} hidden />
					<Table.Cell>
						<Input
							name={inputName('code')}
							type="text"
							bind:value={modifiedEntries[idx].code}
							class="h-8 border-none"
							required />
					</Table.Cell>
					<Table.Cell>
						<Input
							name={inputName('name')}
							type="text"
							bind:value={modifiedEntries[idx].name}
							class="h-8 border-none"
							required />
					</Table.Cell>
					<Table.Cell>
						<Input
							name={inputName('description')}
							type="text"
							bind:value={modifiedEntries[idx].description}
							class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell class="text-center">
						<SwitchInput name={inputName('active')} bind:checked={modifiedEntries[idx].active} />
					</Table.Cell>
					<Table.Cell class="items-center text-center">
						<Button variant="ghost" size="sm" onclick={() => onDiscard(modifiedEntries[idx].referenceId)}>
							<TrashIcon class="text-destructive" />
						</Button>
					</Table.Cell>
				{:else}
					<Table.Cell>{row.code}</Table.Cell>
					<Table.Cell>{row.name}</Table.Cell>
					<Table.Cell class="truncate">{row.description}</Table.Cell>
					<Table.Cell class="text-center">{row.active ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell class="text-center">
						<Button
							variant="ghost"
							size="sm"
							disabled={optionsDraft.actionState === 'create' || row.locked}
							onclick={() => onEdit(row)}>
							{#if optionsDraft.actionState === 'create' || row.locked}
								<PencilOffIcon />
							{:else}
								<PencilIcon />
							{/if}
						</Button>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}

		{#if optionsDraft.actionState === 'create'}
			{#each optionsDraft.newEntries as newRow, idx (newRow.id)}
				{@const inputName = (prefix: string) => `${table}[${idx}][${prefix}]`}
				<Table.Row class="bg-primary/10">
					<input type="hidden" name={inputName('id')} value={newRow.id} />
					<Table.Cell class="text-center">-</Table.Cell>
					<Table.Cell>
						<Input
							name={inputName('code')}
							type="text"
							placeholder="code"
							bind:value={newRow.code}
							class="h-8 border-none"
							required />
					</Table.Cell>
					<Table.Cell>
						<Input
							name={inputName('name')}
							type="text"
							placeholder="name"
							bind:value={newRow.name}
							class="h-8 border-none"
							required />
					</Table.Cell>
					<Table.Cell>
						<Input
							name={inputName('description')}
							type="text"
							placeholder="description"
							bind:value={newRow.description}
							class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell class="text-center">
						<SwitchInput name={inputName('active')} bind:checked={newRow.active} />
					</Table.Cell>
					<Table.Cell class="items-center text-center">
						<Button variant="ghost" size="sm" onclick={() => onRemove(newRow.referenceId)}>
							<TrashIcon />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
