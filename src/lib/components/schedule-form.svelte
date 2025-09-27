<script lang="ts">
	import * as Table from '$ui/table/index';
	import { Input } from '$ui/input/index';
	import { Label } from '$ui/label/index';
	import { Separator } from '$ui/separator/index';
	import { ScrollArea } from '$ui/scroll-area/index';
	import * as Select from '$ui/select/index';
	import { Button } from '$ui/button/index';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import Combobox from '$lib/components/combobox.svelte';
	import type { OptionsCore, ScheduleTemplates, UserTimeEventSchedules } from '$lib/app-types';
	import { getEndTime, timeToMinutes, type TimeZonesInfo } from '$lib/utils';

	interface SchedTemplateProps {
		isReadOnly: boolean;
		data: ScheduleTemplates;
		timeEventOption: Map<string, OptionsCore>;
		timeZonesMap: Map<string, TimeZonesInfo>;
		timeZonesRawMap: Map<string, TimeZonesInfo>;
		prefixName?: string;
	}
	let {
		isReadOnly,
		data = $bindable(),
		timeEventOption,
		timeZonesMap,
		timeZonesRawMap,
		prefixName = ''
	}: SchedTemplateProps = $props();

	let userTzInfo = $state(timeZonesMap.get(data.userTimezone));
	let clientTzInfo = $state(timeZonesMap.get(data.clientTimezone));
	let durationHours = $state(getDuration(data.clockIn, data.clockOut, 'hours'));

	function debounceSetter<T extends (...args: any[]) => void>(fn: T, delay = 300) {
		let timeout: ReturnType<typeof setTimeout> | null = null;
		return function (this: any, ...args: Parameters<T>) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => fn.apply(this, args), delay);
		};
	}

	function getTzName(type: 'user' | 'client') {
		return (type === 'user' ? userTzInfo?.rawFormat : clientTzInfo?.rawFormat) ?? '';
	}

	function setTzName(type: 'user' | 'client', value: string | undefined) {
		if (type === 'user') {
			userTzInfo = value ? timeZonesRawMap.get(value) : undefined;
			if (userTzInfo) {
				data.userTimezone = userTzInfo.name;
			}
		} else {
			clientTzInfo = value ? timeZonesRawMap.get(value) : undefined;
			if (clientTzInfo) {
				data.clientTimezone = clientTzInfo.name;
			}
		}
	}

	function addEvent() {
		data.events.push({
			timeEvent: 'break',
			startTime: '',
			endTime: '',
			description: '',
			duration_min: 0
		});
	}

	function deleteEvent(idx: number) {
		data.events = data.events.filter((_, i) => i !== idx);
	}

	function prefix(names: string[]) {
		let str = prefixName;
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
		let events = $state.snapshot(data.events);

		events.forEach((e: UserTimeEventSchedules) => {
			e.startTime = initTime;
			e.endTime = getEndTime(initTime, e.duration_min);
			e.duration_min = getDuration(e.startTime, e.endTime);
			initTime = getEndTime(initTime, 120);
		});

		data.clockIn = v;
		data.clockOut = getEndTime(data.clockIn, durationHours * 60);
		data.events = events;
	}

	function setStartTime(v: string, event: UserTimeEventSchedules) {
		event.startTime = v;
		event.endTime = getEndTime(event.startTime, event.duration_min);
	}

	function setDurationMin(v: number, event: UserTimeEventSchedules) {
		event.duration_min = v;
		event.endTime = getEndTime(event.startTime, event.duration_min);
	}

	const debouncedSetClockIn = debounceSetter(setClockIn, 300);
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="grid items-center gap-1.5">
		<input type="hidden" value={userTzInfo?.name ?? ''} name={prefix(['userTimezone'])} required />
		<Label class="text-right" for="userTimezone">User Timezone</Label>
		{#if isReadOnly}
			<Input type="text" value={`(${userTzInfo?.offset} ${userTzInfo?.name})`} readonly />
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
			value={clientTzInfo?.name ?? ''}
			name={prefix(['clientTimezone'])}
			required
		/>
		<Label class="text-right" for="clientTimezone">Client Timezone</Label>
		{#if isReadOnly}
			<Input type="text" value={`(${clientTzInfo?.offset} ${clientTzInfo?.name})`} readonly />
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
			name={prefix(['clockIn'])}
			bind:value={() => data.clockIn, (v) => debouncedSetClockIn(v)}
			readonly={isReadOnly}
		/>
	</div>
	<div class="grid grid-cols-3 items-center gap-4">
		<Label class="text-right" for="clockOut">Clock Out</Label>
		<Input
			class="col-span-2"
			type="time"
			id="clockOut"
			name={prefix(['clockOut'])}
			value={data.clockOut}
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
					<Button variant="outline" size="sm" class="ml-2" onclick={addEvent} disabled={isReadOnly}>
						<Plus size="16" />
						Add
					</Button>
				</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.events as event, idx (idx)}
				{@const inputName = (n: string) => prefix(['events', String(idx), n])}
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
								bind:value={event.timeEvent}
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
					<Table.Cell>
						<Input
							name={inputName('startTime')}
							bind:value={() => event.startTime, (v) => setStartTime(v, event)}
							type="time"
							class="h-8 border-none"
							required
							readonly={isReadOnly}
						/>
					</Table.Cell>
					<Table.Cell>
						<input type="hidden" name={inputName('endTime')} value={event.endTime} />
						<Input
							name={inputName('duration_min')}
							bind:value={() => event.duration_min, (v) => setDurationMin(v, event)}
							type="number"
							class="h-8 border-none text-right"
							required
							readonly={isReadOnly}
						/>
					</Table.Cell>
					<Table.Cell>
						<Input
							bind:value={event.description}
							name={inputName('description')}
							type="text"
							class="h-8 border-none"
							required
							readonly={isReadOnly}
						/>
					</Table.Cell>
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
