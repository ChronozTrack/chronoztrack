<script lang="ts">
	import type { AppPages, User } from '$lib/app-types';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import * as DropdownMenu from './ui/dropdown-menu/index';
	import NavUser from '$lib/components/nav-user.svelte';
	import { ChevronUp, Link } from '@lucide/svelte/icons';

	interface AppSidebarProps {
		userRoutes: AppPages[];
		settingRoutes: AppPages[];
		user: User;
	}
	let { userRoutes, settingRoutes, user }: AppSidebarProps = $props();
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each userRoutes as route (route.id)}
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
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user}/>
	</Sidebar.Footer>
</Sidebar.Root>
