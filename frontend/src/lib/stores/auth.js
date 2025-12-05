import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { API_BASE } from '$lib/api.js';

function createAuthStore() {
	const { subscribe, set, update } = writable({
		user: null,
		token: browser ? localStorage.getItem('token') : null,
		isAuthenticated: false
	});

	return {
		subscribe,
		login: async (email, password) => {
			const formData = new FormData();
			formData.append('username', email);
			formData.append('password', password);

			const response = await fetch(`${API_BASE}/api/auth/login`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Invalid credentials');
			}

			const data = await response.json();
			if (browser) {
				localStorage.setItem('token', data.access_token);
			}

			update(state => ({
				...state,
				token: data.access_token,
				isAuthenticated: true
			}));

			// Fetch user info
			const userResponse = await fetch(`${API_BASE}/api/auth/me`, {
				headers: {
					'Authorization': `Bearer ${data.access_token}`
				}
			});
			const user = await userResponse.json();
			update(state => ({ ...state, user }));

			return user;
		},
		logout: () => {
			if (browser) {
				localStorage.removeItem('token');
			}
			set({ user: null, token: null, isAuthenticated: false });
		},
		checkAuth: async () => {
			const token = browser ? localStorage.getItem('token') : null;
			if (!token) return false;

			try {
				const response = await fetch(`${API_BASE}/api/auth/me`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!response.ok) {
					throw new Error('Token invalid');
				}

				const user = await response.json();
				set({ user, token, isAuthenticated: true });
				return true;
			} catch {
				if (browser) {
					localStorage.removeItem('token');
				}
				set({ user: null, token: null, isAuthenticated: false });
				return false;
			}
		}
	};
}

export const auth = createAuthStore();

