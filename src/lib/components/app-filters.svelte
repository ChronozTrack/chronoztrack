<script lang="ts">
	import { Button } from '$ui/button/index';
	import * as Select from '$ui/select/index';
	import { Input } from '$ui/input/index';
	import SelectInput from '$lib/components/select-input.svelte';

	import X from '@lucide/svelte/icons/x';
	import { DataFilters } from '$lib/data-utils';

	interface FilterProps {
		dataFilters: DataFilters;
	}

	let { dataFilters }: FilterProps = $props();
</script>

<div class="grid w-xl gap-2">
	{#each dataFilters.draftFilters as draft, i (i)}
		{@const details = dataFilters.getFilter(draft.name)}
		<div class="grid grid-cols-6 items-center gap-4">
			<Select.Root type="single" bind:value={draft.name}>
				<Select.Trigger class="col-span-2 w-full truncate" size="sm">
					{details?.label ?? 'Select'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each dataFilters.filterList as opt, j (j)}
							<Select.Item
								value={String(opt.name)}
								label={opt.label}
								disabled={dataFilters.isNameDrafted(opt.name)}
							>
								{opt.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			{#if details}
				{#if details.type && details.options}
					<SelectInput
						class="col-span-3 w-full"
						name={details.name}
						label={details.label}
						options={details.options}
						type={details.type}
						bind:value={draft.value}
					/>
				{:else}
					<Input
						class="col-span-3 h-8 w-full"
						name={draft?.value?.length ? details.name : ''}
						bind:value={draft.value}
						placeholder={details.label}
					/>
				{/if}
			{/if}
			<Button size="icon" variant="ghost" onclick={() => dataFilters.removeFilter(i)}>
				<X class="text-destructive" />
			</Button>
		</div>
	{/each}
</div>
