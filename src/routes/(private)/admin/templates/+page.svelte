<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const { departments = [], jobs = [], supervisors = [] } = data.templateOptions;
</script>
