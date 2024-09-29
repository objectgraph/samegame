<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	import {fade} from 'svelte/transition'
	import {getColor} from './Common.svelte'

	let cx = 0
	let cy = 0
	let r = 10	
	let strokeWidth = 0
	export let handler
	export let obj
	let color = 'red';
	
	beforeUpdate(() => {
		color = getColor(obj.color);
		cx=obj.col*40+20 
		cy=obj.row*40+20 
		r=18
		if(obj.selected){
			strokeWidth = 2;
		}
		else{
			strokeWidth = 0;
		}
	});

	function handleKeyDown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			handler(obj);
		}
	}
</script>

{#if !obj.deleted}
	{#if obj.selected}
		<rect x={cx-(r+2)} y={cy-(r+2)} width={(r+2)*2} height={(r+2)*2} fill="grey"></rect>
	{/if}	
	<circle cx={cx} cy={cy} r={r} stroke="black" stroke-width={strokeWidth} fill="{color}"/>
	<rect 
		x={cx-(r+2)} 
		y={cy-(r+2)} 
		width={(r+2)*2} 
		height={(r+2)*2} 
		pointer-events="visible" 
		fill="none" 
		on:click={() => handler(obj)}
		on:keydown={handleKeyDown}
		role="button"
		tabindex="0"
		aria-label="Select sphere"
	/>
{/if}