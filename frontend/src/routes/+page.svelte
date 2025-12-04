<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';

	onMount(() => {
		if ($auth.isAuthenticated) {
			goto('/tasks');
		} else {
			goto('/login');
		}
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
</div>

