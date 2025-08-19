<script lang="ts">
	import type { PageProps } from './$types';
	import type { TablePermissions } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import Plus from '@lucide/svelte/icons/plus';
	import Save from '@lucide/svelte/icons/save';
	import Trash from '@lucide/svelte/icons/trash';
	import PermissionsTable from '$lib/components/permissions-table.svelte';
	import { Badge } from '$ui/badge/index';
	import { Skeleton } from '$ui/skeleton/index';
	import { Button } from '$ui/button/index';
	import * as Select from '$ui/select/index';
	import { DraftState } from '$lib/data-utils';
	import { applyAction, enhance } from '$app/forms';
	import { tick } from 'svelte';

	let { data }: PageProps = $props();
	let roleForm: HTMLFormElement | undefined = $state();
	let activeRoleId: string = $state('');
	let isBusy = $state(false);
	let selectedRole = $derived(
		data.settingsPermissions.roles.find((role) => role.id === Number(activeRoleId))
	);

	const permDraft = new DraftState<TablePermissions>(
		'',
		{ required: ['resourceId', 'roleId'] },
		{ canCreate: false, canRead: false, canUpdate: false, canDelete: false }
	);
	let permData: TablePermissions[] = $state([]);

	const onSelectRole: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { permissions } = result.data;
				permData = permissions.rows;
			}
			if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}

			isBusy = false;
		};
	};

	async function onValueChange() {
		await tick();
		roleForm?.requestSubmit();
	}
</script>

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
{:then settingsPermissions}
	<div class="w-full max-w-2xl overflow-auto md:max-w-4xl">
		<div class="flex-col justify-start gap-4">
			<div class="flex items-center justify-between">
				<form
					method="POST"
					action="?/get-permissions"
					use:enhance={onSelectRole}
					bind:this={roleForm}>
					<Select.Root type="single" bind:value={activeRoleId} {onValueChange} name="roleId">
						<Select.Trigger class="w-[180px]">
							{selectedRole?.name ?? 'Selected Role'}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Roles</Select.Label>
								{#each settingsPermissions.roles as role (role.id)}
									{#if role.active}
										<Select.Item
											value={String(role.id)}
											label={role.name}
											disabled={role.id === selectedRole?.id}>
											{role.name}
										</Select.Item>
									{/if}
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</form>
				<div class="flex items-center gap-2">
					{#if permData.length}
						<Button variant="outline" size="sm" disabled={!permDraft.hasChanges || isBusy}>
							<BusyIcon {isBusy}><Save /></BusyIcon>
							<span class="hidden md:inline">Save</span>
							{#if permDraft.hasChanges}
								<Badge
									variant="destructive"
									class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
									>{permDraft.modifiedEntries.length || permDraft.newEntries.length}
								</Badge>
							{/if}
						</Button>
						<Button variant="outline" size="sm" disabled={!permDraft.hasChanges || isBusy}>
							<BusyIcon {isBusy}><Trash class="text-destructive" /></BusyIcon>
							<span class="hidden md:inline">Clear</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={permDraft.modifiedEntries.length > 0 || isBusy}>
							<BusyIcon {isBusy}><Plus /></BusyIcon>
							<span class="hidden md:inline">Add</span>
						</Button>
					{/if}
				</div>
			</div>
			<div class="relative flex flex-col overflow-auto pt-4">
				<div class="overflow-hidden rounded-lg border p-2">
					{#if selectedRole}
						<PermissionsTable
							role={selectedRole}
							permissions={permData}
							resources={settingsPermissions.resources} />
					{/if}
				</div>
			</div>
		</div>
	</div>
{:catch}
	<h1>Server Error</h1>
{/await}
