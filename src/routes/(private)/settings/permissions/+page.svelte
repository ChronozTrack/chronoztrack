<script lang="ts">
	import type { PageProps } from './$types';
	import type { TablePermissions } from '$lib/app-types';
  import BusyIcon from '$lib/components/busy-icon.svelte';
  import {PlusIcon, SaveIcon, TrashIcon} from '@lucide/svelte/icons';
  import {Badge} from '$ui/badge/index'
	import { Skeleton } from '$ui/skeleton/index';
	import {Button} from '$ui/button/index';
  import * as Select from '$ui/select/index';
	import { DataState } from '$lib/data-utils';

	let { data }: PageProps = $props();
	let roleId: string  = $state("");
  let isBusy = $state(false);
	let selectedRole = $derived(
		data.settingsPermissions.roles.find((role) => role.id === Number(roleId))?.name ?? "Select Role"
	);
  const dataState = new DataState<TablePermissions>(null, {
		code: '',
		name: '',
		description: '',
		active: true,
		locked: true
	});
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
				<Select.Root type="single" name="roles" bind:value={roleId}>
					<Select.Trigger class="w-[180px]">
						{selectedRole}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Roles</Select.Label>
							{#each settingsPermissions.roles as role (role.id)}
								<Select.Item
									value={String(role.id)}
									label={role.name}
									disabled={String(role.id) === roleId}>
									{role.name}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
        <div class="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
            disabled={!dataState.hasChanges || isBusy}>
						<BusyIcon {isBusy}><SaveIcon /></BusyIcon>
						<span class="hidden md:inline">Save</span>
						{#if dataState.hasChanges}
							<Badge
								variant="destructive"
								class="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums"
								>{dataState.updatedData.length || dataState.createdData.length}
							</Badge>
						{/if}
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={!dataState.hasChanges || isBusy}>
						<BusyIcon {isBusy}><TrashIcon class="text-destructive" /></BusyIcon>
						<span class="hidden md:inline">Clear</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						disabled={dataState.updatedData.length > 0 || isBusy}>
						<BusyIcon {isBusy}><PlusIcon /></BusyIcon>
						<span class="hidden md:inline">Add</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
{:catch}
	<h1>Server Error</h1>
{/await}
