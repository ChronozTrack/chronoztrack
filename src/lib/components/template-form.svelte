<script lang="ts">
	import type {
		OptionsBaseTable,
		UserAction,
		UserTimeEventSchedules,
		TableTemplates
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
	import { getTimezoneMaps, timeToMinutes, getEndTime } from '$lib/utils';
	import Combobox from '$lib/components/combobox.svelte';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';

	interface TemplateFormProps {
		data: TableTemplates;
		isBusy: boolean;
		deptOption: Map<number, Pick<OptionsBaseTable, 'id' | 'code' | 'name'>>;
		jobOption: Map<number, Pick<OptionsBaseTable, 'id' | 'code' | 'name'>>;
		timeEventOption: Map<string, Pick<OptionsBaseTable, 'id' | 'code' | 'name'>>;
		currentDept?: Pick<OptionsBaseTable, 'id' | 'code' | 'name'>;
		action: UserAction;
	}

	const { timeZonesMap, timeZonesRawMap } = getTimezoneMaps();
	const tzOption: Record<'name' | 'label' | 'value', string>[] = [];

	timeZonesMap.forEach((tz) => {
		tzOption.push({
			label: `(${tz.offset} ${tz.name}) ${tz.alternativeName}`,
			value: tz.rawFormat,
			name: tz.name
		});
	});

	let {
		isBusy = $bindable(false),
		deptOption,
		jobOption,
		timeEventOption,
		currentDept,
		action,
		data = $bindable(SCHEDULE_TEMPLATE)
	}: TemplateFormProps = $props();

	//Use rawFormat in combobox value for wider search, rawFormat contains common cities of the country
	let userRawTz = $state(timeZonesMap.get(data.template.userTimezone)?.rawFormat ?? '');
	let clientRawTz = $state(timeZonesMap.get(data.template.clientTimezone)?.rawFormat ?? '');
	let userTimezone = $derived(timeZonesRawMap.get(userRawTz));
	let clientTimezone = $derived(timeZonesRawMap.get(clientRawTz));
	let durationHours = $state(getDuration(data.template.clockIn, data.template.clockOut, 'hours'));
	let departmentIdStr = $state(String(action === 'create' ? currentDept?.id : data.departmentId));
	let jobIdStr = $state(String(data.jobId));
	let selectedDept = $derived(deptOption.get(Number(departmentIdStr)));
	let selectedJob = $derived(jobOption.get(Number(jobIdStr)));
	let isReadOnly = $derived(!['update', 'create'].includes(action) || isBusy);
	let events: (UserTimeEventSchedules & { duration: number })[] = $state(
		data.template.events.map((e) => ({
			...e,
			duration: getDuration(e.startTime, e.endTime)
		})) ?? []
	);

	function addEvent() {
		events.push({
			timeEvent: 'break',
			startTime: '',
			endTime: '',
			description: '',
			duration: 0
		});
	}

	function deleteEvent(idx: number) {
		events = events.filter((_, i) => i !== idx);
	}

	function prefix(names: string[]) {
		let str = 'templates[0]';
		names.forEach((n) => {
			str += `[${n}]`;
		});

		return str;
	}

	function getDuration(
		start: string = '00:00',
		end: string = '00:00',
		units: 'hours' | 'minutes' = 'minutes'
	) {
		const startMinutes = timeToMinutes(start);
		const endMinutes = timeToMinutes(end);
		const duration =
			endMinutes >= startMinutes ? endMinutes - startMinutes : 24 * 60 - startMinutes + endMinutes;

		return units === 'hours' ? duration / 60 : duration;
	}

	function setClockIn(v: string) {
		let initTime = getEndTime(v, 120);

		events.forEach((e) => {
			e.startTime = initTime;
			e.endTime = getEndTime(initTime, e.duration);
			e.duration = getDuration(e.startTime, e.endTime);
			initTime = getEndTime(initTime, 120);
		});

		data.template.clockIn = v;
	}

	function getTzName(type: 'user' | 'client'){
		return (type === 'user' ? userTimezone?.rawFormat : clientTimezone?.rawFormat) ?? '';
	}

	function setTzName(type: 'user' | 'client', value: string | undefined){
		if(type === 'user'){

			userTimezone = value ? timeZonesRawMap.get(value) : undefined;
		} else {
			clientTimezone = value ?  timeZonesRawMap.get(value) : undefined;
		}
	}
</script>

<fieldset disabled={isBusy}>
	<div class="grid grid-flow-col grid-cols-2 grid-rows-3 gap-4">
		<input type="hidden" value={data.id} name={prefix(['id'])} />
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="text-right" for="name">Name</Label>
			<Input
				class="col-span-3"
				type="text"
				id="name"
				name={prefix(['name'])}
				value={data.name}
				required
				readonly={isReadOnly}
			/>
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="text-right" for="departmentId">Department</Label>
			{#if isReadOnly}
				<Input class="col-span-3" type="text" value={selectedDept?.name ?? 'Department'} readonly />
			{:else}
				<Select.Root
					type="single"
					bind:value={departmentIdStr}
					name={prefix(['departmentId'])}
					required={true}
					disabled={isReadOnly}
				>
					<Select.Trigger class="col-span-3 w-full">
						{selectedDept?.name ?? 'Select Department'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Departments</Select.Label>
							{#each deptOption.entries() as [id, dept] (id)}
								<Select.Item
									value={String(id)}
									label={dept.name}
									disabled={dept.id === selectedDept?.id}>{dept.name}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			{/if}
		</div>
		<div class="grid grid-cols-4 items-center gap-4">
			<Label class="text-right" for="jobId">Job</Label>
			{#if isReadOnly}
				<Input class="col-span-3" type="text" value={selectedJob?.name ?? 'Job'} readonly />
			{:else}
				<Select.Root
					type="single"
					bind:value={jobIdStr}
					name={prefix(['jobId'])}
					required={true}
					disabled={isReadOnly}
				>
					<Select.Trigger class="col-span-3 w-full">
						{selectedJob?.name ?? 'Select Job'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Jobs</Select.Label>
							{#each jobOption.entries() as [id, job] (id)}
								<Select.Item value={String(id)} label={job.name} disabled={id === selectedJob?.id}
									>{job.name}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			{/if}
		</div>
		<div class="row-span-3 grid w-full gap-1">
			<Label for="description">Description</Label>
			<Textarea
				id="description"
				name={prefix(['description'])}
				value={data.description}
				placeholder="Template description"
				required
				readonly={isReadOnly}
			/>
		</div>
	</div>
	<Separator class="my-5" />
	<div class="grid grid-cols-2 gap-4">
		<div class="grid items-center gap-1.5">
			<input
				type="hidden"
				value={userTimezone?.name ?? ''}
				name={prefix(['template', 'userTimezone'])}
				required
			/>
			<Label class="text-right" for="userTimezone">User Timezone</Label>
			{#if isReadOnly}
				<Input type="text" value={`(${userTimezone?.offset} ${userTimezone?.name})`} readonly />
			{:else}
				<Combobox
					variant="outline"
					placeholder="Select Timezone"
					title="user timezone"
					lists={timeZonesMap.values() as Iterable<Record<'label' | 'value', string>>}
					bind:value={() => getTzName('user'), (v) => setTzName('user', v)}
					buttonClass="col-span-3 w-full justify-between"
				/>
			{/if}
		</div>
		<div class="grid items-center gap-1.5">
			<input
				type="hidden"
				value={clientTimezone?.name ?? ''}
				name={prefix(['template', 'clientTimezone'])}
				required
			/>
			<Label class="text-right" for="clientTimezone">Client Timezone</Label>
			{#if isReadOnly}
				<Input type="text" value={`(${clientTimezone?.offset} ${clientTimezone?.name})`} readonly />
			{:else}
				<Combobox
					variant="outline"
					placeholder="Select Timezone"
					title="client timezone"
					lists={timeZonesMap.values() as Iterable<Record<'label' | 'value', string>>}
					bind:value={() => getTzName('client'), (v) => setTzName('client', v)}
					buttonClass="col-span-3 w-full justify-between"
				/>
			{/if}
		</div>
	</div>
	<div class="mt-4 grid grid-cols-3 gap-4">
		<div class="grid grid-cols-3 items-center gap-4">
			<Label class="text-right" for="durationHours">Duration (Hours)</Label>
			<Input
				class="col-span-1 text-right"
				type="number"
				id="duration"
				bind:value={durationHours}
				readonly={isReadOnly}
			/>
		</div>
		<div class="grid grid-cols-3 items-center gap-4">
			<Label class="text-right" for="clockIn">Clock In</Label>
			<Input
				class="col-span-2"
				type="time"
				id="clockIn"
				name={prefix(['template', 'clockIn'])}
				bind:value={() => data.template.clockIn, setClockIn}
				readonly={isReadOnly}
			/>
		</div>
		<div class="grid grid-cols-3 items-center gap-4">
			<Label class="text-right" for="clockOut">Clock Out</Label>
			<Input
				class="col-span-2"
				type="time"
				id="clockOut"
				name={prefix(['template', 'clockOut'])}
				value={getEndTime(data.template.clockIn, durationHours * 60)}
				readonly
			/>
		</div>
	</div>

	<Separator class="my-5" />
	<ScrollArea class="mb-4 h-[300px] rounded-md border">
		<Table.Root>
			<Table.Caption>Time Events</Table.Caption>
			<Table.Header class="sticky top-0 z-10">
				<Table.Row>
					<Table.Head>Time Event</Table.Head>
					<Table.Head>Start Time</Table.Head>
					<Table.Head class="w-[50px] text-center">Duration (Minutes)</Table.Head>
					<Table.Head>Description</Table.Head>
					<Table.Head>
						<Button
							variant="outline"
							size="sm"
							class="ml-2"
							onclick={addEvent}
							disabled={isReadOnly}
						>
							<Plus size="16" />
							Add
						</Button>
					</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each events as event, idx (idx)}
					{@const inputName = (n: string) => prefix(['template', 'events', String(idx), n])}
					<Table.Row>
						<Table.Cell>
							{#if isReadOnly}
								<Input
									type="text"
									value={timeEventOption.get(event.timeEvent)?.name ?? event.timeEvent}
									readonly
								/>
							{:else}
								<Select.Root
									type="single"
									name={inputName('timeEvent')}
									value={event.timeEvent}
									required={true}
									disabled={isReadOnly}
								>
									<Select.Trigger class="w-full">
										{timeEventOption.get(event.timeEvent)?.name ?? 'Time Event'}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Time Events</Select.Label>
											{#each timeEventOption.entries() as [code, timeEvent] (code)}
												<Select.Item value={code} label={timeEvent.name}>
													{timeEvent.name}
												</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							{/if}
						</Table.Cell>
						<Table.Cell
							><Input
								bind:value={event.startTime}
								name={inputName('startTime')}
								type="time"
								class="h-8 border-none"
								required
								readonly={isReadOnly}
							/></Table.Cell
						>
						<Table.Cell>
							<input
								type="hidden"
								name={inputName('endTime')}
								value={getEndTime(event.startTime, event.duration)}
							/>
							<Input
								bind:value={event.duration}
								type="number"
								class="h-8 border-none text-right"
								required
								readonly={isReadOnly}
							/></Table.Cell
						>
						<Table.Cell
							><Input
								value={event.description}
								name={inputName('description')}
								type="text"
								class="h-8 border-none"
								required
								readonly={isReadOnly}
							/></Table.Cell
						>
						<Table.Cell class="items-center text-center">
							{#if !isReadOnly}
								<Button variant="ghost" size="sm" onclick={() => deleteEvent(idx)}>
									<X class="text-destructive" />
								</Button>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</ScrollArea>
</fieldset>
