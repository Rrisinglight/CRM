<script>
	import { onMount } from 'svelte';
	import { tasks } from '$lib/stores';
	import Board from '$lib/components/kanban/Board.svelte';

	onMount(() => {
		tasks.load();
	});
</script>

<svelte:head>
	<title>Задачи | CRM</title>
</svelte:head>

<div class="h-screen">
	<Board />
</div>

