<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth, websocket } from '$lib/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';

	let sidebarCollapsed = false;
	let initialized = false;

	const publicRoutes = ['/login', '/register'];

	onMount(async () => {
		const isAuthenticated = await auth.checkAuth();
		initialized = true;

		if (!isAuthenticated && !publicRoutes.includes($page.url.pathname)) {
			goto('/login');
		} else if (isAuthenticated) {
			websocket.connect();
		}
	});

	$: if (initialized && !$auth.isAuthenticated && !publicRoutes.includes($page.url.pathname)) {
		goto('/login');
	}

	$: showSidebar = $auth.isAuthenticated && !publicRoutes.includes($page.url.pathname);
</script>

<div class="min-h-screen bg-surface-900">
	{#if showSidebar}
		<Sidebar bind:collapsed={sidebarCollapsed} />
		<main 
			class="transition-all duration-300"
			style="margin-left: {sidebarCollapsed ? '4rem' : '16rem'}"
		>
			<slot />
		</main>
	{:else}
		<slot />
	{/if}
</div>

