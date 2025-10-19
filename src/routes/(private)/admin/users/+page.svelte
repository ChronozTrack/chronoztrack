<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import * as Popover from '$ui/popover/index';
	import AppFilters from '$lib/components/app-filters.svelte';
	import { Separator } from '$ui/separator/index';
	import Plus from '@lucide/svelte/icons/plus';
	import Funnel from '@lucide/svelte/icons/funnel';
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import type { OptionsCore } from '$lib/app-types';
	import { FILTER_LIMITS } from '$lib/defaults/app-defaults';
	import { DataFilters } from '$lib/data-utils';

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
		limit: string;
	};

	// Your full filter type as a combination
	type FiltersType = OptionFilters & NativeFilters;

	let filterForm: HTMLFormElement | undefined = $state();
	let { data }: PageProps = $props();
	const { options, users } = data;
	const departments: Map<number, OptionsCore> = new Map(options.departments.map((d) => [d.id, d]));
	const jobs: Map<number, OptionsCore> = new Map(options.jobs.map((j) => [j.id, j]));
	const roles: Map<number, OptionsCore> = new Map(options.roles.map((r) => [r.id, r]));
	let isBusy = $state(false);
	let isFilter = $state(false);
	let currentFilters: { name: string; value?: string | string[] }[] = $state([{ name: '' }]);
	let dataLimit = $state(25);
	let filtersCount = $derived(
		currentFilters.reduce((count, obj) => {
			if (obj.name !== '' && obj?.value?.length) {
				count++;
			}
			return count;
		}, 0)
	);

	let dataFilters = new DataFilters([
		{
			name: 'search',
			label: 'Search user'
		},
		{
			name: 'department',
			label: 'Department',
			type: 'multiple',
			options: options.departments.map((d) => ({ value: String(d.id), label: d.name }))
		},
		{
			name: 'job',
			label: 'Job',
			type: 'multiple',
			options: options.jobs.map((j) => ({ value: String(j.id), label: j.name }))
		},
		{
			name: 'role',
			label: 'Role',
			type: 'multiple',
			options: options.roles.map((r) => ({ value: String(r.id), label: r.name }))
		},
		{
			name: 'active',
			label: 'Active',
			type: 'single',
			options: [
				{ value: 'true', label: 'Yes' },
				{ value: 'false', label: 'No' }
			]
		}
	]);

	function onApplyFilters(filters: { name: string; value?: string | string[] }[]) {
		currentFilters = [...filters];
	}
</script>

<form hidden>
	<input name="limit" type="hidden" value={dataFilters.limit} />
	{#each dataFilters.draftValues as draft, i (i)}
		{#if draft.value?.length}
			<input name={draft.name} type="hidden" value={draft.value} />
		{/if}
	{/each}
</form>

<div class="w-full max-w-2xl overflow-auto md:max-w-7xl">
	<div class="flex-col justify-start gap-4">
		<div class="flex items-center gap-x-2 py-1">
			<Popover.Root bind:open={isFilter}>
				<Popover.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
					<Funnel /> Filter
					{#if filtersCount > 0}
						<Badge class="h-5 min-w-5" variant="destructive">
							{filtersCount}
						</Badge>
					{/if}
				</Popover.Trigger>
				<Popover.Content align="start" class="w-full" interactOutsideBehavior="ignore">
					<Popover.Close
						class="[&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 absolute end-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none"
					>
						<X />
					</Popover.Close>

					<AppFilters {dataFilters} />
					<Separator class="my-2" />
					<div class="flex items-center justify-between">
						<Button
							variant="outline"
							size="sm"
							onclick={() => dataFilters.addFilter()}
							disabled={!dataFilters.canAddFilter()}
						>
							<Plus /> Add Filter
						</Button>
						<Button size="sm" onclick={() => onApplyFilters(dataFilters.draftFilters)}>Apply</Button
						>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
</div>
