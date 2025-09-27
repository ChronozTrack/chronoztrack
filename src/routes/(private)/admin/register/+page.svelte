<script lang="ts">
	/**
	 * Create users details
	 * User Account:
	 * User Designation: Department and Job
	 * User Schedule: user Schedule (id) for manual update flag only in frontend.
	 */
	import type { PageProps } from './$types';
	import type { OptionsCore, TableSchedules, TableTemplates } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { convertTo12Hour, getTimezoneMaps } from '$lib/utils';
	import { DEFAULT_SCHEDULE } from '$lib/defaults/app-defaults';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { Button } from '$ui/button/index';
	import { Input } from '$ui/input/index';
	import { Label } from '$ui/label/index';
	import { Separator } from '$ui/separator/index';
	import * as Card from '$ui/card/index';
	import * as Select from '$ui/select/index';
	import * as Dialog from '$ui/dialog/index';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import Pencil from '@lucide/svelte/icons/pencil';
	import ScheduleForm from '$lib/components/schedule-form.svelte';

	let { data }: PageProps = $props();
	const _user = (key: string) => `users[0][${key}]`;
	const _designation = (key: string) => `user_designations[0][${key}]`;
	const _schedule = (key: string) => `user_schedules[0][${key}]`;
	const _scheduleEvent = (idx: number, key: string) => `${_schedule('events')}[${idx}][${key}]`;
	const departments = new Map<number, OptionsCore>(data.options.departments.map((d) => [d.id, d]));
	const jobs = new Map<number, OptionsCore>(data.options.jobs.map((j) => [j.id, j]));
	const timeEvents = new Map<string, OptionsCore>(data.options.time_events.map((t) => [t.code, t]));
	const { timeZonesMap, timeZonesRawMap } = getTimezoneMaps();

	let deptFormElem: HTMLFormElement | null = $state(null);
	let userId: number | null = $state(null);
	let isBusy = $state(false);
	let editSchedule = $state(false);
	let schedTemplates: NonNullable<TableTemplates>[] = $state([]);
	let userDepartment: OptionsCore | undefined = $state();
	let userJob: OptionsCore | undefined = $state();
	let userSchedTemplate: NonNullable<TableTemplates> | undefined = $state();
	let userSchedule: TableSchedules = $state(structuredClone(DEFAULT_SCHEDULE));
	let draftSchedule: TableSchedules = $state(structuredClone(DEFAULT_SCHEDULE));

	const onUserAdd: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { user } = result.data;
				console.log(user);
			} else if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}
		};
	};
	const onSelectDept: SubmitFunction = async () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const { templates } = result.data;
				schedTemplates = templates.rows;
				setSchedTemplate(userSchedule.id === 0);
			} else if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}

			isBusy = false;
		};
	};

	async function onDepartmentChange() {
		if (userDepartment) {
			await tick();
			deptFormElem?.requestSubmit();
		}
	}

	function onJobChange() {
		setSchedTemplate(userSchedule.id === 0);
	}

	async function setSchedTemplate(isSetSched = false, value?: string) {
		if (value) {
			userSchedTemplate = schedTemplates.find((s) => s.id === Number(value));
		} else if (schedTemplates.length > 0 && (userDepartment || userJob)) {
			userSchedTemplate = schedTemplates.find((sched) => {
				const { departmentId, jobId } = sched;
				return (
					(departmentId === userDepartment?.id && jobId === userJob?.id) ||
					departmentId === userDepartment?.id ||
					jobId === userJob?.id
				);
			});
		}

		if (isSetSched && userSchedTemplate) {
			userSchedule = Object.assign(
				userSchedule,
				structuredClone($state.snapshot(userSchedTemplate.template))
			);
			userSchedule.id = 0;
		}
	}

	function getTimezoneLabel(name: string) {
		return timeZonesMap.get(name)?.label ?? name;
	}

	function updateDraftSchedule() {
		if (userSchedTemplate && userSchedule.id === 0) {
			draftSchedule = Object.assign(
				draftSchedule,
				structuredClone($state.snapshot(userSchedTemplate.template))
			);
		}
	}

	function editUserSchedule() {
		editSchedule = true;
		updateDraftSchedule();
	}

	function onSaveSchedule() {
		userSchedule = Object.assign(userSchedule, structuredClone($state.snapshot(draftSchedule)));
		userSchedule.id = 1; //set to 1 for manual update
		editSchedule = false;
	}
</script>

