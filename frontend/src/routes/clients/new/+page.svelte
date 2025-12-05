<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';
	import { API_BASE } from '$lib/api.js';

	let formData = {
		first_name: '',
		last_name: '',
		company: '',
		position: '',
		phone: '',
		email: '',
		telegram_username: '',
		lawyer_name: '',
		lawyer_contact: ''
	};

	let loading = false;
	let error = '';

	async function handleSubmit() {
		error = '';

		// Trim all fields
		const trimmedData = {
			first_name: formData.first_name.trim(),
			last_name: formData.last_name.trim(),
			company: formData.company.trim() || null,
			position: formData.position.trim() || null,
			phone: formData.phone.trim() || null,
			email: formData.email.trim() || null,
			telegram_username: formData.telegram_username.trim().replace(/^@/, '') || null,
			lawyer_name: formData.lawyer_name.trim() || null,
			lawyer_contact: formData.lawyer_contact.trim() || null
		};

		if (!trimmedData.first_name || !trimmedData.last_name) {
			error = 'Укажите имя и фамилию клиента';
			return;
		}

		// Validate email format if provided
		if (trimmedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedData.email)) {
			error = 'Некорректный формат email';
			return;
		}

		loading = true;

		try {
			const response = await fetch(`${API_BASE}/api/clients/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$auth.token}`
				},
				body: JSON.stringify(trimmedData)
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.detail || 'Failed to create client');
			}

			goto('/clients');
		} catch (e) {
			error = e.message || 'Ошибка создания клиента';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Новый клиент | CRM</title>
</svelte:head>

<div class="p-8 max-w-2xl mx-auto">
	<div class="flex items-center gap-4 mb-8">
		<a href="/clients" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<h1 class="text-2xl font-bold">Новый клиент</h1>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		{#if error}
			<div class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-600 text-sm">
				{error}
			</div>
		{/if}

		<!-- Name -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Имя *</label>
				<input
					type="text"
					bind:value={formData.first_name}
					required
					placeholder="Алексей"
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Фамилия *</label>
				<input
					type="text"
					bind:value={formData.last_name}
					required
					placeholder="Иванов"
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<!-- Company and Position -->
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-2">Компания</label>
				<input
					type="text"
					bind:value={formData.company}
					placeholder="ООО Компания"
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Должность</label>
				<input
					type="text"
					bind:value={formData.position}
					placeholder="Генеральный директор"
					class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<!-- Contacts section -->
		<div class="border-t border-gray-200 pt-6">
			<h2 class="text-lg font-semibold mb-4">Контакты</h2>
			
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-2">Telegram</label>
					<input
						type="text"
						bind:value={formData.telegram_username}
						placeholder="@username"
						class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Email</label>
					<input
						type="email"
						bind:value={formData.email}
						placeholder="email@example.com"
						class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium mb-2">Телефон</label>
					<input
						type="tel"
						bind:value={formData.phone}
						placeholder="+7 (999) 123-45-67"
						class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
			</div>
		</div>

		<!-- Lawyer section -->
		<div class="border-t border-gray-200 pt-6">
			<h2 class="text-lg font-semibold mb-4">Юрист / Юридическое агентство</h2>
			<p class="text-sm text-gray-500 mb-4">Опционально</p>
			
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium mb-2">Имя юриста / Название агентства</label>
					<input
						type="text"
						bind:value={formData.lawyer_name}
						placeholder="Юридическое бюро"
						class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium mb-2">Контакт</label>
					<input
						type="text"
						bind:value={formData.lawyer_contact}
						placeholder="Телефон или email"
						class="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
					/>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-4 pt-4">
			<a href="/clients" class="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors">
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
					Добавить клиента
				{/if}
			</button>
		</div>
	</form>
</div>

