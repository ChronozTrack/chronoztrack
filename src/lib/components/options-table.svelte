<script lang="ts">
	import type { AppPages, OptionsBaseTable } from '$lib/app-types';
  import {SvelteMap} from 'svelte/reactivity'
	import * as Table from '$ui/table/index';
	import { Button } from '$ui/button/index';
	import { Input } from '$ui/input/index';
	import { Pencil, TrashIcon } from '@lucide/svelte/icons';

	interface OptionsTableProps {
		options: AppPages;
		data: OptionsBaseTable[];
	}
	let { data = [], options }: OptionsTableProps = $props();
	let toUpdate: Map<number, OptionsBaseTable> = new SvelteMap(new Map());
	let hasUpdates = $derived(toUpdate.size);

	function onEdit(row: OptionsBaseTable) {
		toUpdate.set(row.id, structuredClone(row));
	}

	function onDiscard(id: number) {
		if (toUpdate.has(id)) {
			toUpdate.delete(id);
		}
	}

  $inspect(toUpdate)
</script>

<Table.Root>
	<Table.Caption>List of {options.title} option.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-center">Id</Table.Head>
			<Table.Head>Code</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Description</Table.Head>
			<Table.Head class="text-center">Active</Table.Head>
			<Table.Head class="text-center">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as row}
			<Table.Row>
				<Table.Cell class="text-center">{row.id}</Table.Cell>
				{#if toUpdate.has(row.id)}
					<Table.Cell><Input type="text" placeholder={row.code} class="max-w-xs" /></Table.Cell>
					<Table.Cell>{row.name}</Table.Cell>
					<Table.Cell>{row.description}</Table.Cell>
					<Table.Cell class="text-center">{row.active ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell class="text-center">
						<Button variant="ghost" size="sm" onclick={() => onDiscard(row.id)}>
							<TrashIcon />
						</Button>
					</Table.Cell>
				{:else}
					<Table.Cell>{row.code}</Table.Cell>
					<Table.Cell>{row.name}</Table.Cell>
					<Table.Cell>{row.description}</Table.Cell>
					<Table.Cell class="text-center">{row.active ? 'Yes' : 'No'}</Table.Cell>
					<Table.Cell class="text-center">
						<Button variant="ghost" size="sm" onclick={() => onEdit(row)}>
							<Pencil />
						</Button>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