{#if userDepartment}
	<form
		method="POST"
		action="?/get-templates"
		use:enhance={onSelectDept}
		hidden
		bind:this={deptFormElem}
	>
		<input type="hidden" name="departmentId" value={userDepartment.id} />
	</form>
{/if}

<Dialog.Root bind:open={editSchedule}>
	<Dialog.Content class="min-w-4xl" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>Edit Schedule</Dialog.Title>
		</Dialog.Header>
		<ScheduleForm
			bind:data={draftSchedule}
			timeEventOption={timeEvents}
			{timeZonesMap}
			{timeZonesRawMap}
			isReadOnly={isBusy}
			prefixName={''}
		/>
		<Dialog.Footer>
			<div class="flex items-center justify-end gap-2">
				<Button variant="outline" size="sm" disabled={isBusy} onclick={onSaveSchedule}>Save</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={isBusy}
					onclick={() => (editSchedule = false)}
					class="text-destructive">Cancel</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="flex w-full items-center justify-center px-4">
	<Card.Root class="mx-auto mt-16 w-full max-w-2xl">
		<Card.Header>
			<Card.Title class="text-2xl">Add User</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" id="form-register" use:enhance={onUserAdd} action="?/create">
				<fieldset hidden>
					<input type="hidden" name={_schedule('userId')} value={userId} />
					<input type="hidden" name={_designation('userId')} value={userId} />
					{#each Object.entries(userSchedule) as [key, value] (key)}
						{#if key !== 'events' && key !== 'userId' && !Array.isArray(value)}
							<input type="hidden" {value} name={_schedule(key)} required />
						{:else if Array.isArray(value)}
							{#each value as event, idx (idx)}
								{#each Object.entries(event) as [eventKey, eventValue], eventIdx (eventIdx)}
									<input type="hidden" value={eventValue} name={_scheduleEvent(idx, eventKey)} />
								{/each}
							{/each}
						{/if}
					{/each}
				</fieldset>
				<fieldset disabled={isBusy}>
					<div class="grid gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_user('id')}>Employee ID</Label>
							<Input
								class="col-span-3"
								name={_user('id')}
								id={_user('id')}
								type="alphanumeric"
								placeholder="123456"
								bind:value={userId}
								required
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_user('name')}>Fullname</Label>
							<Input
								class="col-span-3"
								name={_user('name')}
								id={_user('name')}
								type="text"
								required
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_designation('departmentId')}>Department</Label>
							<Select.Root
								type="single"
								bind:value={
									() => String(userDepartment?.id ?? ''),
									(v) => (userDepartment = departments.get(Number(v)))
								}
								name={_designation('departmentId')}
								required={true}
								disabled={isBusy}
								onValueChange={onDepartmentChange}
							>
								<Select.Trigger class="col-span-3 w-full">
									{userDepartment?.name ?? 'Select Department'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Departments</Select.Label>
										{#each departments.entries() as [id, dept] (id)}
											<Select.Item
												value={String(id)}
												label={dept.name}
												disabled={dept.id === userDepartment?.id}>{dept.name}</Select.Item
											>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_designation('jobId')}>Job</Label>
							<Select.Root
								type="single"
								bind:value={() => String(userJob?.id ?? ''), (v) => (userJob = jobs.get(Number(v)))}
								name={_designation('jobId')}
								required={true}
								disabled={isBusy}
								onValueChange={onJobChange}
							>
								<Select.Trigger class="col-span-3 w-full">
									{userJob?.name ?? 'Select Job'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Jobs</Select.Label>
										{#each jobs.entries() as [id, job] (id)}
											<Select.Item
												value={String(id)}
												label={job.name}
												disabled={job.id === userJob?.id}>{job.name}</Select.Item
											>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						{#if userSchedTemplate}
							<Separator class="my-1" />
							<div class="grid grid-cols-4 items-center gap-x-4 gap-y-1">
								<Label class="justify-end">Schedule Template</Label>
								<Select.Root
									type="single"
									bind:value={
										() => String(userSchedTemplate?.id ?? ''), (v) => setSchedTemplate(true, v)
									}
									required={true}
									disabled={isBusy}
								>
									<Select.Trigger class="col-span-3 w-full">
										{userSchedTemplate?.name ?? 'Select Schedule'}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Select Schedules</Select.Label>
											{#each schedTemplates as temp (temp.id)}
												<Select.Item
													value={String(temp.id)}
													label={temp.name}
													disabled={temp.id === userSchedTemplate?.id}>{temp.name}</Select.Item
												>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
								<div></div>
								<p class="col-span-3 w-full pl-3 text-sm text-muted-foreground">
									{userSchedTemplate?.name ?? ''}
								</p>
							</div>
						{/if}
						{#if userDepartment}
							<div class="relative grid gap-4 rounded-lg border p-4">
								<Button
									size="sm"
									variant="ghost"
									class="absolute top-2 right-2"
									onclick={editUserSchedule}
								>
									<BusyIcon><Pencil /></BusyIcon>
								</Button>
								<div class="grid grid-cols-4 items-center gap-4">
									<Label class="justify-end">User Timezone:</Label>
									<small class="col-span-3 text-sm"
										>{getTimezoneLabel(userSchedule.userTimezone)}</small
									>
									<Label class="justify-end">Client Timezone:</Label>
									<small class="col-span-3 text-sm"
										>{getTimezoneLabel(userSchedule.clientTimezone)}</small
									>
								</div>
								<div class="grid grid-flow-row grid-cols-2 gap-4">
									<div class="grid grid-cols-2 items-center gap-4">
										<Label class="justify-end">Schedule:</Label>
										<small class="w-full text-sm">
											<span>{convertTo12Hour(userSchedule.clockIn)}</span>
											<span> - </span>
											<span>{convertTo12Hour(userSchedule.clockOut)}</span>
										</small>
									</div>
									{#each userSchedule.events as event, idx (idx)}
										<div class="grid grid-cols-2 items-center gap-4">
											<Label class="justify-end capitalize">{event.timeEvent}:</Label>
											<small class="w-full text-sm">
												<span>{convertTo12Hour(event.startTime)}</span>
												<span> - </span>
												<span>{convertTo12Hour(event.endTime)}</span>
											</small>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</fieldset>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-end">
			<Button form="form-register" type="submit" disabled={isBusy}>
				<BusyIcon>Submit</BusyIcon>
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
