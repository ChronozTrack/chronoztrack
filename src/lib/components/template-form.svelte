<script lang="ts">
	import type { DraftState } from '$lib/data-utils';
	import type { UserTimeEventSchedules } from '$lib/app-types';
	import type {
		TableDepartments,
		TableTemplates,
		TableJobs,
		TableTimeEvents
	} from '$lib/app-types';
	import * as Select from '$ui/select/index';
	import * as Table from '$ui/table/index';
	import { Input } from '$ui/input/index';
	import { Textarea } from '$ui/textarea/index';
	import { Label } from '$ui/label/index';
	import { Button } from '$ui/button/index';
	import { Separator } from '$ui/separator/index';
	import { ScrollArea } from '$ui/scroll-area/index';
	import { SCHEDULE_TEMPLATE } from '$lib/defaults/app-defaults';
	import { getTimezoneMaps } from '$lib/utils';
	import Combobox from '$lib/components/combobox.svelte';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';

	interface TemplateFormProps {
		data: TableTemplates;
		// templateDraft: DraftState<TableTemplates>;
		isBusy: false;
		deptOption: Pick<TableDepartments, 'id' | 'code' | 'name'>[];
		jobOption: Pick<TableJobs, 'id' | 'code' | 'name'>[];
		eventsOption: Pick<TableTimeEvents, 'id' | 'code' | 'name'>[];
	}

	const timeZonesMap = getTimezoneMaps();
	const tzOption: Record<'name' | 'label' | 'value', string>[] = [];

	timeZonesMap.forEach((tz) => {
		tzOption.push({
			label: `(${tz.offset}) ${tz.alternativeName} (${tz.name})`,
			value: tz.rawFormat,
			name: tz.name
		});
	});

	let {
		isBusy = $bindable(false),
		deptOption,
		jobOption,
		eventsOption,
		data = $bindable(structuredClone(SCHEDULE_TEMPLATE))
	}: TemplateFormProps = $props();

	let selectedDept = $derived(deptOption.find((d) => d.id === data.departmentId));
	let selectedJob = $derived(jobOption.find((j) => j.id === data.jobId));
	let userTzValue = $state(timeZonesMap.get(data.template.userTimezone)?.rawFormat ?? '');
	let clientTzValue = $state(timeZonesMap.get(data.template.clientTimezone)?.rawFormat ?? '');
	let events: UserTimeEventSchedules[] = $state(data.template.events ?? []);

	function getDepartmentId() {
		return String(data.departmentId);
	}

	function getJobId() {
		return String(data.jobId);
	}

	function setDepartmentId(v: string) {
		data.departmentId = Number(v);
	}

	function setJobId(v: string) {
		data.jobId = Number(v);
	}

	function addEvent() {
		events.push({
			timeEvent: 'break',
			startTime: '',
			endTime: '',
			description: ''
		});
	}

	function deleteEvent(idx: number) {
		events = events.filter((_, i) => i !== idx);
	}
</script>

<div class="grid grid-flow-col grid-rows-3 gap-4">
	<div class="grid grid-cols-4 items-center gap-4">
		<Label class="text-right" for="name">Name</Label>
		<Input class="col-span-3" type="text" id="name" name="name" bind:value={data.name} />
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label class="text-right" for="departmentId">Department</Label>
		<Select.Root type="single" bind:value={getDepartmentId, setDepartmentId} name="departmentId">
			<Select.Trigger class="col-span-3 w-full">
				{selectedDept?.name ?? 'Select Department'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Departments</Select.Label>
					{#each deptOption as dept (dept.id)}
						<Select.Item
							value={String(dept.id)}
							label={dept.name}
							disabled={dept.id === selectedDept?.id}>{dept.name}</Select.Item
						>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label class="text-right" for="departmentId">Job</Label>
		<Select.Root type="single" bind:value={getJobId, setJobId} name="jobId">
			<Select.Trigger class="col-span-3 w-full">
				{selectedJob?.name ?? 'Select Job'}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Jobs</Select.Label>
					{#each jobOption as job (job.id)}
						<Select.Item
							value={String(job.id)}
							label={job.name}
							disabled={job.id === selectedJob?.id}>{job.name}</Select.Item
						>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<div class="row-span-3 grid w-full gap-1.5">
		<Label for="description">Description</Label>
		<Textarea
			id="description"
			name="description"
			bind:value={data.description}
			placeholder="Template description"
		/>
	</div>
</div>
<Separator class="my-5" />
<div class="grid grid-flow-col grid-rows-2 gap-4">
	<div class="grid grid-cols-4 items-center gap-4">
		<Label class="text-right" for="userTimezone">User Timezone</Label>
		<Combobox
			variant="outline"
			placeholder="Select Timezone"
			title="Timezone"
			lists={tzOption}
			bind:value={userTzValue}
			buttonClass="col-span-3 w-full justify-between"
		/>
	</div>
	<div class="grid grid-cols-4 items-center gap-4">
		<Label class="text-right" for="clientTimezone">Client Timezone</Label>
		<Combobox
			variant="outline"
			placeholder="Select Timezone"
			title="Timezone"
			lists={tzOption}
			bind:value={clientTzValue}
			buttonClass="col-span-3 w-full justify-between"
		/>
	</div>
	<div class="grid grid-cols-3 items-center gap-4">
		<Label class="text-right" for="clockIn">Clock In</Label>
		<Input
			class="col-span-2"
			type="time"
			id="clockIn"
			name="clockIn"
			bind:value={data.template.clockIn}
		/>
	</div>
	<div class="grid grid-cols-3 items-center gap-4">
		<Label class="text-right" for="clockOut">Clock Out</Label>
		<Input
			class="col-span-2"
			type="time"
			id="clockOut"
			name="clockOut"
			bind:value={data.template.clockOut}
		/>
	</div>
</div>

<Separator class="my-5" />

<ScrollArea class="h-[300px]">
	<Table.Root>
		<Table.Caption>Time Events</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>
					<Button size="sm" class="mr-2" onclick={addEvent}>
						<Plus />
					</Button>
					Time Event
				</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Head>Start Time</Table.Head>
				<Table.Head>End Time</Table.Head>
				<Table.Head>Action</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each events as event, idx (idx)}
				<Table.Row>
					<Table.Cell>
						<Select.Root type="single" name="timeEvent" bind:value={event.timeEvent}>
							<Select.Trigger class="w-full">
								{eventsOption.find((t) => t.code == event.timeEvent)?.name ?? 'Time Event'}
							</Select.Trigger>
							<Select.Content>
								<Select.Group>
									<Select.Label>Time Events</Select.Label>
									{#each eventsOption as timeEvent (timeEvent.id)}
										<Select.Item value={timeEvent.code} label={timeEvent.name}>
											{timeEvent.name}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</Table.Cell>
					<Table.Cell
						><Input
							bind:value={event.startTime}
							name="timeEvent"
							type="time"
							class="h-8 border-none"
						/></Table.Cell
					>
					<Table.Cell
						><Input
							bind:value={event.endTime}
							name="timeEvent"
							type="time"
							class="h-8 border-none"
						/></Table.Cell
					>
					<Table.Cell
						><Input
							bind:value={event.description}
							name="timeEvent"
							type="text"
							class="h-8 border-none"
						/></Table.Cell
					>
					<Table.Cell class="items-center text-center">
						<Button variant="ghost" size="sm" onclick={() => deleteEvent(idx)}>
							<X class="text-destructive" />
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</ScrollArea>
