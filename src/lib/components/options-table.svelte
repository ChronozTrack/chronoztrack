<script lang="ts">
	import type { AppPages, OptionsBaseTable } from '$lib/app-types';
	import type { WithTemporaryId } from '$lib/data-utils/data-state.svelte';
	import * as Table from '$ui/table/index';
	import * as Select from '$ui/select/index';
	import { Button } from '$ui/button/index';
	import { Switch } from '$ui/switch/index';
	import { Input } from '$ui/input/index';
	import { Pencil, TrashIcon } from '@lucide/svelte/icons';
	import { DataState } from '$lib/data-utils/data-state.svelte';

	interface OptionsTableProps {
		table: string;
		options: AppPages;
		data: OptionsBaseTable[];
		updatedData: Map<number, OptionsBaseTable>;
		createdData: Map<string, WithTemporaryId<OptionsBaseTable>>;
		onDiscard: (id: number) => void;
		onEdit: (data: OptionsBaseTable) => void;
		dataState: DataState<OptionsBaseTable>;
	}

	let {
		data = [],
		options,
		updatedData,
		createdData,
		onDiscard,
		onEdit,
		dataState,
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
		{#each data as row}
			{@const editRow = updatedData.get(row.id)}
			<Table.Row>
				<Table.Cell class="text-center">{row.id}</Table.Cell>
				{#if dataState.table === table && editRow}
					<Table.Cell>
						<Input type="text" placeholder={editRow.code} class="max-w-xs border-none" />
					</Table.Cell>
					<Table.Cell>
						<Input type="text" placeholder={editRow.name} class="max-w-xs border-none" />
					</Table.Cell>
					<Table.Cell>
						<Input type="text" placeholder={editRow.description} class="max-w-xs border-none" />
					</Table.Cell>
					<Table.Cell class="text-center">
						<Switch bind:checked={editRow.active} />
					</Table.Cell>
					<Table.Cell class="text-center">
						<Button variant="ghost" size="sm" onclick={() => onDiscard(row.id)}>
							<TrashIcon />
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
							disabled={createdData.size > 0}
							onclick={() => onEdit(row)}>
							<Pencil />
						</Button>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
