<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib/api.js';

	let formData = {
		email: '',
		password: '',
		confirmPassword: '',
		first_name: '',
		last_name: '',
		telegram_username: '',
		phone: ''
	};
	let error = '';
	let loading = false;
	let errors = {
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: ''
	};

	function validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function validatePhone(phone) {
		if (!phone) return true;
		const re = /^[\d\s\-+()]+$/;
		return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
	}

	function validateForm() {
		errors = {
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			confirmPassword: '',
			phone: ''
		};
		let isValid = true;

		if (!formData.first_name.trim()) {
			errors.first_name = 'Имя обязательно';
			isValid = false;
		} else if (formData.first_name.length < 2) {
			errors.first_name = 'Минимум 2 символа';
			isValid = false;
		}

		if (!formData.last_name.trim()) {
			errors.last_name = 'Фамилия обязательна';
			isValid = false;
		} else if (formData.last_name.length < 2) {
			errors.last_name = 'Минимум 2 символа';
			isValid = false;
		}

		if (!formData.email.trim()) {
			errors.email = 'Email обязателен';
			isValid = false;
		} else if (!validateEmail(formData.email)) {
			errors.email = 'Введите корректный email';
			isValid = false;
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = 'Минимум 6 символов';
			isValid = false;
		}

		if (!formData.confirmPassword) {
			errors.confirmPassword = 'Подтвердите пароль';
			isValid = false;
		} else if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Пароли не совпадают';
			isValid = false;
		}

		if (formData.phone && !validatePhone(formData.phone)) {
			errors.phone = 'Введите корректный номер телефона';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		error = '';
		loading = true;

		try {
			const response = await api('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					first_name: formData.first_name,
					last_name: formData.last_name,
					telegram_username: formData.telegram_username || null,
					phone: formData.phone || null
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.detail || 'Registration failed');
			}

			goto('/login?registered=true');
		} catch (e) {
			error = e.message || 'Ошибка регистрации';
		}

		loading = false;
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-xl p-8 shadow-xl border border-gray-200">
			<h1 class="text-2xl font-bold text-center mb-8 text-gray-800">Регистрация</h1>

			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				{#if error}
					<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
						{error}
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="first_name" class="block text-sm font-medium mb-2 text-gray-700">Имя *</label>
						<input
							id="first_name"
							type="text"
							bind:value={formData.first_name}
							class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.first_name ? 'border-red-400' : 'border-gray-300'}"
						/>
						{#if errors.first_name}
							<p class="mt-1 text-xs text-red-500">{errors.first_name}</p>
						{/if}
					</div>
					<div>
						<label for="last_name" class="block text-sm font-medium mb-2 text-gray-700">Фамилия *</label>
						<input
							id="last_name"
							type="text"
							bind:value={formData.last_name}
							class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.last_name ? 'border-red-400' : 'border-gray-300'}"
						/>
						{#if errors.last_name}
							<p class="mt-1 text-xs text-red-500">{errors.last_name}</p>
						{/if}
					</div>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium mb-2 text-gray-700">Email *</label>
					<input
						id="email"
						type="email"
						bind:value={formData.email}
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.email ? 'border-red-400' : 'border-gray-300'}"
						placeholder="your@email.com"
					/>
					{#if errors.email}
						<p class="mt-1 text-xs text-red-500">{errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="telegram" class="block text-sm font-medium mb-2 text-gray-700">Telegram</label>
					<input
						id="telegram"
						type="text"
						bind:value={formData.telegram_username}
						placeholder="@username"
						class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400"
					/>
				</div>

				<div>
					<label for="phone" class="block text-sm font-medium mb-2 text-gray-700">Телефон</label>
					<input
						id="phone"
						type="tel"
						bind:value={formData.phone}
						placeholder="+7 (999) 123-45-67"
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.phone ? 'border-red-400' : 'border-gray-300'}"
					/>
					{#if errors.phone}
						<p class="mt-1 text-xs text-red-500">{errors.phone}</p>
					{/if}
				</div>

				<div>
					<label for="password" class="block text-sm font-medium mb-2 text-gray-700">Пароль *</label>
					<input
						id="password"
						type="password"
						bind:value={formData.password}
						placeholder="Минимум 6 символов"
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.password ? 'border-red-400' : 'border-gray-300'}"
					/>
					{#if errors.password}
						<p class="mt-1 text-xs text-red-500">{errors.password}</p>
					{/if}
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium mb-2 text-gray-700">Подтвердите пароль *</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={formData.confirmPassword}
						placeholder="Повторите пароль"
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}"
					/>
					{#if errors.confirmPassword}
						<p class="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/30 mt-6"
				>
					{#if loading}
						<span class="flex items-center justify-center gap-2">
							<span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
							Регистрация...
						</span>
					{:else}
						Зарегистрироваться
					{/if}
				</button>
			</form>

		<p class="mt-6 text-center text-sm text-gray-500">
			Уже есть аккаунт?
			<a 
				href="/login" 
				class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
			>Войти</a>
		</p>
		</div>
	</div>
</div>

