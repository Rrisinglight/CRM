<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';

	let clients = [];
	let loading = true;
	let search = '';

	onMount(() => {
		loadClients();
	});

	async function loadClients() {
		loading = true;
		try {
			const params = new URLSearchParams();
			if (search) params.append('search', search);

			const response = await fetch(`/api/clients/?${params}`, {
				headers: { 'Authorization': `Bearer ${$auth.token}` }
			});
			clients = await response.json();
		} catch (e) {
			console.error('Failed to load clients:', e);
		}
		loading = false;
	}

	function handleSearch() {
		loadClients();
	}
</script>

<svelte:head>
	<title>Клиенты | CRM</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold">Клиенты</h1>
		<a href="/clients/new" class="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">
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
				class="flex-1 px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
			/>
			<button on:click={handleSearch} class="px-6 py-3 bg-surface-600 hover:bg-surface-500 rounded-lg">
				Найти
			</button>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
		</div>
	{:else if clients.length === 0}
		<div class="text-center py-20 text-surface-400">
			Клиенты не найдены
		</div>
	{:else}
		<div class="grid grid-cols-3 gap-4">
			{#each clients as client}
				<div class="bg-surface-800 rounded-lg p-6 hover:bg-surface-750 transition-colors">
					<div class="flex items-start gap-4">
						{#if client.avatar_url}
							<img src={client.avatar_url} alt="" class="w-12 h-12 rounded-full" />
						{:else}
							<div class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black">
								{client.first_name[0]}{client.last_name[0]}
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold">{client.first_name} {client.last_name}</h3>
							{#if client.company}
								<p class="text-sm text-surface-400">{client.position || ''} {client.company}</p>
							{/if}
							<div class="mt-3 flex flex-wrap gap-2">
								{#if client.telegram_username}
									<a 
										href="https://t.me/{client.telegram_username}"
										target="_blank"
										class="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
									>
										@{client.telegram_username}
									</a>
								{/if}
								{#if client.email}
									<a 
										href="mailto:{client.email}"
										class="text-xs px-2 py-1 bg-surface-600 rounded hover:bg-surface-500"
									>
										{client.email}
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

