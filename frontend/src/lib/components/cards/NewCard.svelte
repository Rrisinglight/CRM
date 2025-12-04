<script>
	import { tasks } from '$lib/stores';
	
	export let task;
	export let daysInStage;
	export let isOverdue;

	const typeLabels = {
		article: 'Статья',
		recommendation: 'Рекомендательное',
		cover_letter: 'Сопроводительное'
	};

	const typeColors = {
		article: 'bg-blue-500/20 text-blue-400',
		recommendation: 'bg-green-500/20 text-green-400',
		cover_letter: 'bg-amber-500/20 text-amber-400'
	};

	async function handleTake() {
		await tasks.take(task.id);
	}
</script>

<div class="space-y-3">
	<!-- Client name (title) -->
	<h4 class="font-semibold text-lg">{task.title}</h4>

	<!-- Description -->
	{#if task.description}
		<p class="text-sm text-surface-300 line-clamp-2">{task.description}</p>
	{/if}

	<!-- Task type badge -->
	<span class="inline-block px-2 py-1 text-xs rounded {typeColors[task.task_type]}">
		{typeLabels[task.task_type]}
	</span>

	<!-- Media with logo -->
	{#if task.media}
		<div class="flex items-center gap-2">
			{#if task.media.logo_url}
				<img src={task.media.logo_url} alt={task.media.name} class="w-5 h-5 rounded" />
			{/if}
			<span class="text-sm text-surface-300">{task.media.name}</span>
		</div>
	{/if}

	<!-- Footer: Language + Time -->
	<div class="flex items-center justify-between pt-2 border-t border-surface-600">
		<!-- Language flag -->
		<span class="text-xs px-2 py-1 bg-surface-600 rounded">
			{task.language === 'RU' ? '🇷🇺 RU' : '🇬🇧 EN'}
		</span>

		<!-- Time in stage -->
		<div class="flex items-center gap-1 text-sm" class:time-badge={true} class:text-red-500={isOverdue}>
			<svg class="w-4 h-4" class:text-red-500={isOverdue} fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{daysInStage} дн.</span>
		</div>
	</div>

	<!-- Take button -->
	<button
		on:click|stopPropagation={handleTake}
		class="w-full py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors"
	>
		Взять в работу
	</button>
</div>

