<script>
	import { onMount, afterUpdate } from 'svelte';
	import { auth } from '$lib/stores';

	export let taskId;

	let messages = [];
	let newMessage = '';
	let messagesContainer;
	let loading = false;

	onMount(async () => {
		await loadMessages();
	});

	afterUpdate(() => {
		// Scroll to bottom when new messages arrive
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	async function loadMessages() {
		loading = true;
		try {
			const response = await fetch(`/api/messages/task/${taskId}`, {
				headers: {
					'Authorization': `Bearer ${$auth.token}`
				}
			});
			messages = await response.json();
		} catch (e) {
			console.error('Failed to load messages:', e);
		}
		loading = false;
	}

	async function sendMessage() {
		if (!newMessage.trim()) return;

		try {
			const response = await fetch(`/api/messages/task/${taskId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${$auth.token}`
				},
				body: JSON.stringify({ text: newMessage })
			});

			const message = await response.json();
			messages = [...messages, message];
			newMessage = '';
		} catch (e) {
			console.error('Failed to send message:', e);
		}
	}

	function formatTime(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
	}

	function formatDate(dateStr) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('ru-RU');
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="flex flex-col h-full">
	<!-- Messages -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={messagesContainer}>
		{#if loading}
			<div class="text-center text-gray-500">Загрузка...</div>
		{:else if messages.length === 0}
			<div class="text-center text-gray-500">Нет сообщений</div>
		{:else}
			{#each messages as message, i}
				{@const prevMessage = messages[i - 1]}
				{@const showDate = !prevMessage || formatDate(message.created_at) !== formatDate(prevMessage.created_at)}
				{@const isOwn = message.user_id === $auth.user?.id}

				{#if showDate}
					<div class="text-center text-xs text-gray-500 py-2">
						{formatDate(message.created_at)}
					</div>
				{/if}

				<div class="flex gap-2" class:flex-row-reverse={isOwn}>
					<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs flex-shrink-0">
						{message.user_id?.slice(0, 2).toUpperCase()}
					</div>
					<div 
						class="max-w-[70%] px-3 py-2 rounded-lg"
						class:bg-primary-500={isOwn}
						class:bg-gray-200={!isOwn}
					>
						<p class="text-sm whitespace-pre-wrap break-words">{message.text}</p>
						<div class="text-xs mt-1 opacity-60">
							{formatTime(message.created_at)}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<!-- Input -->
	<div class="p-4 border-t border-gray-200">
		<div class="flex gap-2">
			<textarea
				bind:value={newMessage}
				on:keydown={handleKeydown}
				placeholder="Написать сообщение..."
				rows="1"
				class="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary-500"
			></textarea>
			<button
				on:click={sendMessage}
				disabled={!newMessage.trim()}
				class="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
				</svg>
			</button>
		</div>
	</div>
</div>

