<script lang="ts">
	import type { UserAction } from '$lib/app-types';
	import * as AlertDialog from '$ui/alert-dialog/index';
	import { buttonVariants } from '$ui/button';

	type DialogProps = {
		open: boolean;
		description?: string;
		title?: string;
		onConfirm: () => void;
	};

	let {
		open = $bindable(false),
		description = 'Are you sure you want to proceed?',
		title = 'Warning!',
		onConfirm,
		...restProps
	}: DialogProps = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="capitalized">{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onConfirm}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
