<script lang="ts">
	import type { PageProps } from './$types';
	import type { TablePermissions } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash';
	import PermissionsTable from '$lib/components/permissions-table.svelte';
	import PostActionForm from '$lib/components/post-action-form.svelte';
	import { Badge } from '$ui/badge/index';
	import { Skeleton } from '$ui/skeleton/index';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Checkbox } from '$ui/checkbox/index';
	import * as Sheet from '$ui/sheet/index';
	import * as Select from '$ui/select/index';
	import * as Table from '$ui/table/index';
	import { DraftState, TableDataState } from '$lib/data-utils';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { DEFAULT_RESOURCES } from '$lib/defaults/app-defaults';

	let { data }: PageProps = $props();
	let resFormOpen = $state(false);
	let roleFormElem: HTMLFormElement | undefined = $state();
	let addFormElem: HTMLFormElement | undefined = $state();
	let activeRoleId: string = $state('');
	let isBusy = $state(false);
	let selectedRole = $derived(
		data.settingsPermissions.roles.find((role) => role.id === Number(activeRoleId))
	);

	const permDraft = new DraftState<TablePermissions>(
		'role_permissions',
		{ primary: ['roleId', 'resourceId'], isRequired: true },
		{ canCreate: false, canRead: false, canUpdate: false, canDelete: false }
	);

	let permData = new TableDataState<TablePermissions, 'roleId' | 'resourceId'>(
		[],
		['resourceId', 'roleId']
	);

	let postForm = $derived.by(() => {
		let temp: {
			data: Map<string, TablePermissions>;
			action: string;
			dataKeys: (keyof TablePermissions)[];
		} = {
			data: new Map<string, TablePermissions>(),
			action: '',
			dataKeys: []
		};
		if (permDraft.actionState === 'create') {
			temp.data = permDraft.newEntries;
			temp.action = '?/create';
			temp.dataKeys = [
				'roleId',
				'resourceId',
				'canCreate',
				'canRead',
				'canUpdate',
				'canDelete',
				'locked'
			];
		} else if (permDraft.actionState === 'update') {
			temp.data = permDraft.modifiedEntries;
			temp.action = '?/update';
			temp.dataKeys = ['roleId', 'resourceId', 'canCreate', 'canRead', 'canUpdate', 'canDelete'];
		} else if (permDraft.actionState === 'delete') {
			temp.data = permDraft.removedEnries;
			temp.action = '?/delete';
			temp.dataKeys = ['roleId', 'resourceId'];
		}
		return temp;
	});

	const onSelectRole: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { permissions } = result.data;
				permData.data = permissions.rows;
			}
			if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}

			isBusy = false;
		};
	};

	const onPostPermissions: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { rows, error } = result.data;
				if (error) {
					console.error(error);
				} else {
					permData.update(rows);
					permDraft.discardAllChanges();

					resFormOpen = false;
				}
			} else if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}
			isBusy = false;
		};
	};

	async function onValueChange() {
		await tick();
		roleFormElem?.requestSubmit();
	}

	async function addRoles() {
		await tick();
		addFormElem?.requestSubmit();
	}

	async function onDelete(permission: TablePermissions) {
		permDraft.deleteEntry(permission);
		await tick();
	}

	function onEdit(entry: TablePermissions) {
		permDraft.updateEntry(entry);
	}

	function onClear() {
		permDraft.discardAllChanges();
	}

	function onOpenChange(open: boolean) {
		if (!open) {
			permDraft.discardAllChanges();
		}
	}

	function onChange(checked: boolean, resourceId: number) {
		if (selectedRole) {
			if (checked) {
				permDraft.addEntry({ roleId: selectedRole.id, resourceId });
			} else {
				const mapKey = permDraft.getMapKey({ roleId: selectedRole.id, resourceId });
				permDraft.discardEntry(mapKey);
			}
		}
	}

	function onAddResource() {
		const roleId = selectedRole?.id;
		DEFAULT_RESOURCES.forEach((item) => {
			if (roleId && !permData.has({ roleId, resourceId: item.resourceId })) {
				permDraft.addEntry({ roleId, ...item });
			}
		});
		resFormOpen = true;
	}
</script>

