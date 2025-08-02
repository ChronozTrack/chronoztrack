<script lang="ts">
	import '/src/app.css';
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { Separator } from '$lib/components/ui/separator/index';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { APP_PAGES, SETTING_PAGES } from '$lib/defaults/menus';

	let { data, children }: LayoutProps = $props();
	const permissions = new Set(Object.keys(data.user?.permissions ?? {}));
	const userRoutes = APP_PAGES.filter((route) => permissions.has(route.resource));
	const settingRoutes = SETTING_PAGES.filter((route) => permissions.has(route.resource));
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
						<Breadcrumb.Root>
							<Breadcrumb.List>
								<Breadcrumb.Item class="hidden md:block">
									<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
								</Breadcrumb.Item>
								<Breadcrumb.Separator class="hidden md:block" />
								<Breadcrumb.Item>
									<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
								</Breadcrumb.Item>
							</Breadcrumb.List>
						</Breadcrumb.Root>
					</div>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
						{@render children?.()}
					</div>
				</div>
			</Sidebar.Inset>
		</main>
	</Sidebar.Provider>
{/if}
