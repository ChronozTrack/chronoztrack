<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	interface ComboValues {
		label: string;
		value: string;
		[key: string]: string;  // Allow extra string properties like the dynamic keys in Record<string, string>
	}

	interface ComboboxProps {
		lists: Iterable<ComboValues>;
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
		buttonClass
	}: ComboboxProps & WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
	
	let options = Array.from(lists)
	let selectedValue= $derived(options.find(opt => opt.value === value));

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
			<Button {...props} {variant} class={buttonClass} role="combobox" aria-expanded={open}>
				<span class="overflow-hidden text-ellipsis">
					{selectedValue?.label || `Select ${title}`}
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
					{#each options as option}
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
