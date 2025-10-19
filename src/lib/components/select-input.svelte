<script lang="ts">
	import * as Select from '$ui/select/index';
	
	interface SelectProps {
		class?: string;
		disabled?: boolean;
		name: string;
		label: string;
		type: 'multiple' | 'single';
		value?: string[] | string;
		options: {
			label: string;
			value: string;
		}[];
	}

	let {
		type,
		value = $bindable(),
		name,
		label,
		disabled,
		class: className = '',
		options
	}: SelectProps = $props();

	let selectedLabel = $derived.by(() => {
		if (!value || !value.length) return `Select ${label}`;

		if (Array.isArray(value)) {
			return options
				.filter((opt) => value?.includes(opt.value))
				.map((opt) => opt.label)
				.join(', ');
		}

		return options.find((opt) => opt.value === value)?.label ?? `Select ${label}`;
	});
</script>

<Select.Root
	name={!value || !value.length ? undefined : name}
	bind:value={value as never}
	{type}
	{disabled}
>
	<Select.Trigger class={className} size="sm"><span class="truncate">{selectedLabel}</span></Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each options as opt (opt.value)}
				<Select.Item value={opt.value} label={opt.label}>
					{opt.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
