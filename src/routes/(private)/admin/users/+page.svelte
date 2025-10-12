<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import * as Popover from '$ui/popover/index';
	import { Input } from '$ui/input/index';
	import { Label } from '$ui/label/index';
	import * as Select from '$ui/select/index';
	import Funnel from '@lucide/svelte/icons/funnel';
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import type { OptionsCore } from '$lib/app-types';

	type OptionFilters = {
		department?: string[];
		job?: string[];
		role?: string[];
		supervisor?: string[];
	};

	// Subtype for native/other value types
	type NativeFilters = {
		active: string;
		search: string;
	};

	// Your full filter type as a combination
	type FiltersType = OptionFilters & NativeFilters;

	let { data }: PageProps = $props();
	const { options, users } = data;
	const departments: Map<number, OptionsCore> = new Map(options.departments.map((d) => [d.id, d]));
	const jobs: Map<number, OptionsCore> = new Map(options.jobs.map((j) => [j.id, j]));
	const roles: Map<number, OptionsCore> = new Map(options.roles.map((r) => [r.id, r]));
	let isBusy = $state(false);
	let filters: FiltersType = $state({
		department: [],
		job: [],
		supervisor: [],
		role: [],
		search: '',
		active: ''
	});
	let filtersCount = $derived(
		Object.values(filters).reduce((num, val) => {
			if ((Array.isArray(val) && val.length) || (typeof val === 'string' && val.length)) {
				num += 1;
			}
			return num;
		}, 0)
	);

	function setSelectValue(key: keyof OptionFilters, v: string[] | undefined) {
		if (Array.isArray(v) && v.includes('0')) {
			filters[key] = undefined;
		} else {
			filters[key] = v;
		}
	}
	$inspect(filters);
</script>

{#snippet filterSelect(key: keyof OptionFilters, options: Map<number, OptionsCore>)}
	{@const len = filters[key]?.length ?? 0}
	<Select.Root
		type="multiple"
		bind:value={() => filters[key], (v) => setSelectValue(key, v)}
		name={key}
		required={true}
		disabled={isBusy}
	>
		<Select.Trigger class="col-span-3 w-full truncate" size="sm">
			{#if !len || options.size === len}
				All
			{:else if len > 2}
				{len} Selected
			{:else}
				{filters[key]?.map((id) => options.get(Number(id))?.name).join(', ')}
			{/if}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label class="uppercase">{key}</Select.Label>
				<Select.Item value="0" label="All">All</Select.Item>
				{#each options.entries() as [id, opt] (id)}
					<Select.Item value={String(id)} label={opt.name}>
						{opt.name}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{/snippet}

<div class="w-full max-w-2xl overflow-auto md:max-w-7xl">
	<div class="flex-col justify-start gap-4">
		<div class="flex items-center justify-end gap-x-2 py-1">
			{#if filters.search.length > 0}
				<Button variant="ghost" size="sm">
					<BusyIcon {isBusy}><X class="text-destructive" /></BusyIcon>
				</Button>
			{/if}
			<Input name="search" class="h-8 w-xs" placeholder="Search..." bind:value={filters.search} />
			<Popover.Root>
				<Popover.Trigger
					class={buttonVariants({ variant: 'outline', size: 'sm' })}
					disabled={filters.search.length > 0}
				>
					{#if filtersCount}
						<Badge class="h-5 min-w-5 rounded-full bg-destructive px-1 font-mono tabular-nums">
							{filtersCount}
						</Badge>
					{/if}
					<BusyIcon {isBusy}>
						<Funnel />
					</BusyIcon>
					<span> Filter </span>
				</Popover.Trigger>
				<Popover.Content align="end" class="w-sm">
					<form method="POST" action="?/get-users" class="grid gap-2">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for="active">Active</Label>
							<Select.Root
								type="single"
								bind:value={filters.active}
								name="active"
								required={true}
								disabled={isBusy}
							>
								<Select.Trigger class="col-span-3 w-full" size="sm">
									{#if filters.active === ''}
										All
									{:else}
										{filters.active === 'true' ? 'Yes' : 'No'}
									{/if}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label class="uppercase">Active</Select.Label>
										<Select.Item value="" label="All" />
										<Select.Item value="true" label="Yes" />
										<Select.Item value="False" label="No" />
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for="department">Department</Label>
							{@render filterSelect('department', departments)}
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for="job">Job</Label>
							{@render filterSelect('job', jobs)}
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for="role">Role</Label>
							{@render filterSelect('role', roles)}
						</div>
					</form>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
</div>
