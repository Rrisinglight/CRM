import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				// Task type colors
				'task-article': '#3b82f6',
				'task-recommendation': '#22c55e',
				'task-cover': '#f59e0b',
				// Status colors
				'status-new': '#6b7280',
				'status-progress': '#3b82f6',
				'status-review': '#8b5cf6',
				'status-approval': '#f59e0b',
				'status-approved': '#22c55e',
				'status-sent': '#06b6d4',
				'status-published': '#10b981',
				'status-postponed': '#ef4444',
			}
		}
	},
	plugins: [
		skeleton({
			themes: {
				preset: ['skeleton']
			}
		})
	]
};

