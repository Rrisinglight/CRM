<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';
	import { API_BASE } from '$lib/api.js';

	let formData = {
		name: '',
		description: '',
		category: '',
		language: 'RU',
		website_url: '',
		notes: ''
	};

	let loading = false;
	let error = '';

	const categories = [
		{ value: 'деловое', label: 'Деловое' },
		{ value: 'lifestyle', label: 'Lifestyle' },
		{ value: 'IT', label: 'IT' },
		{ value: 'региональное', label: 'Региональное' }
	];

	async function handleSubmit() {
		error = '';

		if (!formData.name.trim()) {
			error = 'Введите название СМИ';
			return;
		}

		if (formData.website_url && !isValidUrl(formData.website_url)) {
			error = 'Некорректная ссылка на сайт';
			return;
		}

		loading = true;

		try {
			const payload = {
				name: formData.name.trim(),
				description: formData.description.trim() || null,
				category: formData.category || null,
				language: formData.language,
				website_url: formData.website_url.trim() || null,
				notes: formData.notes.trim() || null
			};

			const response = await fetch(`${API_BASE}/api/media/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$auth.token}`
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.detail || 'Не удалось создать СМИ');
			}

			goto('/media');
		} catch (e) {
			error = e.message || 'Ошибка создания СМИ';
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
	<title>Новое СМИ | CRM</title>
</svelte:head>

<div class="p-8 max-w-2xl mx-auto">
	<div class="flex items-center gap-4 mb-8">
		<a href="/media" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-2xl font-bold">Новое СМИ</h1>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		{#if error}
			<div class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 text-sm">
				{error}
			</div>
		{/if}

		<!-- Name -->
		<div>
			<label class="block text-sm font-medium mb-2">Название *</label>
			<input
				type="text"
				bind:value={formData.name}
				required
				placeholder="Forbes, РБК, Ведомости..."
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
			/>
		</div>

		<!-- Description -->
		<div>
			<label class="block text-sm font-medium mb-2">Описание</label>
			<textarea
				bind:value={formData.description}
				rows="3"
				placeholder="Краткое описание издания..."
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
			></textarea>
		</div>

		<!-- Category and Language -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Категория</label>
				<select
					bind:value={formData.category}
					class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-no-repeat cursor-pointer"
					style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
				>
					<option value="">Не выбрана</option>
					{#each categories as cat}
						<option value={cat.value}>{cat.label}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Язык публикаций</label>
				<select
					bind:value={formData.language}
					class="w-full px-4 py-3 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-no-repeat cursor-pointer"
					style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.75rem center; background-size: 1.25rem;"
				>
					<option value="RU">🇷🇺 Русский</option>
					<option value="EN">🇬🇧 English</option>
				</select>
			</div>
		</div>

		<!-- Website -->
		<div>
			<label class="block text-sm font-medium mb-2">Сайт</label>
			<input
				type="url"
				bind:value={formData.website_url}
				placeholder="https://example.com"
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
			/>
		</div>

		<!-- Notes -->
		<div>
			<label class="block text-sm font-medium mb-2">Примечания</label>
			<textarea
				bind:value={formData.notes}
				rows="3"
				placeholder="Особые условия, формат публикации, требования..."
				class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
			></textarea>
		</div>

		<!-- Actions -->
		<div class="flex gap-4 pt-4">
			<a href="/media" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
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
					Добавить СМИ
				{/if}
			</button>
		</div>
	</form>
</div>


