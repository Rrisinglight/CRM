<script>
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { tasks as tasksStore } from '$lib/stores';
	import TaskCard from './TaskCard.svelte';
	import CommentModal from './CommentModal.svelte';

	export let column;
	export let tasks = [];

	const flipDurationMs = 200;
	let showCommentModal = false;
	let pendingMove = null;

	// Pipeline order for determining if move is forward
	const pipelineOrder = [
		'new', 'in_progress', 'editor_review', 'client_approval',
		'client_approved', 'sent_to_media', 'published'
	];

	function isForwardMove(fromStatus, toStatus) {
		if (fromStatus === 'postponed' || toStatus === 'postponed') return false;
		const fromIdx = pipelineOrder.indexOf(fromStatus);
		const toIdx = pipelineOrder.indexOf(toStatus);
		return toIdx === fromIdx + 1;
	}

	function handleDndConsider(e) {
		tasks = e.detail.items;
	}

	async function handleDndFinalize(e) {
		const movedTask = e.detail.items.find(t => !tasks.find(existing => existing.id === t.id));
		
		if (movedTask && movedTask.status !== column.id) {
			const isForward = isForwardMove(movedTask.status, column.id);
			
			if (!isForward) {
				// Need comment for backward/lateral moves
				pendingMove = {
					taskId: movedTask.id,
					fromStatus: movedTask.status,
					toStatus: column.id
				};
				showCommentModal = true;
			} else {
				// Forward move - no comment needed
				try {
					await tasksStore.changeStatus(movedTask.id, column.id);
				} catch (err) {
					console.error('Failed to change status:', err);
					alert(err.message || 'Ошибка изменения статуса');
					// Reload to restore correct positions
					tasksStore.load();
					return;
				}
			}
		}
		
		tasks = e.detail.items;
	}

	async function handleCommentSubmit(event) {
		const { comment, postponeReason, postponeResumeDate } = event.detail;
		
		if (pendingMove) {
			try {
				await tasksStore.changeStatus(
					pendingMove.taskId, 
					pendingMove.toStatus, 
					comment,
					{
						postpone_reason: postponeReason,
						postpone_resume_date: postponeResumeDate
					}
				);
			} catch (err) {
				console.error('Failed to change status:', err);
				alert(err.message || 'Ошибка изменения статуса');
				// Reload to restore correct positions
				tasksStore.load();
			}
		}
		
		showCommentModal = false;
		pendingMove = null;
	}

	function handleCommentCancel() {
		// Reload tasks to restore original positions
		tasksStore.load();
		showCommentModal = false;
		pendingMove = null;
	}
</script>

<div class="kanban-column w-80 flex-shrink-0">
	<div class="kanban-column-header">
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded-full {column.color}"></div>
			<span>{column.label}</span>
		</div>
		<span class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
			{tasks.length}
		</span>
	</div>

	<div
		class="kanban-column-content"
		use:dndzone={{
			items: tasks,
			flipDurationMs,
			dropTargetStyle: { outline: '2px dashed rgba(59,130,246,0.5)' }
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each tasks as task (task.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<TaskCard {task} stage={column.id} />
			</div>
		{/each}
	</div>
</div>

{#if showCommentModal}
	<CommentModal
		fromStatus={pendingMove?.fromStatus}
		toStatus={pendingMove?.toStatus}
		on:submit={handleCommentSubmit}
		on:cancel={handleCommentCancel}
	/>
{/if}

