<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores';

	let period = 'month';
	let comparePeriod = '';
	let loading = true;

	let summary = null;
	let stages = null;
	let publications = null;
	let roles = null;
	let calendar = null;

	const periodLabels = {
		month: 'Месяц',
		quarter: 'Квартал',
		half_year: 'Полгода',
		year: 'Год'
	};

	onMount(() => {
		loadAnalytics();
	});

	async function loadAnalytics() {
		loading = true;

		try {
			const headers = { 'Authorization': `Bearer ${$auth.token}` };
			const params = new URLSearchParams({ period });
			if (comparePeriod) params.append('compare_period', comparePeriod);

			const [summaryRes, stagesRes, pubRes, rolesRes, calendarRes] = await Promise.all([
				fetch(`/api/analytics/summary?${params}`, { headers }),
				fetch(`/api/analytics/stages?${params}`, { headers }),
				fetch(`/api/analytics/publications?${params}`, { headers }),
				fetch(`/api/analytics/roles?${params}`, { headers }),
				fetch(`/api/analytics/calendar`, { headers })
			]);

			summary = await summaryRes.json();
			stages = await stagesRes.json();
			publications = await pubRes.json();
			roles = await rolesRes.json();
			calendar = await calendarRes.json();
		} catch (e) {
			console.error('Failed to load analytics:', e);
		}

		loading = false;
	}

	function handlePeriodChange() {
		loadAnalytics();
	}

	// Simple bar chart renderer
	function getBarWidth(value, max) {
		if (!max) return 0;
		return Math.round((value / max) * 100);
	}
</script>

<svelte:head>
	<title>Аналитика | CRM</title>
</svelte:head>

