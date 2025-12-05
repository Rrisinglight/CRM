import { browser } from '$app/environment';

// In production, use the backend directly
// In development (via Vite proxy), use relative path
const API_BASE = browser ? 'http://127.0.0.1:8000' : 'http://127.0.0.1:8000';

export async function api(endpoint, options = {}) {
	const url = `${API_BASE}${endpoint}`;
	
	const config = {
		...options,
		headers: {
			...options.headers
		}
	};

	// Add Content-Type for JSON body
	if (options.body && typeof options.body === 'string') {
		config.headers['Content-Type'] = 'application/json';
	}

	// Add auth token if available
	if (browser) {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
	}

	const response = await fetch(url, config);
	return response;
}

export { API_BASE };



