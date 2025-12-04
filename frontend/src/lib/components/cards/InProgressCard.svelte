<script>
	export let task;
	export let daysInStage;
	export let isOverdue;
</script>

<div class="space-y-3">
	<!-- Client name (title) -->
	<h4 class="font-semibold">{task.title}</h4>

	<!-- Status label -->
	<span class="text-xs text-surface-400">В работе</span>

	<!-- Author (prominent) -->
	{#if task.author}
		<div class="flex items-center gap-3 p-2 bg-surface-600/50 rounded-lg">
			{#if task.author.avatar_url}
				<img src={task.author.avatar_url} alt="" class="w-10 h-10 rounded-full" />
			{:else}
				<div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-medium">
					{task.author.first_name[0]}{task.author.last_name[0]}
				</div>
			{/if}
			<div class="flex-1">
				<div class="font-medium">{task.author.first_name} {task.author.last_name}</div>
				<div class="text-xs text-surface-400">Автор</div>
			</div>
			{#if task.author.telegram_username}
				<a 
					href="https://t.me/{task.author.telegram_username}" 
					target="_blank"
					class="p-2 hover:bg-surface-500 rounded-full transition-colors"
					on:click|stopPropagation
				>
					<svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
						<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
					</svg>
				</a>
			{/if}
		</div>
	{/if}

	<!-- Editor and Manager (small) -->
	<div class="flex gap-2">
		{#if task.editor}
			<div class="flex items-center gap-2 flex-1 p-1.5 bg-surface-600/30 rounded">
				<div class="w-6 h-6 rounded-full bg-purple-500/50 flex items-center justify-center text-xs">
					{task.editor.first_name[0]}
				</div>
				<span class="text-xs truncate">{task.editor.first_name}</span>
			</div>
		{/if}
		{#if task.manager}
			<div class="flex items-center gap-2 flex-1 p-1.5 bg-surface-600/30 rounded">
				<div class="w-6 h-6 rounded-full bg-cyan-500/50 flex items-center justify-center text-xs">
					{task.manager.first_name[0]}
				</div>
				<span class="text-xs truncate">{task.manager.first_name}</span>
			</div>
		{/if}
	</div>

	<!-- Google Doc link -->
	{#if task.google_doc_url}
		<a
			href={task.google_doc_url}
			target="_blank"
			class="flex items-center gap-2 p-2 bg-surface-600/50 hover:bg-surface-600 rounded-lg text-sm transition-colors"
			on:click|stopPropagation
		>
			<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<span>Google Doc</span>
		</a>
	{/if}

	<!-- Time indicator -->
	<div class="flex justify-end">
		<div class="flex items-center gap-1 text-xs" class:text-red-500={isOverdue}>
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{daysInStage} дн.</span>
		</div>
	</div>
</div>