{#if postForm.data.size}
	<PostActionForm
		hidden
		table={permDraft.entity}
		enhanceFunction={onPostPermissions}
		bind:ref={addFormElem}
		{...postForm}
	/>
{/if}

{#await data.settingsPermissions}
	<div class="w-full max-w-2xl space-y-4 md:max-w-4xl">
		<Skeleton class="h-9" />
		<div class="space-y-2 rounded-lg border p-2">
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
			<Skeleton class="h-9" />
		</div>
	</div>
{:then { resources, roles }}
	<div class="w-full max-w-2xl overflow-auto md:max-w-4xl">
		<div class="flex-col justify-start gap-4">
			<div class="flex items-center justify-between">
				{#if selectedRole}
					<Sheet.Root bind:open={resFormOpen} {onOpenChange}>
						<Sheet.Content side="right" class="min-w-lg">
							<Sheet.Header>
								<Sheet.Title>Additional Permissions</Sheet.Title>
								<Sheet.Description>
									Add additional access for <strong class="capitialize">{selectedRole.name}</strong>
									role.
									<Table.Root class="mt-4">
										<Table.Header>
											<Table.Row>
												<Table.Head>Select</Table.Head>
												<Table.Head>Resource</Table.Head>
												<Table.Head>Description</Table.Head>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{#each resources as resource (resource.id)}
												{@const hasResource = permData.has({
													roleId: selectedRole.id,
													resourceId: resource.id
												})}
												{@const isDefault = DEFAULT_RESOURCES.some(
													(item) => item.resourceId === resource.id
												)}
												<Table.Row>
													<Table.Cell>
														{#if hasResource || isDefault}
															<Checkbox disabled={hasResource || isDefault} checked={hasResource || isDefault} />
														{:else}
															<Checkbox
																onCheckedChange={(checked) => onChange(checked, resource.id)}
															/>
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
							{@const isFull = resources.length > 0 && resources.length === permData.size}
							<Sheet.Footer class="flex flex-row items-center gap-2">
								<Button variant="outline" onclick={addRoles} disabled={isFull || isBusy}
									>Add Resources</Button
								>
								<Sheet.Close class={buttonVariants({ variant: 'destructive' })} disabled={isBusy}
									>Cancel</Sheet.Close
								>
							</Sheet.Footer>
						</Sheet.Content>
					</Sheet.Root>
				{/if}
				<form
					method="POST"
					action="?/get-permissions"
					use:enhance={onSelectRole}
					bind:this={roleFormElem}
				>
					<Select.Root type="single" bind:value={activeRoleId} {onValueChange} name="roleId">
						<Select.Trigger class="w-[180px]">
							{selectedRole?.name ?? 'Selected Role'}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Roles</Select.Label>
								{#each roles as role (role.id)}
									{#if role.active}
										<Select.Item
											value={String(role.id)}
											label={role.name}
											disabled={role.id === selectedRole?.id}
										>
											{role.name}
										</Select.Item>
									{/if}
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</form>
				<div class="flex items-center gap-2">
					{#if selectedRole}
						<Button variant="outline" size="sm" disabled={!permDraft.hasChanges || isBusy}>
							<BusyIcon {isBusy}><Save /></BusyIcon>
							<span class="hidden md:inline">Save</span>
							{#if permDraft.currentTotal}
								<Badge
									variant="destructive"
									class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
									>{permDraft.currentTotal}
								</Badge>
							{/if}
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={!permDraft.hasChanges || isBusy}
							onclick={onClear}
						>
							<BusyIcon {isBusy}><Trash class="text-destructive" /></BusyIcon>
							<span class="hidden md:inline">Clear</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={permDraft.modifiedEntries.size > 0 || isBusy}
							onclick={onAddResource}
						>
							<BusyIcon {isBusy}><Plus /></BusyIcon>
							<span class="hidden md:inline">Add</span>
						</Button>
					{/if}
				</div>
			</div>
			<div class="relative flex flex-col overflow-auto pt-4">
				<div class="overflow-hidden rounded-lg border p-2">
					<PermissionsTable
						role={selectedRole}
						permissions={permData.data}
						{resources}
						{permDraft}
						{onDelete}
						{onEdit}
					/>
				</div>
			</div>
		</div>
	</div>
{:catch}
	<h1>Server Error</h1>
{/await}
