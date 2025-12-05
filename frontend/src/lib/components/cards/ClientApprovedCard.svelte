<script>
	export let task;
	export let daysInStage;
	export let isOverdue;
</script>

<div class="space-y-3">
	<!-- Client name -->
	<h4 class="font-semibold">{task.title}</h4>

	<!-- Media (prominent) -->
	{#if task.media}
		<div class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
			<div class="flex items-center gap-3">
				{#if task.media.logo_url}
					<img src={task.media.logo_url} alt="" class="w-12 h-12 rounded-lg object-cover" />
				{:else}
					<div class="w-12 h-12 rounded-lg bg-green-500/30 flex items-center justify-center">
						<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
						</svg>
					</div>
				{/if}
				<div class="flex-1">
					<div class="font-medium">{task.media.name}</div>
					{#if task.media.website_url}
						<a 
							href={task.media.website_url}
							target="_blank"
							class="text-xs text-green-400 hover:text-green-300"
							on:click|stopPropagation
						>
							{task.media.website_url}
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Author -->
	{#if task.author}
		<div class="flex items-center gap-2 text-sm">
			<span class="text-gray-500">Автор:</span>
			<span>{task.author.first_name} {task.author.last_name}</span>
			{#if task.author.telegram_username}
				<a 
					href="https://t.me/{task.author.telegram_username}" 
					target="_blank"
					class="text-blue-400 hover:text-blue-300 text-xs"
					on:click|stopPropagation
				>
					TG
				</a>
			{/if}
		</div>
	{/if}

	<!-- Google Doc -->
	{#if task.google_doc_url}
		<a
			href={task.google_doc_url}
			target="_blank"
			class="flex items-center gap-2 p-2 bg-gray-200/50 hover:bg-gray-200 rounded-lg text-sm transition-colors"
			on:click|stopPropagation
		>
			<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<span>Финальная версия</span>
		</a>
	{/if}

	<!-- Time -->
	<div class="flex justify-end">
		<div class="flex items-center gap-1 text-xs" class:text-red-500={isOverdue}>
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{daysInStage} дн.</span>
		</div>
	</div>
</div>

