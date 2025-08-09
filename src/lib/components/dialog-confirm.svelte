<script lang="ts">
	import type { UserAction } from '$lib/app-types';
	import * as AlertDialog from '$ui/alert-dialog/index';
	import { buttonVariants } from '$ui/button';

	type DialogProps = {
		open: boolean;
		description: string;
		title: string;
		action: UserAction;
	};

	let { open = $bindable(false), description, title, action, ...restProps }: DialogProps = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class={buttonVariants({ size: 'sm' })}>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ size: 'sm' })}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
