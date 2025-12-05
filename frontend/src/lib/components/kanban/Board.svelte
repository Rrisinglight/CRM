<script>
	import { tasksByStatus, tasks } from '$lib/stores';
	import Column from './Column.svelte';
	import SearchBar from '../search/SearchBar.svelte';

	const columns = [
		{ id: 'new', label: 'Новые', color: 'bg-gray-500' },
		{ id: 'in_progress', label: 'В работе', color: 'bg-blue-500' },
		{ id: 'editor_review', label: 'На проверке редактора', color: 'bg-purple-500' },
		{ id: 'client_approval', label: 'На согласовании у клиента', color: 'bg-amber-500' },
		{ id: 'client_approved', label: 'Согласовано клиентом', color: 'bg-green-500' },
		{ id: 'sent_to_media', label: 'Отправлено в СМИ', color: 'bg-cyan-500' },
		{ id: 'published', label: 'Опубликовано', color: 'bg-emerald-500' },
		{ id: 'postponed', label: 'Отложено', color: 'bg-red-500' }
	];

	let searchFilters = {};

	function handleSearch(event) {
		searchFilters = event.detail;
		tasks.load(searchFilters);
	}
</script>

<div class="flex flex-col h-full">
	<!-- Search bar -->
	<div class="p-4 border-b border-gray-200 bg-white">
		<SearchBar on:search={handleSearch} />
	</div>

	<!-- Kanban columns -->
	<div class="flex-1 overflow-x-auto p-4">
		<div class="flex gap-4 min-w-max h-full">
			{#each columns as column}
				<Column
					{column}
					tasks={$tasksByStatus[column.id] || []}
				/>
			{/each}
		</div>
	</div>
</div>

