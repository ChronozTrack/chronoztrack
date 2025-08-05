<script lang="ts">
	import '/src/app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Loader2Icon from '@lucide/svelte/icons/loader-2';
	import { Button } from '$lib/components/ui/button/index';
	import { Input } from '$lib/components/ui/input/index';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { applyAction, enhance } from '$app/forms';

	let isBusy = $state(false);

	const loginForm: SubmitFunction = () => {
		isBusy = true;
		return async ({ result }) => {
			if (result.type === 'error') {
				console.error(result.error);
			} else {
				applyAction(result);
				if (result.type === 'success') {
					isBusy = false;
				}
			}
		};
	};
</script>

<ModeWatcher />
<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
		</Card.Header>
		<Card.Content class="my-5">
			<form method="POST" id="form-login" use:enhance={loginForm}>
				<fieldset disabled={isBusy}>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<Label for="employeeId">Employee ID</Label>
							<Input
								name="employeeId"
								id="employeeId"
								type="alphanumeric"
								placeholder="123456"
								required
							/>
						</div>
						<div class="grid gap-2">
							<Label for="password">Password</Label>
							<Input name="password" id="password" type="password" required />
						</div>
					</div>
				</fieldset>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col">
			<Button form="form-login" type="submit" class="w-full" disabled={isBusy}>
				{#if isBusy}
					<Loader2Icon class="animate-spin" />
					Please wait
				{:else}
					Login
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