<div class="p-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-2xl font-bold">Аналитика</h1>

		<!-- Period selector -->
		<div class="flex items-center gap-4">
			<select
				bind:value={period}
				on:change={handlePeriodChange}
				class="px-4 py-2 bg-surface-700 border border-surface-600 rounded-lg"
			>
				{#each Object.entries(periodLabels) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>

			<select
				bind:value={comparePeriod}
				on:change={handlePeriodChange}
				class="px-4 py-2 bg-surface-700 border border-surface-600 rounded-lg"
			>
				<option value="">Сравнить с...</option>
				{#each Object.entries(periodLabels) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
		</div>
	{:else}
		<!-- Summary Cards -->
		<div class="grid grid-cols-4 gap-4 mb-8">
			<div class="bg-surface-800 rounded-lg p-6">
				<div class="text-3xl font-bold text-blue-400">{summary?.wip || 0}</div>
				<div class="text-sm text-surface-400 mt-1">Задач в работе</div>
			</div>
			<div class="bg-surface-800 rounded-lg p-6">
				<div class="text-3xl font-bold text-red-400">{summary?.overdue || 0}</div>
				<div class="text-sm text-surface-400 mt-1">Просрочено</div>
			</div>
			<div class="bg-surface-800 rounded-lg p-6">
				<div class="text-3xl font-bold text-purple-400">{summary?.editor_review || 0}</div>
				<div class="text-sm text-surface-400 mt-1">На проверке</div>
			</div>
			<div class="bg-surface-800 rounded-lg p-6">
				<div class="text-3xl font-bold text-green-400">{summary?.published || 0}</div>
				<div class="text-sm text-surface-400 mt-1">Публикаций</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-8">
			<!-- Stages breakdown -->
			<div class="bg-surface-800 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">Задачи по этапам</h3>
				{#if stages?.stages}
					{@const maxStage = Math.max(...Object.values(stages.stages))}
					<div class="space-y-3">
						{#each Object.entries(stages.stages) as [stage, count]}
							<div>
								<div class="flex justify-between text-sm mb-1">
									<span class="capitalize">{stage.replace('_', ' ')}</span>
									<span>{count}</span>
								</div>
								<div class="h-2 bg-surface-700 rounded-full overflow-hidden">
									<div 
										class="h-full bg-primary-500 rounded-full transition-all duration-500"
										style="width: {getBarWidth(count, maxStage)}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- No delay percentage -->
			<div class="bg-surface-800 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">% без просрочек</h3>
				{#if stages?.stages_no_delay_percent}
					<div class="space-y-3">
						{#each Object.entries(stages.stages_no_delay_percent) as [stage, percent]}
							<div>
								<div class="flex justify-between text-sm mb-1">
									<span class="capitalize">{stage.replace('_', ' ')}</span>
									<span class:text-green-400={percent >= 80} class:text-amber-400={percent >= 50 && percent < 80} class:text-red-400={percent < 50}>
										{percent.toFixed(0)}%
									</span>
								</div>
								<div class="h-2 bg-surface-700 rounded-full overflow-hidden">
									<div 
										class="h-full rounded-full transition-all duration-500"
										class:bg-green-500={percent >= 80}
										class:bg-amber-500={percent >= 50 && percent < 80}
										class:bg-red-500={percent < 50}
										style="width: {percent}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Publications timeline -->
			<div class="bg-surface-800 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">Публикации за период</h3>
				{#if publications?.publications && publications.publications.length > 0}
					{@const maxPub = Math.max(...publications.publications.map(p => p.count))}
					<div class="flex items-end gap-1 h-40">
						{#each publications.publications as pub}
							<div class="flex-1 flex flex-col items-center">
								<div 
									class="w-full bg-green-500 rounded-t transition-all duration-500"
									style="height: {getBarWidth(pub.count, maxPub)}%"
									title="{pub.date}: {pub.count}"
								></div>
							</div>
						{/each}
					</div>
					<div class="flex justify-between text-xs text-surface-400 mt-2">
						<span>{publications.publications[0]?.date}</span>
						<span>{publications.publications[publications.publications.length - 1]?.date}</span>
					</div>
				{:else}
					<div class="text-surface-400 text-center py-8">Нет данных за период</div>
				{/if}
			</div>

			<!-- Roles workload -->
			<div class="bg-surface-800 rounded-lg p-6">
				<h3 class="text-lg font-semibold mb-4">Нагрузка по ролям</h3>
				<div class="space-y-4">
					<div>
						<h4 class="text-sm text-surface-400 mb-2">Авторы</h4>
						{#if roles?.authors && roles.authors.length > 0}
							{@const maxAuthor = Math.max(...roles.authors.map(a => a.total))}
							<div class="space-y-2">
								{#each roles.authors.slice(0, 5) as author}
									<div class="flex items-center gap-2">
										<div class="w-20 text-xs truncate">{author.user_id.slice(0, 8)}</div>
										<div class="flex-1 h-4 bg-surface-700 rounded-full overflow-hidden">
											<div 
												class="h-full bg-blue-500 rounded-full"
												style="width: {getBarWidth(author.total, maxAuthor)}%"
											></div>
										</div>
										<div class="w-8 text-xs text-right">{author.total}</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-surface-400 text-sm">Нет данных</div>
						{/if}
					</div>

					<div>
						<h4 class="text-sm text-surface-400 mb-2">Редакторы</h4>
						{#if roles?.editors && roles.editors.length > 0}
							{@const maxEditor = Math.max(...roles.editors.map(e => e.total))}
							<div class="space-y-2">
								{#each roles.editors.slice(0, 5) as editor}
									<div class="flex items-center gap-2">
										<div class="w-20 text-xs truncate">{editor.user_id.slice(0, 8)}</div>
										<div class="flex-1 h-4 bg-surface-700 rounded-full overflow-hidden">
											<div 
												class="h-full bg-purple-500 rounded-full"
												style="width: {getBarWidth(editor.total, maxEditor)}%"
											></div>
										</div>
										<div class="w-8 text-xs text-right">{editor.total}</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-surface-400 text-sm">Нет данных</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Calendar heatmap -->
		<div class="bg-surface-800 rounded-lg p-6 mt-8">
			<h3 class="text-lg font-semibold mb-4">Календарь публикаций (последний месяц)</h3>
			{#if calendar?.publications}
				<div class="grid grid-cols-7 gap-2">
					{#each ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as day}
						<div class="text-center text-xs text-surface-400 pb-2">{day}</div>
					{/each}
					{#each Array(35) as _, i}
						{@const date = new Date(Date.now() - (34 - i) * 24 * 60 * 60 * 1000)}
						{@const dateStr = date.toISOString().split('T')[0]}
						{@const count = calendar.publications[dateStr] || 0}
						<div 
							class="aspect-square rounded flex items-center justify-center text-xs transition-colors"
							class:bg-surface-700={count === 0}
							class:bg-green-900={count === 1}
							class:bg-green-700={count === 2}
							class:bg-green-500={count >= 3}
							title="{dateStr}: {count} публикаций"
						>
							{#if count > 0}
								{count}
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

