<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getColor } from './Common.svelte';

	export let cell;
	export let handler;
	
	$: color = getColor(cell.color);
	$: strokeWidth = cell.selected ? 2 : 0;

	function handleKeyDown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			handler(cell);
		}
	}
</script>

{#if !cell.deleted}
	{#if cell.selected}
		<rect x={0} y={0} width={40} height={40} fill="grey"/>
	{/if}	
	<circle 
		cx={20} 
		cy={20} 
		r={18} 
		stroke="black" 
		stroke-width={strokeWidth} 
		fill={color}
	/>
	<rect 
		x={0} 
		y={0} 
		width={40} 
		height={40} 
		pointer-events="visible" 
		fill="none" 
		on:click={() => handler(cell)}
		on:keydown={handleKeyDown}
		role="button"
		tabindex="0"
		aria-label="Select sphere"
	/>
{/if}