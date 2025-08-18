<script lang="ts">
	import type { AppPages, User } from '$lib/app-types';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import NavUser from '$lib/components/nav-user.svelte';
	import Link from '@lucide/svelte/icons/link';

	interface AppSidebarProps {
		userRoutes: AppPages[];
		settingRoutes: AppPages[];
		user: User;
	}
	let { userRoutes, settingRoutes, user }: AppSidebarProps = $props();
</script>

{#snippet menuItem(route: AppPages)}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton>
			{#snippet child({ props })}
				<a href={route.href} {...props}>
					{#if route.icon}
						<route.icon />
					{:else}
						<Link />
					{/if}
					<span>{route.title}</span>
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
{/snippet}

<Sidebar.Root collapsible="icon" variant="inset">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each userRoutes as route (route.id)}
						{@render menuItem(route)}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		{#if settingRoutes.length > 0}
			<Sidebar.Group class="mt-auto">
				<Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each settingRoutes as route (route.id)}
							{@render menuItem(route)}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
