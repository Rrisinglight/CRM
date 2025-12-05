<script>
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let inputValue = '';
	let tokens = [];
	let suggestions = [];
	let showSuggestions = false;
	let activeOperator = null;

	// Mock data for suggestions (will be replaced with API calls)
	const mockUsers = [
		{ id: '1', name: 'Иван Петров', type: 'user' },
		{ id: '2', name: 'Мария Сидорова', type: 'user' },
		{ id: '3', name: 'Алексей Козлов', type: 'user' },
	];

	const mockMedia = [
		{ id: '1', name: 'Forbes', type: 'media' },
		{ id: '2', name: 'РБК', type: 'media' },
		{ id: '3', name: 'Коммерсант', type: 'media' },
	];

	const operators = {
		'@': { type: 'user', label: 'Сотрудник', data: mockUsers },
		'#': { type: 'media', label: 'СМИ', data: mockMedia },
		'автор:': { type: 'author', label: 'Автор', data: mockUsers },
		'редактор:': { type: 'editor', label: 'Редактор', data: mockUsers },
		'менеджер:': { type: 'manager', label: 'Менеджер', data: mockUsers },
		'клиент:': { type: 'client', label: 'Клиент', data: [] },
	};

	function handleInput(e) {
		const value = e.target.value;
		inputValue = value;

		// Check for operators
		for (const [op, config] of Object.entries(operators)) {
			if (value.endsWith(op)) {
				activeOperator = { op, ...config };
				suggestions = config.data;
				showSuggestions = true;
				return;
			}
		}

		// Filter suggestions if we have an active operator
		if (activeOperator) {
			const searchPart = value.split(activeOperator.op).pop().toLowerCase();
			suggestions = activeOperator.data.filter(item =>
				item.name.toLowerCase().includes(searchPart)
			);
			showSuggestions = suggestions.length > 0;
		} else {
			showSuggestions = false;
		}
	}

	function selectSuggestion(item) {
		// Create token
		let tokenValue;
		if (activeOperator.op === '@' || activeOperator.op === '#') {
			tokenValue = `${activeOperator.op}${item.name}`;
		} else {
			tokenValue = `${activeOperator.op}${item.name}`;
		}

		tokens = [...tokens, {
			type: activeOperator.type,
			value: tokenValue,
			id: item.id,
			displayName: item.name
		}];

		// Clear input after operator
		inputValue = inputValue.substring(0, inputValue.lastIndexOf(activeOperator.op));
		activeOperator = null;
		showSuggestions = false;

		emitSearch();
	}

	function removeToken(index) {
		tokens = tokens.filter((_, i) => i !== index);
		emitSearch();
	}

	function handleKeydown(e) {
		if (e.key === 'Backspace' && inputValue === '' && tokens.length > 0) {
			tokens = tokens.slice(0, -1);
			emitSearch();
		} else if (e.key === 'Escape') {
			inputValue = '';
			tokens = [];
			showSuggestions = false;
			activeOperator = null;
			emitSearch();
		} else if (e.key === 'Enter' && showSuggestions && suggestions.length > 0) {
			selectSuggestion(suggestions[0]);
		}
	}

	function emitSearch() {
		const filters = {};

		// Convert tokens to API filters
		tokens.forEach(token => {
			switch (token.type) {
				case 'user':
					// Generic user filter
					break;
				case 'author':
					filters.author_id = token.id;
					break;
				case 'editor':
					filters.editor_id = token.id;
					break;
				case 'manager':
					filters.manager_id = token.id;
					break;
				case 'client':
					filters.client_id = token.id;
					break;
				case 'media':
					filters.media_id = token.id;
					break;
			}
		});

		// Add free text search
		if (inputValue.trim()) {
			filters.search = inputValue.trim();
		}

		dispatch('search', filters);
	}

	function clearAll() {
		inputValue = '';
		tokens = [];
		showSuggestions = false;
		activeOperator = null;
		emitSearch();
	}
</script>

<div class="relative">
	<div class="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-sm">
		<!-- Search icon -->
		<svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>

		<!-- Tokens -->
		<div class="flex items-center gap-2 flex-wrap flex-1">
			{#each tokens as token, index}
				<span class="search-token {token.type}">
					{token.value}
					<button
						type="button"
						on:click={() => removeToken(index)}
						class="ml-1 hover:text-gray-800"
					>
						×
					</button>
				</span>
			{/each}

			<!-- Input -->
			<input
				type="text"
				bind:value={inputValue}
				on:input={handleInput}
				on:keydown={handleKeydown}
				on:blur={() => setTimeout(() => showSuggestions = false, 200)}
				placeholder={tokens.length === 0 ? 'Поиск... (@сотрудник, #СМИ, автор:, редактор:)' : ''}
				class="flex-1 min-w-[200px] bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
			/>
		</div>

		<!-- Clear button -->
		{#if tokens.length > 0 || inputValue}
			<button
				type="button"
				on:click={clearAll}
				class="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	<!-- Suggestions dropdown -->
	{#if showSuggestions && suggestions.length > 0}
		<div class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
			<div class="px-3 py-2 text-xs text-gray-500 border-b border-gray-200">
				{activeOperator?.label || 'Подсказки'}
			</div>
			{#each suggestions as item}
				<button
					type="button"
					on:click={() => selectSuggestion(item)}
					class="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-700"
				>
					{#if item.type === 'user'}
						<div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
							{item.name[0]}
						</div>
					{:else if item.type === 'media'}
						<div class="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center text-xs">
							#
						</div>
					{/if}
					<span class="text-sm">{item.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

