<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	interface ComboboxProps {
		lists: (Record<string, string> & { value: string; label: string })[];
		placeholder: string;
		variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | undefined;
		title: string;
		value: string;
    buttonClass: string;
	}

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let {
		variant = 'outline',
		lists,
		placeholder,
		title = 'Title',
		value = $bindable(''),
    buttonClass,
	}: ComboboxProps = $props();

	let selectedValue: Record<string, string> & { value: string; label: string } = $derived(
		lists.find((l) => l.value === value) ?? {
			value: '',
			label: 'Select ...'
		}
	);
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				{variant}
        class={buttonClass}
				role="combobox"
				aria-expanded={open}
			>
      <span class="overflow-hidden text-ellipsis">
				{selectedValue.label || `Select ${title}`}
      </span>
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-full">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.List>
				<Command.Empty>No framework found.</Command.Empty>
				<Command.Group>
					{#each lists as option (option.value)}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== option.value && 'text-transparent')} />
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
