<script lang="ts">
	import type { OptionsBaseTable, TableTemplates, UserAction } from '$lib/app-types';
	import * as Table from '$ui/table/index';
	import { Button } from '$ui/button/index';
	import { getTimezoneMaps } from '$lib/utils';
	import Fullscreen from '@lucide/svelte/icons/fullscreen';

	interface TemplateTableProps {
		data: TableTemplates[];
		deptOption: Map<number, Pick<OptionsBaseTable, 'id' | 'code' | 'name'>>;
		jobOption: Map<number, Pick<OptionsBaseTable, 'id' | 'code' | 'name'>>;
		onAction: (action?: UserAction, entry?: TableTemplates) => void;
	}
	let { data, deptOption, jobOption, onAction }: TemplateTableProps = $props();
	const { timeZonesMap } = getTimezoneMaps();
</script>

<Table.Root>
	<Table.Caption>Schedule Templates</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-fit text-center"></Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Department</Table.Head>
			<Table.Head>Job</Table.Head>
			<Table.Head>User Timezone</Table.Head>
			<Table.Head>Client Timezone</Table.Head>
			<Table.Head class="w-[90px]">Clock In</Table.Head>
			<Table.Head class="w-[90px]">Clock Out</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as temp (temp.id)}
			<Table.Row>
				<Table.Cell class="w-fit text-center">
					<Button variant="ghost" size="sm" onclick={() => onAction('read', temp)}>
						<Fullscreen />
					</Button>
				</Table.Cell>
				<Table.Cell>{temp.name}</Table.Cell>
				<Table.Cell>{deptOption.get(temp.departmentId ?? 0)?.name ?? '-'}</Table.Cell>
				<Table.Cell>{jobOption.get(temp.jobId ?? 0)?.name ?? '-'}</Table.Cell>
				<Table.Cell>{timeZonesMap.get(temp.template.userTimezone)?.shortLabel ?? '-'}</Table.Cell>
				<Table.Cell>{timeZonesMap.get(temp.template.clientTimezone)?.shortLabel ?? '-'}</Table.Cell>
				<Table.Cell>{temp.template.clockIn}</Table.Cell>
				<Table.Cell>{temp.template.clockOut}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
