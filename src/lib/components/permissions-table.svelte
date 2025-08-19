<script lang="ts">
	import type { TablePermissions, TableResources, TableRoles } from '$lib/app-types';
	import * as Table from '$ui/table/index';
	import { Button } from '$ui/button/index';
	import SwitchInput from '$lib/components/switch-input.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Lock from '@lucide/svelte/icons/lock';

	interface PermTableProps {
		role: TableRoles;
		permissions: TablePermissions[];
		resources: TableResources[];
	}

	const TABLE = 'role_permissions';
	let { role, resources, permissions }: PermTableProps = $props();
</script>

<Table.Root>
	<Table.Caption>{role.name} Access</Table.Caption>
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
		{#each permissions as perm, idx (perm.resourceId)}
			{@const resource = resources.find((res) => res.id === perm.resourceId)}
			{@const inputName = (prefix: string) => `${TABLE}[${idx}][${prefix}]`}
			{@const isEdit = false}
			<Table.Row class={[perm.locked ? 'text-primary/75' : '', isEdit ? 'bg-primary/10' : '']}>
				<Table.Cell>{resource?.name ?? 'Resource'}</Table.Cell>
				<Table.Cell>{resource?.description ?? 'Description'}</Table.Cell>
				{#if isEdit}
					<Table.Cell class="text-center">
						<SwitchInput
							name={inputName('canCreate')}
							bind:checked={perm.canCreate}
							disabled={perm.locked} />
					</Table.Cell>
					<Table.Cell class="text-center">
						<SwitchInput
							name={inputName('canRead')}
							bind:checked={perm.canRead}
							disabled={perm.locked} />
					</Table.Cell>
					<Table.Cell class="text-center">
						<SwitchInput
							name={inputName('canUpdate')}
							bind:checked={perm.canUpdate}
							disabled={perm.locked} />
					</Table.Cell>
					<Table.Cell class="text-center">
						<SwitchInput name={inputName('canDelete')} bind:checked={perm.canDelete} disabled />
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
					<Table.Cell class="text-center">
						<Button variant="ghost" size="sm">
							{#if perm.locked}
								<Lock />
							{:else}
								<Pencil />
							{/if}
						</Button>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
