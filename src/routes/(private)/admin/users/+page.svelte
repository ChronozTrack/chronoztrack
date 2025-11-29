<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsCore, UsersData } from '$lib/app-types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { DataFilters, TableDataState } from '$lib/data-utils';
	import { Button, buttonVariants } from '$ui/button/index';
	import { Badge } from '$ui/badge/index';
	import * as Popover from '$ui/popover/index';
	import * as DropdownMenu from '$ui/dropdown-menu/index';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import AppFilters from '$lib/components/app-filters.svelte';
	import UsersTable from '$lib/components/users-table.svelte';
	import { Separator } from '$ui/separator/index';
	import Plus from '@lucide/svelte/icons/plus';
	import Funnel from '@lucide/svelte/icons/funnel';
	import X from '@lucide/svelte/icons/x';
	import BusyIcon from '$lib/components/busy-icon.svelte';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import { FILTER_LIMITS } from '$lib/defaults/app-defaults';

	let filterForm: HTMLFormElement | undefined = $state();
	let { data }: PageProps = $props();
	const { options } = data;
	const departments: Map<number, OptionsCore> = new Map(options.departments.map((d) => [d.id, d]));
	const jobs: Map<number, OptionsCore> = new Map(options.jobs.map((j) => [j.id, j]));
	const roles: Map<number, OptionsCore> = new Map(options.roles.map((r) => [r.id, r]));
	let isBusy = $state(false);
	let isFilter = $state(false);
	const dataFilters = new DataFilters(
		[
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
				name: 'supervisor',
				label: 'Supervisor',
				type: 'multiple',
				options: data.supervisors.map((s) => ({ value: String(s.id), label: s.name }))
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
		],
		page.url
	);

	const users = new TableDataState<UsersData, 'id'>(data.users, ['id']);

	const onUserFilter: SubmitFunction = async ({ formData }) => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'success') {
				users.data = result?.data?.users ?? [];
				dataFilters.updateFilters();
				setUrlState(formData);
			} else if (result.type === 'error') {
				console.error(result.error);
			} else if (result.type === 'failure') {
				console.error(result.data?.message);
			}
			isBusy = false;
			isFilter = false;
		};
	};

	async function onFilterLimit() {
		await tick();
		filterForm?.requestSubmit();
	}

	function setUrlState(formData: FormData) {
		const url = page.url;
		url.search = '';
		formData.forEach((value, key) => {
			if (typeof value === 'string' && value.length > 0) {
				url.searchParams.set(key, value);
			}
		});
		replaceState(url, page.state);
	}

	async function onSetPage(v: number) {
		dataFilters.pageQuery = v;
		console.log(v)
		await tick();
		filterForm?.requestSubmit();
	}
</script>

<form
	id="user-data-filters"
	method="POST"
	action="?/get-users"
	hidden
	bind:this={filterForm}
	use:enhance={onUserFilter}
>
	{#each dataFilters.draftValues as draft, i (i)}
		{#if draft.value?.length}
			<input name={draft.name} type="hidden" value={draft.value} />
		{/if}
	{/each}
	<input name="limit" type="hidden" value={dataFilters.limit} />
	<input name="pageKeys" type="hidden" value={dataFilters.pageKeysStr} />
	<input name="pageQuery" type="hidden" value={dataFilters.pageQuery} />
</form>

<div class="w-full max-w-2xl overflow-auto md:max-w-7xl">
	<div class="flex-col justify-start gap-4">
		<div class="flex items-center gap-2 py-1">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="ghost" size="sm"><EllipsisVertical /></Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.RadioGroup
							bind:value={dataFilters.strLimit}
							onValueChange={onFilterLimit}
						>
							{#each FILTER_LIMITS as limit (limit.value)}
								<DropdownMenu.RadioItem value={String(limit.value)}>
									{limit.label}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
			<Popover.Root bind:open={isFilter}>
				<Popover.Trigger
					class={buttonVariants({ variant: 'outline', size: 'sm' })}
					disabled={isBusy}
				>
					<Funnel /> Filter
					{#if dataFilters.size > 0}
						<Badge class="size-5 rounded-lg" variant="secondary">
							{dataFilters.size}
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
							disabled={!dataFilters.canAddFilter() || isBusy}
						>
							<BusyIcon {isBusy}>
								<Plus />
							</BusyIcon>
							Add Filter
						</Button>
						<Button type="submit" size="sm" form="user-data-filters" disabled={isBusy}
							><BusyIcon {isBusy} />Apply</Button
						>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="relative flex flex-col overflow-auto pt-4">
			<div class="max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg border px-2">
				<UsersTable {users} />
			</div>
		</div>
	</div>
	<footer class="flex h-16 items-center justify-center">
		<Pagination.Root
			count={users.size + 1}
			perPage={dataFilters.limit}
			bind:page={() => dataFilters.page, onSetPage}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton disabled={isBusy}>
							<ChevronLeftIcon class="size-4" />
							<span class="hidden sm:block">Previous</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value} disabled={isBusy}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton disabled={isBusy}>
							<span class="hidden sm:block">Next</span>
							<ChevronRightIcon class="size-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</footer>
</div>
