<script>
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;
	let errors = { email: '', password: '' };

	function validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	function validateForm() {
		errors = { email: '', password: '' };
		let isValid = true;

		if (!email.trim()) {
			errors.email = 'Email обязателен';
			isValid = false;
		} else if (!validateEmail(email)) {
			errors.email = 'Введите корректный email';
			isValid = false;
		}

		if (!password) {
			errors.password = 'Пароль обязателен';
			isValid = false;
		} else if (password.length < 6) {
			errors.password = 'Пароль должен быть не менее 6 символов';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit() {
		if (!validateForm()) return;
		
		error = '';
		loading = true;

		try {
			await auth.login(email, password);
			goto('/tasks');
		} catch (e) {
			error = 'Неверный email или пароль';
		}

		loading = false;
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
	<div class="w-full max-w-md">
		<div class="bg-white rounded-xl p-8 shadow-xl border border-gray-200">
			<h1 class="text-2xl font-bold text-center mb-8 text-gray-800">CRM для журналистов</h1>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				{#if error}
					<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
						{error}
					</div>
				{/if}

				<div>
					<label for="email" class="block text-sm font-medium mb-2 text-gray-700">Email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.email ? 'border-red-400' : 'border-gray-300'}"
						placeholder="your@email.com"
					/>
					{#if errors.email}
						<p class="mt-1 text-xs text-red-500">{errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="password" class="block text-sm font-medium mb-2 text-gray-700">Пароль</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-400 {errors.password ? 'border-red-400' : 'border-gray-300'}"
						placeholder="••••••••"
					/>
					{#if errors.password}
						<p class="mt-1 text-xs text-red-500">{errors.password}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 text-white shadow-lg hover:shadow-blue-500/30"
				>
					{#if loading}
						<span class="flex items-center justify-center gap-2">
							<span class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
							Вход...
						</span>
					{:else}
						Войти
					{/if}
				</button>
			</form>

		<p class="mt-6 text-center text-sm text-gray-500">
			Нет аккаунта?
			<a 
				href="/register" 
				class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
			>Зарегистрироваться</a>
		</p>
		</div>
	</div>
</div>

