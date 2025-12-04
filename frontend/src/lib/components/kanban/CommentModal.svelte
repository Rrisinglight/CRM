<script>
	import { createEventDispatcher } from 'svelte';

	export let fromStatus;
	export let toStatus;

	const dispatch = createEventDispatcher();

	let comment = '';
	let postponeReason = '';
	let postponeResumeDate = '';

	// Common comment templates
	const templates = [
		'Требуются правки',
		'Ожидание обратной связи',
		'Изменение требований',
		'Необходима дополнительная информация',
		'Клиент попросил изменения'
	];

	// Recent comments (stored in localStorage)
	let recentComments = [];
	
	// Load recent comments on mount
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('recent_comments');
		if (stored) {
			recentComments = JSON.parse(stored).slice(0, 5);
		}
	}

	function selectTemplate(template) {
		comment = template;
	}

	function selectRecent(recent) {
		comment = recent;
	}

	function submit() {
		if (!comment.trim()) return;

		// Save to recent comments
		if (typeof window !== 'undefined') {
			const newRecent = [comment, ...recentComments.filter(c => c !== comment)].slice(0, 5);
			localStorage.setItem('recent_comments', JSON.stringify(newRecent));
		}

		dispatch('submit', {
			comment,
			postponeReason: toStatus === 'postponed' ? postponeReason : null,
			postponeResumeDate: toStatus === 'postponed' ? postponeResumeDate : null
		});
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" on:click={cancel}>
	<div class="bg-surface-800 rounded-lg w-full max-w-md p-6" on:click|stopPropagation>
		<h3 class="text-lg font-semibold mb-4">Комментарий к перемещению</h3>

		<div class="space-y-4">
			<!-- Comment input -->
			<div>
				<input
					type="text"
					bind:value={comment}
					placeholder="Введите причину перемещения..."
					class="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg focus:outline-none focus:border-primary-500"
				/>
			</div>

			<!-- Postponed specific fields -->
			{#if toStatus === 'postponed'}
				<div class="space-y-3 p-3 bg-surface-700/50 rounded-lg">
					<div>
						<label class="text-sm text-surface-400 mb-1 block">Причина остановки</label>
						<input
							type="text"
							bind:value={postponeReason}
							placeholder="Почему задача отложена..."
							class="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg"
						/>
					</div>
					<div>
						<label class="text-sm text-surface-400 mb-1 block">Дата возобновления</label>
						<input
							type="date"
							bind:value={postponeResumeDate}
							class="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg"
						/>
					</div>
				</div>
			{/if}

			<!-- Templates -->
			<div>
				<p class="text-sm text-surface-400 mb-2">Шаблоны:</p>
				<div class="flex flex-wrap gap-2">
					{#each templates as template}
						<button
							type="button"
							on:click={() => selectTemplate(template)}
							class="px-2 py-1 text-sm bg-surface-700 hover:bg-surface-600 rounded transition-colors"
						>
							{template}
						</button>
					{/each}
				</div>
			</div>

			<!-- Recent comments -->
			{#if recentComments.length > 0}
				<div>
					<p class="text-sm text-surface-400 mb-2">Недавние:</p>
					<div class="flex flex-wrap gap-2">
						{#each recentComments as recent}
							<button
								type="button"
								on:click={() => selectRecent(recent)}
								class="px-2 py-1 text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded transition-colors"
							>
								{recent}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex justify-end gap-3 pt-4">
				<button
					type="button"
					on:click={cancel}
					class="px-4 py-2 text-surface-400 hover:text-white transition-colors"
				>
					Отмена
				</button>
				<button
					type="button"
					on:click={submit}
					disabled={!comment.trim()}
					class="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					Подтвердить
				</button>
			</div>
		</div>
	</div>
</div>

