<script>
	import { goto } from '$app/navigation';
	import { auth, tasks } from '$lib/stores';

	let formData = {
		title: '',
		description: '',
		task_type: 'article',
		language: 'RU',
		client_id: '',
		media_id: '',
		google_doc_url: '',
		google_forms_url: ''
	};

	let clients = [];
	let mediaList = [];
	let loading = false;
	let error = '';

	// Load clients and media
	async function loadData() {
		try {
			const [clientsRes, mediaRes] = await Promise.all([
				fetch('/api/clients/', { headers: { 'Authorization': `Bearer ${$auth.token}` } }),
				fetch('/api/media/', { headers: { 'Authorization': `Bearer ${$auth.token}` } })
			]);
			clients = await clientsRes.json();
			mediaList = await mediaRes.json();
		} catch (e) {
			console.error('Failed to load data:', e);
		}
	}

	loadData();

	async function handleSubmit() {
		error = '';

		if (!formData.client_id) {
			error = 'Выберите клиента';
			return;
		}

		loading = true;

		try {
			const task = await tasks.create({
				...formData,
				media_id: formData.media_id || null
			});
			goto('/tasks');
		} catch (e) {
			error = 'Ошибка создания задачи';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Новая задача | CRM</title>
</svelte:head>

<div class="p-8 max-w-2xl mx-auto">
	<div class="flex items-center gap-4 mb-8">
		<a href="/tasks" class="p-2 hover:bg-surface-700 rounded-lg transition-colors">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-2xl font-bold">Новая задача</h1>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		{#if error}
			<div class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
				{error}
			</div>
		{/if}

		<!-- Client -->
		<div>
			<label class="block text-sm font-medium mb-2">Клиент *</label>
			<select
				bind:value={formData.client_id}
				required
				class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
			>
				<option value="">Выберите клиента</option>
				{#each clients as client}
					<option value={client.id}>{client.first_name} {client.last_name}</option>
				{/each}
			</select>
		</div>

		<!-- Title -->
		<div>
			<label class="block text-sm font-medium mb-2">Заголовок *</label>
			<input
				type="text"
				bind:value={formData.title}
				required
				placeholder="ФИ клиента или название задачи"
				class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
			/>
		</div>

		<!-- Description -->
		<div>
			<label class="block text-sm font-medium mb-2">Описание</label>
			<textarea
				bind:value={formData.description}
				rows="3"
				placeholder="Краткое описание задачи..."
				class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
			></textarea>
		</div>

		<!-- Type and Language -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Тип задачи</label>
				<select
					bind:value={formData.task_type}
					class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
				>
					<option value="article">Статья для СМИ</option>
					<option value="recommendation">Рекомендательное письмо</option>
					<option value="cover_letter">Сопроводительное письмо</option>
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Язык</label>
				<select
					bind:value={formData.language}
					class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
				>
					<option value="RU">🇷🇺 Русский</option>
					<option value="EN">🇬🇧 English</option>
				</select>
			</div>
		</div>

		<!-- Media -->
		<div>
			<label class="block text-sm font-medium mb-2">СМИ</label>
			<select
				bind:value={formData.media_id}
				class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
			>
				<option value="">Не выбрано</option>
				{#each mediaList as media}
					<option value={media.id}>{media.name}</option>
				{/each}
			</select>
		</div>

		<!-- Links -->
		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-2">Google Doc</label>
				<input
					type="url"
					bind:value={formData.google_doc_url}
					placeholder="https://docs.google.com/..."
					class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Google Forms (ответы клиента)</label>
				<input
					type="url"
					bind:value={formData.google_forms_url}
					placeholder="https://docs.google.com/forms/..."
					class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-4 pt-4">
			<a href="/tasks" class="flex-1 py-3 text-center border border-surface-600 hover:bg-surface-700 rounded-lg transition-colors">
				Отмена
			</a>
			<button
				type="submit"
				disabled={loading}
				class="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 rounded-lg font-medium transition-colors"
			>
				{#if loading}
					Создание...
				{:else}
					Создать задачу
				{/if}
			</button>
		</div>
	</form>
</div>

