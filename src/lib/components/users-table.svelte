<script lang="ts">
	import type { TableSchedules, UsersData } from '$lib/app-types';
	import type { TableDataState } from '$lib/data-utils';
	import { SvelteSet } from 'svelte/reactivity';
	import { convertTo12Hour } from '$lib/utils';
	import * as Table from '$ui/table/index';
	import * as DropdownMenu from '$ui/dropdown-menu/index';
	import { Checkbox } from '$ui/checkbox/index';
	import { Button } from '$ui/button/index';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';

	interface UsersTableProps {
		users: TableDataState<UsersData, 'id'>;
	}

	let { users }: UsersTableProps = $props();
	let selectedRow = new SvelteSet();

	function onSelectAll(checked: boolean) {
		if (checked) {
			users.data.forEach((s) => selectedRow.add(s.id));
		} else {
			selectedRow.clear();
		}
	}

	function onSelectRow(id: number, checked: boolean) {
		if (checked) {
			selectedRow.add(id);
		} else {
			selectedRow.delete(id);
		}
	}

	function userSchedule(schedule: TableSchedules[]) {
		const current = schedule[0];
		if (!current) return '-';

		return `${convertTo12Hour(current.clockIn)} - ${convertTo12Hour(current.clockOut)}`;
	}

	function onEditUser(user: UsersData){
		console.log(user)
	}

	function onUserSchedule(user: UsersData){
		console.log(user)
	}

	function onPasswordReset(user: UsersData){
		console.log(user)
	}
</script>

<Table.Root>
	<Table.Caption>List of Users</Table.Caption>
	<Table.Header class="sticky top-0 bg-background z-10">
		<Table.Row>
			<Table.Head>
				<Checkbox
					checked={selectedRow.size === users.size}
					indeterminate={selectedRow.size > 0 && selectedRow.size < users.size}
					onCheckedChange={onSelectAll}
				/>
			</Table.Head>
			<Table.Head>Active</Table.Head>
			<Table.Head>ID</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Supervisor</Table.Head>
			<Table.Head>Department</Table.Head>
			<Table.Head>Job</Table.Head>
			<Table.Head>Schedule</Table.Head>
			<Table.Head class="w-[50px]"></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users.data as user}
			<Table.Row>
				<Table.Cell>
					<Checkbox
						checked={selectedRow.has(user.id)}
						onCheckedChange={(checked) => onSelectRow(user.id, checked)}
					/>
				</Table.Cell>
				<Table.Cell>{user.active ? 'Yes' : 'No'}</Table.Cell>
				<Table.Cell>{user.id ?? ''}</Table.Cell>
				<Table.Cell>{user.name ?? ''}</Table.Cell>
				<Table.Cell>{user.supervisor?.name ?? ''}</Table.Cell>
				<Table.Cell><span class="truncate">{user.designations?.[0]?.department?.name ?? ''}</span></Table.Cell>
				<Table.Cell><span class="truncate">{user.designations?.[0]?.job?.name ?? ''}</span></Table.Cell>
				<Table.Cell>
					<small class="text-sm">
						{userSchedule(user.schedules)}
					</small>
				</Table.Cell>
				<Table.Cell class="text-right py-0">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Button class="size-7" {...props} variant="ghost" size="sm"><EllipsisVertical /></Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Item onclick={() => onEditUser(user)}>Edit</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => onUserSchedule(user)}>Schedules</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item onclick={() => onPasswordReset(user)}>Reset Password</DropdownMenu.Item>
								<DropdownMenu.Item class="text-destructive">Deactivate</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
