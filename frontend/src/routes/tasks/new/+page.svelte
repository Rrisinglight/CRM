<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';
	import { API_BASE } from '$lib/api.js';

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
				fetch(`${API_BASE}/api/clients/`, { headers: { 'Authorization': `Bearer ${$auth.token}` } }),
				fetch(`${API_BASE}/api/media/`, { headers: { 'Authorization': `Bearer ${$auth.token}` } })
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

		// Validation
		if (!formData.client_id) {
			error = 'Выберите клиента';
			return;
		}

		if (!formData.title.trim()) {
			error = 'Введите заголовок задачи';
			return;
		}

		// Validate URLs if provided
		if (formData.google_doc_url && !isValidUrl(formData.google_doc_url)) {
			error = 'Некорректная ссылка на Google Doc';
			return;
		}

		if (formData.google_forms_url && !isValidUrl(formData.google_forms_url)) {
			error = 'Некорректная ссылка на Google Forms';
			return;
		}

		loading = true;

		try {
			const payload = {
				client_id: formData.client_id,
				title: formData.title.trim(),
				description: formData.description.trim() || null,
				task_type: formData.task_type,
				language: formData.language,
				media_id: formData.media_id || null,
				google_doc_url: formData.google_doc_url.trim() || null,
				google_forms_url: formData.google_forms_url.trim() || null
			};

			const response = await fetch(`${API_BASE}/api/tasks/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$auth.token}`
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				if (data.detail) {
					if (typeof data.detail === 'string') {
						throw new Error(data.detail);
					} else if (Array.isArray(data.detail)) {
						// Pydantic validation errors
						const messages = data.detail.map(err => {
							const field = err.loc?.slice(-1)[0] || 'поле';
							return `${field}: ${err.msg}`;
						});
						throw new Error(messages.join(', '));
					}
				}
				throw new Error('Не удалось создать задачу');
			}

			goto('/tasks');
		} catch (e) {
			error = e.message || 'Ошибка создания задачи';
		}

		loading = false;
	}

	function isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	}
</script>

<svelte:head>
	<title>Новая задача | CRM</title>
</svelte:head>

<div class="p-8 max-w-2xl mx-auto">
	<div class="flex items-center gap-4 mb-8">
		<a href="/tasks" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
				class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer"
				style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
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
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
			/>
		</div>

		<!-- Description -->
		<div>
			<label class="block text-sm font-medium mb-2">Описание</label>
			<textarea
				bind:value={formData.description}
				rows="3"
				placeholder="Краткое описание задачи..."
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
			></textarea>
		</div>

		<!-- Type and Language -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Тип задачи</label>
				<select
					bind:value={formData.task_type}
					class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer"
					style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
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
					class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer"
					style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
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
				class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-no-repeat cursor-pointer"
				style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
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
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Google Forms (ответы клиента)</label>
				<input
					type="url"
					bind:value={formData.google_forms_url}
					placeholder="https://docs.google.com/forms/..."
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-4 pt-4">
			<a href="/tasks" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
				Отмена
			</a>
			<button
				type="submit"
				disabled={loading}
				class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white"
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

