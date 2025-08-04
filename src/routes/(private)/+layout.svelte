<script lang="ts">
	import '/src/app.css';
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$ui/sidebar/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { APP_PAGES, SETTING_PAGES } from '$lib/defaults/menus';
	import { page } from '$app/state';

	let { data, children }: LayoutProps = $props();

	const permissions = new Set(Object.keys(data.user?.permissions ?? {}));
	const userRoutes = APP_PAGES.filter((route) => permissions.has(route.resource));
	const settingRoutes = SETTING_PAGES.filter((route) => permissions.has(route.resource));
	const currentRoute = $derived(
		[...userRoutes, ...settingRoutes].find((route) => route.href === page.url.pathname)
	);
	const currentResources = $derived(currentRoute?.resource?.split('.') ?? ['profile']);
</script>

{#if data.user}
	<ModeWatcher />
	<Sidebar.Provider>
		<AppSidebar {userRoutes} {settingRoutes} user={data.user} />
		<main>
			<Sidebar.Inset>
				<header
					class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
				>
					<div class="flex items-center gap-2 px-4">
						<Sidebar.Trigger class="-ml-1" />
						<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
						{#if currentResources.length > 0}
							<Breadcrumb.Root>
								<Breadcrumb.List>
									{#each currentResources as resource, idx}
										{#if idx > 0}
											<Breadcrumb.Separator class="hidden md:block" />
										{/if}
										<Breadcrumb.Item class="hidden md:block">
											<Breadcrumb.Page class="capitalize">{resource}</Breadcrumb.Page>
										</Breadcrumb.Item>
									{/each}
								</Breadcrumb.List>
							</Breadcrumb.Root>
						{/if}
					</div>
				</header>
				<section class="mx-4 w-full">
					<div class="w-full rounded-lg bg-muted/50 p-4 shadow-md">
						{@render children?.()}
					</div>
				</section>
			</Sidebar.Inset>
		</main>
	</Sidebar.Provider>
{/if}
