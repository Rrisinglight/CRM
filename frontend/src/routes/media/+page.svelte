<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';
	import { API_BASE } from '$lib/api.js';

	let mediaList = [];
	let loading = true;
	let search = '';
	let category = '';

	onMount(() => {
		loadMedia();
	});

	async function loadMedia() {
		loading = true;
		try {
			const params = new URLSearchParams();
			if (search) params.append('search', search);
			if (category) params.append('category', category);

			const response = await fetch(`${API_BASE}/api/media/?${params}`, {
				headers: { 'Authorization': `Bearer ${$auth.token}` }
			});
			mediaList = await response.json();
		} catch (e) {
			console.error('Failed to load media:', e);
		}
		loading = false;
	}

	function handleSearch() {
		loadMedia();
	}
</script>

<svelte:head>
	<title>СМИ | CRM</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold">СМИ</h1>
		<a href="/media/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
			+ Добавить СМИ
		</a>
	</div>

	<!-- Search and filters -->
	<div class="flex gap-4 mb-6">
		<input
			type="text"
			bind:value={search}
			on:keyup={(e) => e.key === 'Enter' && handleSearch()}
			placeholder="Поиск по названию..."
			class="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
		/>
		<select
			bind:value={category}
			on:change={handleSearch}
			class="px-4 py-2 pr-8 bg-gray-100 border border-gray-300 rounded-lg appearance-none bg-no-repeat bg-right cursor-pointer"
			style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.5rem center; background-size: 1.25rem;"
		>
			<option value="">Все категории</option>
			<option value="деловое">Деловое</option>
			<option value="lifestyle">Lifestyle</option>
			<option value="IT">IT</option>
			<option value="региональное">Региональное</option>
		</select>
		<button on:click={handleSearch} class="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
			Найти
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
		</div>
	{:else if mediaList.length === 0}
		<div class="text-center py-20 text-gray-500">
			СМИ не найдены
		</div>
	{:else}
		<div class="grid grid-cols-3 gap-4">
			{#each mediaList as media}
				<div class="bg-white rounded-lg overflow-hidden hover:bg-surface-750 transition-colors">
					<div class="p-6">
						<div class="flex items-start gap-4">
							{#if media.logo_url}
								<img src={media.logo_url} alt="" class="w-16 h-16 rounded-lg object-cover" />
							{:else}
								<div class="w-16 h-16 rounded-lg bg-purple-500/30 flex items-center justify-center">
									<svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
									</svg>
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold">{media.name}</h3>
								{#if media.category}
									<span class="text-xs px-2 py-0.5 bg-gray-200 rounded mt-1 inline-block">
										{media.category}
									</span>
								{/if}
								{#if media.description}
									<p class="text-sm text-gray-500 mt-2 line-clamp-2">{media.description}</p>
								{/if}
							</div>
						</div>
						<div class="mt-4 flex gap-2">
							{#if media.website_url}
								<a 
									href={media.website_url}
									target="_blank"
									class="text-xs px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
								>
									Сайт
								</a>
							{/if}
							<span class="text-xs px-3 py-1.5 bg-gray-200 rounded">
								{media.language === 'RU' ? '🇷🇺 RU' : '🇬🇧 EN'}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

