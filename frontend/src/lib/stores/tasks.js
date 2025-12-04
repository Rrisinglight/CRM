import { writable, derived } from 'svelte/store';
import { auth } from './auth.js';
import { browser } from '$app/environment';

function createTasksStore() {
	const { subscribe, set, update } = writable([]);

	let token = null;
	auth.subscribe(state => {
		token = state.token;
	});

	const getHeaders = () => ({
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	});

	return {
		subscribe,
		load: async (filters = {}) => {
			const params = new URLSearchParams();
			Object.entries(filters).forEach(([key, value]) => {
				if (value) params.append(key, value);
			});

			const response = await fetch(`/api/tasks/?${params}`, {
				headers: getHeaders()
			});
			const tasks = await response.json();
			set(tasks);
			return tasks;
		},
		create: async (taskData) => {
			const response = await fetch('/api/tasks/', {
				method: 'POST',
				headers: getHeaders(),
				body: JSON.stringify(taskData)
			});
			const task = await response.json();
			update(tasks => [...tasks, task]);
			return task;
		},
		updateTask: async (taskId, taskData) => {
			const response = await fetch(`/api/tasks/${taskId}`, {
				method: 'PATCH',
				headers: getHeaders(),
				body: JSON.stringify(taskData)
			});
			const task = await response.json();
			update(tasks => tasks.map(t => t.id === taskId ? task : t));
			return task;
		},
		changeStatus: async (taskId, status, comment = null, extra = {}) => {
			const response = await fetch(`/api/tasks/${taskId}/status`, {
				method: 'PATCH',
				headers: getHeaders(),
				body: JSON.stringify({ status, comment, ...extra })
			});
			const task = await response.json();
			update(tasks => tasks.map(t => t.id === taskId ? task : t));
			return task;
		},
		undo: async (taskId) => {
			const response = await fetch(`/api/tasks/${taskId}/undo`, {
				method: 'POST',
				headers: getHeaders()
			});
			const task = await response.json();
			update(tasks => tasks.map(t => t.id === taskId ? task : t));
			return task;
		},
		take: async (taskId) => {
			const response = await fetch(`/api/tasks/${taskId}/take`, {
				method: 'POST',
				headers: getHeaders()
			});
			const task = await response.json();
			update(tasks => tasks.map(t => t.id === taskId ? task : t));
			return task;
		},
		delete: async (taskId) => {
			await fetch(`/api/tasks/${taskId}`, {
				method: 'DELETE',
				headers: getHeaders()
			});
			update(tasks => tasks.filter(t => t.id !== taskId));
		}
	};
}

export const tasks = createTasksStore();

// Derived store: tasks grouped by status
export const tasksByStatus = derived(tasks, ($tasks) => {
	const grouped = {
		new: [],
		in_progress: [],
		editor_review: [],
		client_approval: [],
		client_approved: [],
		sent_to_media: [],
		published: [],
		postponed: []
	};

	$tasks.forEach(task => {
		if (grouped[task.status]) {
			grouped[task.status].push(task);
		}
	});

	// Sort each group: overdue first, then by status_changed_at
	const now = new Date();
	const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

	Object.keys(grouped).forEach(status => {
		grouped[status].sort((a, b) => {
			const aOverdue = new Date(a.status_changed_at) < threeDaysAgo;
			const bOverdue = new Date(b.status_changed_at) < threeDaysAgo;

			if (aOverdue && !bOverdue) return -1;
			if (!aOverdue && bOverdue) return 1;
			return new Date(a.status_changed_at) - new Date(b.status_changed_at);
		});
	});

	return grouped;
});

