<script lang="ts">
	import type { PageProps } from './$types';
	import * as Tabs from '$ui/tabs/index';
	import OptionsTable from '$lib/components/options-table.svelte';

	let { data }: PageProps = $props();
	let currentTab = $state('jobs');
</script>

<Tabs.Root bind:value={currentTab} class="flex-col justify-start gap-6">
	<Tabs.List>
		<Tabs.Trigger value="jobs">Jobs</Tabs.Trigger>
		<Tabs.Trigger value="departments">Departments</Tabs.Trigger>
		<Tabs.Trigger value="roles">Roles</Tabs.Trigger>
		<Tabs.Trigger value="time_events">Time Events</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="jobs" class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
		<div class="overflow-hidden rounded-lg border">
			<OptionsTable />
		</div>
	</Tabs.Content>
</Tabs.Root>
