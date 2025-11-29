<script lang="ts">
	import type { TablePermissions, TableResources, TableRoles } from '$lib/app-types';
	import * as Table from '$ui/table/index';
	import * as DropdownMenu from '$ui/dropdown-menu/index';
	import { Button } from '$ui/button/index';
	import { Switch } from '$ui/switch/index';
	import Lock from '@lucide/svelte/icons/lock';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import X from '@lucide/svelte/icons/x';
	import type { DraftState } from '$lib/data-utils';

	interface PermTableProps {
		role?: TableRoles;
		permissions: TablePermissions[];
		resources: TableResources[];
		permDraft: DraftState<TablePermissions>;
		onDelete: (permission: TablePermissions) => void;
		onEdit: (permissions: TablePermissions) => void;
		onDiscard: (refId: string | TablePermissions) => void;
	}

	let { role, resources, permDraft, permissions, onDelete }: PermTableProps = $props();
</script>

<Table.Root>
	<Table.Caption>{role?.name ?? 'Role'} Access</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="width-auto">Resource</Table.Head>
			<Table.Head class="truncate">Description</Table.Head>
			<Table.Head class="w-1/10 text-center">Create</Table.Head>
			<Table.Head class="w-1/10 text-center">Read</Table.Head>
			<Table.Head class="w-1/10 text-center">Update</Table.Head>
			<Table.Head class="w-1/10 text-center">Delete</Table.Head>
			<Table.Head class="text-center">Action</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#if role}
			{#each permissions as perm (perm.resourceId)}
				{@const resource = resources.find((res) => res.id === perm.resourceId)}
				{@const mapKey = permDraft.getMapKey(perm)}
				{@const editEntry = permDraft.modifiedEntries.get(mapKey)}
				<Table.Row class={[perm.locked ? 'text-primary/75' : '']}>
					<Table.Cell class={[editEntry ? 'border-l-2 border-destructive' : '']}
						>{resource?.name ?? 'Resource'}</Table.Cell
					>
					<Table.Cell>{resource?.description ?? 'Description'}</Table.Cell>
					{#if editEntry}
						<Table.Cell class="text-center">
							<Switch bind:checked={editEntry.canCreate} />
						</Table.Cell>
						<Table.Cell class="text-center">
							<Switch bind:checked={editEntry.canRead} />
						</Table.Cell>
						<Table.Cell class="text-center">
							<Switch bind:checked={editEntry.canUpdate} />
						</Table.Cell>
						<Table.Cell class="text-center">
							<Switch bind:checked={editEntry.canDelete} />
						</Table.Cell>
						<Table.Cell class="text-center">
							<Button variant="ghost" size="sm" onclick={() => permDraft.discardEntry(mapKey)}>
								<X class="text-destructive" />
							</Button>
						</Table.Cell>
					{:else}
						<Table.Cell class={['text-center', perm.canCreate ? '' : 'text-destructive']}
							>{perm.canCreate ? 'Yes' : 'No'}
						</Table.Cell>
						<Table.Cell class={['text-center', perm.canRead ? '' : 'text-destructive']}
							>{perm.canRead ? 'Yes' : 'No'}
						</Table.Cell>
						<Table.Cell class={['text-center', perm.canUpdate ? '' : 'text-destructive']}
							>{perm.canUpdate ? 'Yes' : 'No'}
						</Table.Cell>
						<Table.Cell class={['text-center', perm.canDelete ? '' : 'text-destructive']}
							>{perm.canDelete ? 'Yes' : 'No'}
						</Table.Cell>
						<Table.Cell class="flex justify-center">
							{#if perm.locked}
								<span
									class="flex size-8 items-center justify-center text-muted-foreground data-[state=open]:bg-muted"
								>
									<Lock size={16} />
								</span>
							{:else}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger
										class="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
									>
										{#snippet child({ props })}
											<Button variant="ghost" size="sm" {...props}>
												<EllipsisVertical />
												<span class="sr-only">Open menu</span>
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="w-32">
										<DropdownMenu.Item onSelect={() => permDraft.updateEntry(perm)}>
											Edit
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										<DropdownMenu.Item onSelect={() => onDelete(perm)} variant="destructive">
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{/if}
						</Table.Cell>
					{/if}
				</Table.Row>
			{/each}
		{/if}
	</Table.Body>
</Table.Root>
