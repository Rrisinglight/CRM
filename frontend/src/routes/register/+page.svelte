<script>
	import { goto } from '$app/navigation';

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

	async function handleSubmit() {
		error = '';

		if (formData.password !== formData.confirmPassword) {
			error = 'Пароли не совпадают';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="bg-surface-800 rounded-xl p-8 shadow-xl">
			<h1 class="text-2xl font-bold text-center mb-8">Регистрация</h1>

			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				{#if error}
					<div class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
						{error}
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="first_name" class="block text-sm font-medium mb-2">Имя *</label>
						<input
							id="first_name"
							type="text"
							bind:value={formData.first_name}
							required
							class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
						/>
					</div>
					<div>
						<label for="last_name" class="block text-sm font-medium mb-2">Фамилия *</label>
						<input
							id="last_name"
							type="text"
							bind:value={formData.last_name}
							required
							class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
						/>
					</div>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium mb-2">Email *</label>
					<input
						id="email"
						type="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
					/>
				</div>

				<div>
					<label for="telegram" class="block text-sm font-medium mb-2">Telegram</label>
					<input
						id="telegram"
						type="text"
						bind:value={formData.telegram_username}
						placeholder="username"
						class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
					/>
				</div>

				<div>
					<label for="phone" class="block text-sm font-medium mb-2">Телефон</label>
					<input
						id="phone"
						type="tel"
						bind:value={formData.phone}
						class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium mb-2">Пароль *</label>
					<input
						id="password"
						type="password"
						bind:value={formData.password}
						required
						minlength="6"
						class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
					/>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium mb-2">Подтвердите пароль *</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={formData.confirmPassword}
						required
						class="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 rounded-lg font-medium transition-colors mt-6"
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

			<p class="mt-6 text-center text-sm text-surface-400">
				Уже есть аккаунт?
				<a href="/login" class="text-primary-400 hover:text-primary-300">Войти</a>
			</p>
		</div>
	</div>
</div>

