<script lang="ts">
	import type {
		OptionsCore,
		UserAction,
		TableTemplates
	} from '$lib/app-types';
	import * as Select from '$ui/select/index';
	import { Input } from '$ui/input/index';
	import { Textarea } from '$ui/textarea/index';
	import { Label } from '$ui/label/index';
	import { Separator } from '$ui/separator/index';
	import { SCHEDULE_TEMPLATE } from '$lib/defaults/app-defaults';
	import { getTimezoneMaps } from '$lib/utils';
	import ScheduleForm from '$lib/components/schedule-form.svelte'

	interface TemplateFormProps {
		data: TableTemplates;
		isBusy: boolean;
		deptOption: Map<number, OptionsCore>;
		jobOption: Map<number, OptionsCore>;
		timeEventOption: Map<string, OptionsCore>;
		currentDept?: OptionsCore;
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

	let selectedDept = $derived(
		deptOption.get(Number(String(action === 'create' ? currentDept?.id : data.departmentId)))
	);
	let selectedJob = $derived(jobOption.get(Number(String(data.jobId))));
	let isReadOnly = $derived(!['update', 'create'].includes(action) || isBusy);

	function getDepartment() {
		return String(selectedDept?.id ?? '');
	}

	function setDepartment(v: string) {
		selectedDept = deptOption.get(Number(v));
	}

	function getJob() {
		return String(selectedJob?.id ?? '');
	}

	function setJob(v: string) {
		selectedJob = jobOption.get(Number(v));
	}

	function prefix(names: string[]) {
		let str = 'templates[0]';
		names.forEach((n) => {
			str += `[${n}]`;
		});

		return str;
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
					bind:value={getDepartment, setDepartment}
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
					bind:value={getJob, setJob}
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
	<ScheduleForm
		bind:data={data.template}
		timeEventOption={timeEventOption}
		{timeZonesMap}
		{timeZonesRawMap}
		isReadOnly={isReadOnly}
		prefixName={prefix(['template'])}
	/>
</fieldset>
