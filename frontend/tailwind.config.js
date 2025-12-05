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
				// Primary colors using CSS variables
				primary: {
					50: 'rgb(var(--color-primary-50) / <alpha-value>)',
					100: 'rgb(var(--color-primary-100) / <alpha-value>)',
					200: 'rgb(var(--color-primary-200) / <alpha-value>)',
					300: 'rgb(var(--color-primary-300) / <alpha-value>)',
					400: 'rgb(var(--color-primary-400) / <alpha-value>)',
					500: 'rgb(var(--color-primary-500) / <alpha-value>)',
					600: 'rgb(var(--color-primary-600) / <alpha-value>)',
					700: 'rgb(var(--color-primary-700) / <alpha-value>)',
					800: 'rgb(var(--color-primary-800) / <alpha-value>)',
					900: 'rgb(var(--color-primary-900) / <alpha-value>)',
				},
				// Surface colors using CSS variables
				surface: {
					50: 'rgb(var(--color-surface-50) / <alpha-value>)',
					100: 'rgb(var(--color-surface-100) / <alpha-value>)',
					200: 'rgb(var(--color-surface-200) / <alpha-value>)',
					300: 'rgb(var(--color-surface-300) / <alpha-value>)',
					400: 'rgb(var(--color-surface-400) / <alpha-value>)',
					500: 'rgb(var(--color-surface-500) / <alpha-value>)',
					600: 'rgb(var(--color-surface-600) / <alpha-value>)',
					700: 'rgb(var(--color-surface-700) / <alpha-value>)',
					800: 'rgb(var(--color-surface-800) / <alpha-value>)',
					900: 'rgb(var(--color-surface-900) / <alpha-value>)',
				},
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

