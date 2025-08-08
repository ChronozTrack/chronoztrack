<script lang="ts">
	import type { AppPages, OptionsBaseTable } from '$lib/app-types';
	import * as Table from '$ui/table/index';
	import { Button } from '$ui/button/index';
	import { Switch } from '$ui/switch/index';
	import { Input } from '$ui/input/index';
	import { PencilIcon, TrashIcon, PencilOffIcon } from '@lucide/svelte/icons';
	import { DataState } from '$lib/data-utils/data-state.svelte';

	interface OptionsTableProps {
		table: string;
		options: AppPages;
		data: OptionsBaseTable[];
		onDiscard: (id: number) => void;
		onEdit: (data: OptionsBaseTable) => void;
		onRemove: (id: string) => void;
		dataState: DataState<OptionsBaseTable>;
	}

	let {
		data = [],
		options,
		onDiscard,
		onRemove,
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
		{#each data as row (row.id)}
			{@const updatedData = dataState.updatedData}
			{@const idx = updatedData.findIndex((item) => item.id === row.id)}
			{@const isEdit = idx >= 0 && dataState.table === table}
			<Table.Row class={[isEdit ? 'bg-primary/10' : '']}>
				<Table.Cell class="text-center">{row.id}</Table.Cell>
				{#if isEdit}
					<Table.Cell>
						<Input type="text" bind:value={updatedData[idx].code} class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell>
						<Input type="text" bind:value={updatedData[idx].name} class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell>
						<Input type="text" bind:value={updatedData[idx].description} class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell class="text-center">
						<Switch bind:checked={updatedData[idx].active} />
					</Table.Cell>
					<Table.Cell class="items-center text-center">
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
							disabled={dataState.actionState === 'create'}
							onclick={() => onEdit(row)}>
							{#if dataState.actionState === 'create'}
								<PencilOffIcon />
							{:else}
								<PencilIcon />
							{/if}
						</Button>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}

		{#if dataState.actionState === 'create'}
			{#each dataState.createdData as newRow (newRow.id)}
				<Table.Row class="bg-primary/10">
					<Table.Cell class="text-center">-</Table.Cell>
					<Table.Cell>
						<Input type="text" placeholder="code" bind:value={newRow.code} class="h-8 border-none" required/>
					</Table.Cell>
					<Table.Cell>
						<Input type="text" placeholder="name" bind:value={newRow.name} class="h-8 border-none" required/>
					</Table.Cell>
					<Table.Cell>
						<Input type="text" placeholder="description" bind:value={newRow.description} class="h-8 border-none" />
					</Table.Cell>
					<Table.Cell class="text-center">
						<Switch bind:checked={newRow.active} />
					</Table.Cell>
					<Table.Cell class="items-center text-center">
						<Button variant="ghost" size="sm" onclick={() => onRemove(newRow.id)}>
							<TrashIcon />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
