import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { tasks } from './tasks.js';

function createWebSocketStore() {
	const { subscribe, set, update } = writable({
		connected: false,
		reconnecting: false
	});

	let ws = null;
	let reconnectTimeout = null;

	const connect = () => {
		if (!browser) return;

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(`${protocol}//${window.location.host}/api/ws/board`);

		ws.onopen = () => {
			update(state => ({ ...state, connected: true, reconnecting: false }));
			console.log('WebSocket connected');
		};

		ws.onclose = () => {
			update(state => ({ ...state, connected: false }));
			console.log('WebSocket disconnected');
			// Reconnect after 3 seconds
			reconnectTimeout = setTimeout(() => {
				update(state => ({ ...state, reconnecting: true }));
				connect();
			}, 3000);
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			handleMessage(message);
		};
	};

	const handleMessage = (message) => {
		switch (message.type) {
			case 'task_created':
			case 'task_updated':
			case 'task_status_changed':
			case 'task_taken':
			case 'task_undo':
				// Reload tasks to get fresh data
				tasks.load();
				break;
			case 'task_deleted':
				// Task will be removed via broadcast
				break;
			case 'new_message':
				// Handle new chat message
				break;
			case 'pong':
				// Heartbeat response
				break;
		}
	};

	const disconnect = () => {
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
		}
		if (ws) {
			ws.close();
		}
	};

	const send = (message) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		}
	};

	return {
		subscribe,
		connect,
		disconnect,
		send
	};
}

export const websocket = createWebSocketStore();

