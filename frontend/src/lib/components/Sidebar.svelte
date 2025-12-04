<script>
	import { page } from '$app/stores';
	import { auth } from '$lib/stores';

	export let collapsed = false;

	const navItems = [
		{ href: '/tasks', icon: 'kanban', label: 'Задачи' },
		{ href: '/clients', icon: 'users', label: 'Клиенты' },
		{ href: '/media', icon: 'newspaper', label: 'СМИ' },
		{ href: '/archive', icon: 'archive', label: 'Архив' },
		{ href: '/analytics', icon: 'chart', label: 'Аналитика' },
	];

	function handleLogout() {
		auth.logout();
		window.location.href = '/login';
	}

	const icons = {
		kanban: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />`,
		users: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
		newspaper: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />`,
		archive: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />`,
		chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
		plus: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />`,
		settings: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`,
		logout: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />`,
	};
</script>

<aside class="sidebar" class:collapsed>
	<!-- Logo -->
	<div class="p-4 border-b border-surface-700">
		<h1 class="text-xl font-bold" class:hidden={collapsed}>
			CRM
		</h1>
		{#if collapsed}
			<div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">
				C
			</div>
		{/if}
	</div>

	<!-- Create button -->
	<div class="p-4">
		<a
			href="/tasks/new"
			class="flex items-center gap-3 px-4 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
			class:justify-center={collapsed}
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{@html icons.plus}
			</svg>
			{#if !collapsed}
				<span>Создать</span>
			{/if}
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-2">
		{#each navItems as item}
			<a
				href={item.href}
				class="sidebar-item"
				class:active={$page.url.pathname.startsWith(item.href)}
				class:justify-center={collapsed}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html icons[item.icon]}
				</svg>
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- User section -->
	<div class="p-4 border-t border-surface-700">
		{#if $auth.user}
			<div class="flex items-center gap-3 mb-4" class:justify-center={collapsed}>
				<div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
					{$auth.user.first_name?.[0]}{$auth.user.last_name?.[0]}
				</div>
				{#if !collapsed}
					<div class="min-w-0">
						<div class="font-medium truncate">{$auth.user.first_name} {$auth.user.last_name}</div>
						<div class="text-xs text-surface-400 truncate">{$auth.user.email}</div>
					</div>
				{/if}
			</div>
		{/if}

		<div class="flex gap-2" class:flex-col={collapsed}>
			<a
				href="/settings"
				class="sidebar-item flex-1"
				class:justify-center={collapsed}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html icons.settings}
				</svg>
				{#if !collapsed}
					<span>Настройки</span>
				{/if}
			</a>
			<button
				on:click={handleLogout}
				class="sidebar-item flex-1 text-red-400 hover:text-red-300"
				class:justify-center={collapsed}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{@html icons.logout}
				</svg>
				{#if !collapsed}
					<span>Выйти</span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Collapse toggle -->
	<button
		on:click={() => collapsed = !collapsed}
		class="absolute top-4 -right-3 w-6 h-6 bg-surface-700 border border-surface-600 rounded-full flex items-center justify-center hover:bg-surface-600 transition-colors"
	>
		<svg class="w-4 h-4 transition-transform" class:rotate-180={collapsed} fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
</aside>

