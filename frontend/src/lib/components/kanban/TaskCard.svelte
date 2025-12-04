<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { tasks } from '$lib/stores';
	import NewCard from '../cards/NewCard.svelte';
	import InProgressCard from '../cards/InProgressCard.svelte';
	import EditorReviewCard from '../cards/EditorReviewCard.svelte';
	import ClientApprovalCard from '../cards/ClientApprovalCard.svelte';
	import ClientApprovedCard from '../cards/ClientApprovedCard.svelte';
	import SentToMediaCard from '../cards/SentToMediaCard.svelte';
	import PublishedCard from '../cards/PublishedCard.svelte';
	import PostponedCard from '../cards/PostponedCard.svelte';

	export let task;
	export let stage;

	const dispatch = createEventDispatcher();

	// Stage-specific card components
	const stageComponents = {
		new: NewCard,
		in_progress: InProgressCard,
		editor_review: EditorReviewCard,
		client_approval: ClientApprovalCard,
		client_approved: ClientApprovedCard,
		sent_to_media: SentToMediaCard,
		published: PublishedCard,
		postponed: PostponedCard
	};

	// Calculate days in current stage
	$: daysInStage = Math.floor(
		(Date.now() - new Date(task.status_changed_at).getTime()) / (1000 * 60 * 60 * 24)
	);
	$: isOverdue = daysInStage > 3;

	// Task type colors
	const typeColors = {
		article: 'bg-task-article',
		recommendation: 'bg-task-recommendation',
		cover_letter: 'bg-task-cover'
	};

	// Recently moved state (20 second undo window)
	let justMoved = false;
	let undoTimeout = null;

	onMount(() => {
		// Check if this task was just moved (within last 20 seconds)
		const lastMoved = sessionStorage.getItem(`task_moved_${task.id}`);
		if (lastMoved) {
			const movedAt = parseInt(lastMoved);
			const elapsed = Date.now() - movedAt;
			if (elapsed < 20000) {
				justMoved = true;
				undoTimeout = setTimeout(() => {
					justMoved = false;
					sessionStorage.removeItem(`task_moved_${task.id}`);
				}, 20000 - elapsed);
			} else {
				sessionStorage.removeItem(`task_moved_${task.id}`);
			}
		}
	});

	onDestroy(() => {
		if (undoTimeout) clearTimeout(undoTimeout);
	});

	async function handleUndo() {
		try {
			await tasks.undo(task.id);
			justMoved = false;
			sessionStorage.removeItem(`task_moved_${task.id}`);
		} catch (e) {
			console.error('Undo failed:', e);
		}
	}

	function openTaskDetail() {
		dispatch('open', { task });
	}
</script>

<div
	class="task-card bg-surface-700 rounded-lg overflow-hidden cursor-pointer relative"
	class:just-moved={justMoved}
	class:overdue={isOverdue}
	on:click={openTaskDetail}
	on:keypress={openTaskDetail}
	role="button"
	tabindex="0"
>
	<!-- Task type color bar -->
	<div class="h-1 {typeColors[task.task_type] || 'bg-gray-500'}"></div>

	<!-- Card content based on stage -->
	<div class="p-3">
		<svelte:component
			this={stageComponents[stage]}
			{task}
			{daysInStage}
			{isOverdue}
		/>
	</div>

	<!-- Undo button (visible for 20 seconds after move) -->
	{#if justMoved}
		<button
			class="absolute top-2 right-2 p-1.5 bg-surface-600 hover:bg-surface-500 rounded-full transition-colors"
			on:click|stopPropagation={handleUndo}
			title="Отменить перемещение"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
			</svg>
		</button>
	{/if}

	<!-- Iteration badge -->
	{#if task.iteration > 0}
		<div class="absolute bottom-2 right-2 text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
			{task.iteration}
		</div>
	{/if}
</div>

