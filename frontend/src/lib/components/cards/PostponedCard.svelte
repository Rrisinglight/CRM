<script>
	import { tasks } from '$lib/stores';

	export let task;
	export let daysInStage;
	export let isOverdue;

	function formatDate(dateStr) {
		if (!dateStr) return '';
		return new Date(dateStr).toLocaleDateString('ru-RU');
	}

	// Check if resume date is approaching (within 3 days)
	$: resumeApproaching = task.postpone_resume_date && 
		(new Date(task.postpone_resume_date).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000 &&
		new Date(task.postpone_resume_date) > new Date();

	async function returnToWork() {
		await tasks.changeStatus(task.id, 'new', 'Возврат из отложенных');
	}
</script>

<div class="space-y-3">
	<!-- Client name -->
	<h4 class="font-semibold">{task.title}</h4>

	<!-- Postpone reason -->
	{#if task.postpone_reason}
		<div class="p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
			<div class="text-xs text-red-400 mb-1">Причина остановки:</div>
			<p class="text-sm">{task.postpone_reason}</p>
		</div>
	{/if}

	<!-- Resume date -->
	{#if task.postpone_resume_date}
		<div class="flex items-center justify-between p-2 rounded-lg" class:bg-amber-500/10={resumeApproaching} class:bg-surface-600/50={!resumeApproaching}>
			<div>
				<div class="text-xs text-surface-400">Дата возобновления:</div>
				<div class="font-medium" class:text-amber-400={resumeApproaching}>
					{formatDate(task.postpone_resume_date)}
				</div>
			</div>
			{#if resumeApproaching}
				<div class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
			{/if}
		</div>
	{/if}

	<!-- Responsible person -->
	{#if task.manager}
		<div class="flex items-center gap-2 text-sm">
			<span class="text-surface-400">Ответственный:</span>
			<span>{task.manager.first_name} {task.manager.last_name}</span>
		</div>
	{:else if task.author}
		<div class="flex items-center gap-2 text-sm">
			<span class="text-surface-400">Ответственный:</span>
			<span>{task.author.first_name} {task.author.last_name}</span>
		</div>
	{/if}

	<!-- Time postponed -->
	<div class="flex justify-end">
		<div class="flex items-center gap-1 text-xs text-surface-400">
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>Отложено {daysInStage} дн.</span>
		</div>
	</div>

	<!-- Return to work button -->
	<button
		on:click|stopPropagation={returnToWork}
		class="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
	>
		Вернуть в работу
	</button>
</div>

