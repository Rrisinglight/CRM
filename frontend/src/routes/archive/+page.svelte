<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';

	let tasks = [];
	let loading = true;
	let search = '';

	onMount(() => {
		loadArchive();
	});

	async function loadArchive() {
		loading = true;
		try {
			const params = new URLSearchParams({ status: 'published' });
			if (search) params.append('search', search);

			const response = await fetch(`/api/tasks/?${params}`, {
				headers: { 'Authorization': `Bearer ${$auth.token}` }
			});
			tasks = await response.json();
		} catch (e) {
			console.error('Failed to load archive:', e);
		}
		loading = false;
	}

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('ru-RU');
	}
</script>

<svelte:head>
	<title>Архив | CRM</title>
</svelte:head>

<div class="p-8">
	<h1 class="text-2xl font-bold mb-8">Архив задач</h1>

	<!-- Search -->
	<div class="mb-6">
		<input
			type="text"
			bind:value={search}
			on:keyup={(e) => e.key === 'Enter' && loadArchive()}
			placeholder="Поиск по названию, описанию..."
			class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
		/>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
		</div>
	{:else if tasks.length === 0}
		<div class="text-center py-20 text-gray-500">
			Архив пуст
		</div>
	{:else}
		<div class="bg-white rounded-lg overflow-hidden">
			<table class="w-full">
				<thead class="bg-gray-100">
					<tr>
						<th class="text-left px-4 py-3 font-medium">Задача</th>
						<th class="text-left px-4 py-3 font-medium">Клиент</th>
						<th class="text-left px-4 py-3 font-medium">СМИ</th>
						<th class="text-left px-4 py-3 font-medium">Автор</th>
						<th class="text-left px-4 py-3 font-medium">Опубликовано</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-surface-700">
					{#each tasks as task}
						<tr class="hover:bg-surface-750 transition-colors">
							<td class="px-4 py-3">
								<div class="font-medium">{task.title}</div>
								{#if task.description}
									<div class="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if task.client}
									{task.client.first_name} {task.client.last_name}
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if task.media}
									<div class="flex items-center gap-2">
										{#if task.media.logo_url}
											<img src={task.media.logo_url} alt="" class="w-5 h-5 rounded" />
										{/if}
										{task.media.name}
									</div>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if task.author}
									{task.author.first_name} {task.author.last_name}
								{/if}
							</td>
							<td class="px-4 py-3 text-gray-500">
								{formatDate(task.publication_date || task.status_changed_at)}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

