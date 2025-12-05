<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';
	import { API_BASE } from '$lib/api.js';

	let clients = [];
	let tasks = [];
	let loading = true;
	let search = '';
	let copiedEmail = null;

	// Status colors matching kanban board
	const statusColors = {
		new: '#3B82F6',           // blue
		in_progress: '#F59E0B',   // amber
		editor_review: '#8B5CF6', // purple
		client_approval: '#EC4899', // pink
		client_approved: '#10B981', // emerald
		sent_to_media: '#06B6D4', // cyan
		published: '#22C55E',     // green
		postponed: '#6B7280'      // gray
	};

	const statusLabels = {
		new: 'Новая',
		in_progress: 'В работе',
		editor_review: 'На проверке',
		client_approval: 'На согласовании',
		client_approved: 'Согласовано',
		sent_to_media: 'Отправлено в СМИ',
		published: 'Опубликовано',
		postponed: 'Отложено'
	};

	onMount(() => {
		loadData();
	});

	async function loadData() {
		loading = true;
		try {
			const params = new URLSearchParams();
			if (search) params.append('search', search);

			const [clientsRes, tasksRes] = await Promise.all([
				fetch(`${API_BASE}/api/clients/?${params}`, {
					headers: { 'Authorization': `Bearer ${$auth.token}` }
				}),
				fetch(`${API_BASE}/api/tasks/`, {
					headers: { 'Authorization': `Bearer ${$auth.token}` }
				})
			]);
			
			clients = await clientsRes.json();
			tasks = await tasksRes.json();
		} catch (e) {
			console.error('Failed to load data:', e);
		}
		loading = false;
	}

	function handleSearch() {
		loadData();
	}

	function getClientTasks(clientId) {
		return tasks.filter(t => t.client_id === clientId);
	}

	function getActiveTasks(clientId) {
		return getClientTasks(clientId).filter(t => t.status !== 'published' && t.status !== 'postponed');
	}

	function getCompletedTasks(clientId) {
		return getClientTasks(clientId).filter(t => t.status === 'published');
	}

	function formatDate(dateStr) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
	}

	async function copyEmail(email) {
		try {
			await navigator.clipboard.writeText(email);
			copiedEmail = email;
			setTimeout(() => copiedEmail = null, 2000);
		} catch (e) {
			console.error('Failed to copy:', e);
		}
	}
</script>

<svelte:head>
	<title>Клиенты | CRM</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold">Клиенты</h1>
		<a href="/clients/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
			+ Добавить клиента
		</a>
	</div>

	<!-- Search -->
	<div class="mb-6">
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={search}
				on:keyup={(e) => e.key === 'Enter' && handleSearch()}
				placeholder="Поиск по имени, компании..."
				class="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
			/>
			<button on:click={handleSearch} class="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg">
				Найти
			</button>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
		</div>
	{:else if clients.length === 0}
		<div class="text-center py-20 text-gray-500">
			Клиенты не найдены
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each clients as client}
				{@const activeTasks = getActiveTasks(client.id)}
				{@const completedTasks = getCompletedTasks(client.id)}
				<div class="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
					<!-- Header -->
					<div class="flex items-start gap-4">
						{#if client.avatar_url}
							<img src={client.avatar_url} alt="" class="w-12 h-12 rounded-full" />
						{:else}
							<div class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white text-lg">
								{client.first_name[0]}{client.last_name[0]}
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-lg">{client.first_name} {client.last_name}</h3>
							{#if client.company}
								<p class="text-sm text-gray-500">{client.position ? client.position + ', ' : ''}{client.company}</p>
							{/if}
						</div>
					</div>

					<!-- Contacts -->
					<div class="mt-4 flex flex-wrap items-center gap-2">
						{#if client.telegram_username}
							<a 
								href="https://t.me/{client.telegram_username}"
								target="_blank"
								class="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 transition-colors"
							>
								<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
									<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
								</svg>
								@{client.telegram_username}
							</a>
						{/if}
						{#if client.email}
							<div class="inline-flex items-center gap-1">
								<a 
									href="mailto:{client.email}"
									class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
								>
									{client.email}
								</a>
								<button
									on:click={() => copyEmail(client.email)}
									class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
									title="Копировать"
								>
									{#if copiedEmail === client.email}
										<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{:else}
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
									{/if}
								</button>
							</div>
						{/if}
					</div>

					<!-- Active Tasks -->
					{#if activeTasks.length > 0}
						<div class="mt-4 pt-4 border-t border-gray-100">
							<div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
								Активные задачи ({activeTasks.length})
							</div>
							<div class="space-y-2">
								{#each activeTasks as task}
									<div class="flex items-center gap-2 text-sm">
										<span 
											class="w-2 h-2 rounded-full flex-shrink-0"
											style="background-color: {statusColors[task.status]}"
											title={statusLabels[task.status]}
										></span>
										<span class="truncate flex-1 text-gray-700">{task.title}</span>
										<span class="text-xs text-gray-400 flex-shrink-0">{formatDate(task.created_at)}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Completed Tasks -->
					{#if completedTasks.length > 0}
						<div class="mt-3 pt-3 border-t border-gray-100">
							<div class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
								Опубликовано ({completedTasks.length})
							</div>
							<div class="space-y-2">
								{#each completedTasks.slice(0, 3) as task}
									<div class="flex items-center gap-2 text-sm">
										<span 
											class="w-2 h-2 rounded-full flex-shrink-0 bg-green-500"
											title="Опубликовано"
										></span>
										<span class="truncate flex-1 text-gray-500">{task.title}</span>
										<span class="text-xs text-gray-400 flex-shrink-0">{formatDate(task.publication_date || task.created_at)}</span>
									</div>
								{/each}
								{#if completedTasks.length > 3}
									<div class="text-xs text-gray-400">
										+{completedTasks.length - 3} ещё
									</div>
								{/if}
							</div>
						</div>
					{/if}

					<!-- No tasks -->
					{#if activeTasks.length === 0 && completedTasks.length === 0}
						<div class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-400">
							Нет задач
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
