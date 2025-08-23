<script lang="ts">
	import type { TablePermissions, TableResources, TableRoles } from '$lib/app-types';
	import type { DraftState } from '$lib/data-utils';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Checkbox } from '$ui/checkbox/index';
	import { ScrollArea } from '$ui/scroll-area/index';
	import * as Sheet from '$ui/sheet/index';
	import * as Table from '$ui/table/index';

	interface PermProps {
		open: boolean;
		role: TableRoles;
		resources: TableResources[];
		permissions: TablePermissions[];
		permDraft: DraftState<TablePermissions>;
    addRoles: () => void;
	}

	const TABLE = 'role_permissions';
	let {
		open = $bindable(false),
		role,
		resources,
		permissions,
		permDraft,
    addRoles,
		...restProps
	}: PermProps = $props();
	let roleResource = $derived(new Set(permissions.map((perm) => perm.resourceId)));

	function onChange(checked: boolean, resourceId: number) {
		if (checked) {
			permDraft.addEntry({ roleId: role.id, resourceId });
		} else {
			const entry = permDraft.getEntryByIds('new', { resourceId });
			if (entry) {
				permDraft.discardEntry(entry.referenceId);
			}
		}
	}
</script>

<Sheet.Root bind:open {...restProps}>
	<Sheet.Content side="right" class="min-w-lg">
		<Sheet.Header>
			<Sheet.Title>Additional Permissions</Sheet.Title>
			<Sheet.Description>
				Add additional access for the <strong class="capitialize">{role.name}</strong>
				<Table.Root class="mt-4">
					<Table.Header>
						<Table.Row>
							<Table.Head>Select</Table.Head>
							<Table.Head>Resource</Table.Head>
							<Table.Head>Description</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each resources as resource, idx (resource.id)}
							{@const hasResource = roleResource.has(resource.id)}
							{@const inputName = (prefix: string) =>
								hasResource ? undefined : `${TABLE}[${idx}][${prefix}]`}
							<Table.Row>
								<Table.Cell>
									{#if hasResource}
										<Checkbox disabled={hasResource} checked={hasResource} />
									{:else}
										<Checkbox
											name={inputName('resourceId')}
											onCheckedChange={(checked) => onChange(checked, resource.id)} />
									{/if}
								</Table.Cell>
								<Table.Cell>{resource.name}</Table.Cell>
								<Table.Cell>{resource.description}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Sheet.Description>
		</Sheet.Header>
		<Sheet.Footer class="flex flex-row items-center gap-2">
			<Button variant="outline" onclick={addRoles}>Add Resources</Button>
			<Sheet.Close class={buttonVariants({ variant: 'destructive' })}>Cancel</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
