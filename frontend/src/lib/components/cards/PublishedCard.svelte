<script>
	export let task;
	export let daysInStage;
	export let isOverdue;

	// Format date
	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('ru-RU');
	}
</script>

<div class="space-y-3">
	<!-- Client name -->
	<h4 class="font-semibold">{task.title}</h4>

	<!-- Media with publication link -->
	{#if task.media}
		<div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
			<div class="flex items-center gap-3">
				{#if task.media.logo_url}
					<img src={task.media.logo_url} alt="" class="w-10 h-10 rounded-lg object-cover" />
				{/if}
				<div class="flex-1">
					<div class="font-medium">{task.media.name}</div>
					{#if task.publication_date}
						<div class="text-xs text-emerald-400">
							Опубликовано: {formatDate(task.publication_date)}
						</div>
					{/if}
				</div>
			</div>
			{#if task.publication_url}
				<a 
					href={task.publication_url}
					target="_blank"
					class="mt-2 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
					on:click|stopPropagation
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
					<span>Открыть публикацию</span>
				</a>
			{/if}
		</div>
	{/if}

	<!-- Participants -->
	<div class="flex flex-wrap gap-2 text-xs">
		{#if task.author}
			<div class="px-2 py-1 bg-blue-500/20 rounded">
				Автор: {task.author.first_name}
			</div>
		{/if}
		{#if task.editor}
			<div class="px-2 py-1 bg-purple-500/20 rounded">
				Редактор: {task.editor.first_name}
			</div>
		{/if}
		{#if task.manager}
			<div class="px-2 py-1 bg-cyan-500/20 rounded">
				Менеджер: {task.manager.first_name}
			</div>
		{/if}
	</div>

	<!-- Client gratitude -->
	{#if task.client_gratitude}
		<div class="p-2 bg-gray-200/50 rounded-lg italic text-sm text-gray-600">
			"{task.client_gratitude}"
		</div>
	{/if}

	<!-- Description -->
	{#if task.description}
		<p class="text-sm text-gray-500 line-clamp-2">{task.description}</p>
	{/if}

	<!-- Archive button -->
	<button
		class="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
		on:click|stopPropagation
	>
		В архив
	</button>
</div>

