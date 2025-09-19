<script lang="ts">
	import type { PageProps } from './$types';
	import type { OptionsCore } from '$lib/app-types';
	import { Button } from '$ui/button/index';
	import { Input } from '$ui/input/index';
	import { Label } from '$ui/label/index';
	import * as Card from '$ui/card/index';
	import * as Select from '$ui/select/index';
	import BusyIcon from '$lib/components/busy-icon.svelte';

	const _user = (key: string) => `users[${key}]`;
	const _designation = (key: string) => `user_designations[${key}]`;
	let { data }: PageProps = $props();

	const departments = new Map<number, OptionsCore>(data.options.departments.map((d) => [d.id, d]));
	const jobs = new Map<number, OptionsCore>(data.options.jobs.map((j) => [j.id, j]));
	const timeEvents = new Map<number, OptionsCore>(data.options.time_events.map((t) => [t.id, t]));

	let userDepartment: OptionsCore | undefined = $state();
	let userJob: OptionsCore | undefined = $state();
	let isBusy = $state(false);

	function getUserDepartment() {
		return String(userDepartment?.id ?? '');
	}

	function getUserJob() {
		return String(userJob?.id ?? '');
	}

	function setUserDepartment(v: string) {
		userDepartment = departments.get(Number(v));
	}

	function setUserJob(v: string) {
		userJob = jobs.get(Number(v));
	}
</script>

<div class="flex w-full items-center justify-center px-4">
	<Card.Root class="mx-auto mt-16 w-full max-w-xl">
		<Card.Header>
			<Card.Title class="text-2xl">Add User</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="POST" id="form-register">
				<fieldset disabled={isBusy}>
					<div class="grid gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_user('id')}>Employee ID</Label>
							<Input
								class="col-span-3"
								name={_user('id')}
								id={_user('id')}
								type="alphanumeric"
								placeholder="123456"
								required
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_user('name')}>Fullname</Label>
							<Input
								class="col-span-3"
								name={_user('name')}
								id={_user('name')}
								type="text"
								required
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_designation('departmentId')}>Department</Label>
							<Select.Root
								type="single"
								bind:value={getUserDepartment, setUserDepartment}
								name={_designation('departmentId')}
								required={true}
								disabled={isBusy}
							>
								<Select.Trigger class="col-span-3 w-full">
									{userDepartment?.name ?? 'Select Department'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Departments</Select.Label>
										{#each departments.entries() as [id, dept] (id)}
											<Select.Item
												value={String(id)}
												label={dept.name}
												disabled={dept.id === userDepartment?.id}>{dept.name}</Select.Item
											>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={_designation('departmentId')}>Job</Label>
							<Select.Root
								type="single"
								bind:value={getUserJob, setUserJob}
								name={_designation('departmentId')}
								required={true}
								disabled={isBusy}
							>
								<Select.Trigger class="col-span-3 w-full">
									{userJob?.name ?? 'Select Job'}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										<Select.Label>Jobs</Select.Label>
										{#each jobs.entries() as [id, job] (id)}
											<Select.Item
												value={String(id)}
												label={job.name}
												disabled={job.id === userJob?.id}>{job.name}</Select.Item
											>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
						</div>
						<!-- <div class="grid grid-cols-4 items-center gap-4">
							<Label class="justify-end" for={prefixUser('supervisorId')}>Supervisor</Label>
							<Input class="col-span-3" name={prefixUser('supervisorId')} id={prefixUser('supervisorId')} type="text" required />
						</div> -->
					</div>
				</fieldset>
			</form>
		</Card.Content>
		<Card.Footer>
			<Button form="form-register" type="submit" disabled={isBusy}>
				<BusyIcon>Register</BusyIcon>
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
