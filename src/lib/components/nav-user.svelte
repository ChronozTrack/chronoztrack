<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/app-types';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import { useSidebar } from '$lib/components/ui/sidebar/index';
	import { AVATAR_SRC } from '$lib/defaults/app-defaults';
	import { ChevronsUpDownIcon, CircleUserIcon, LogOutIcon } from '@lucide/svelte';

	const sidebar = useSidebar();
	interface NavUserProps {
		user: User;
	}
	let { user }: NavUserProps = $props();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={AVATAR_SRC} />
							<Avatar.Fallback class="rounded-lg">CT</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="font-xs truncate">{user.role.name}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={AVATAR_SRC} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.role.name}</span>
						</div>
					</div>
				</DropdownMenu.Label>
        <DropdownMenu.Separator />
				<DropdownMenu.Group>
					<a href="/profile">
					<DropdownMenu.Item>
						<CircleUserIcon />
						Pofile
					</DropdownMenu.Item>
					</a>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<LogOutIcon />
            Log out
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
