<script>
	import { beforeUpdate, afterUpdate } from 'svelte';
	import {fade} from 'svelte/transition'


	let cx = 0
	let cy = 0
	let r = 10	
	let strokeWidth = 0
	export let handler
	export let obj
	let color = 'red';
	
	beforeUpdate(() => {
		color = getColor();
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
	
	function getColor(){
		if(obj.color==1){
			return "red";
		}
		else if(obj.color==2){
			return "green";
		}
		else if(obj.color==3){
			return 'darkorange';
		}
		else if(obj.color==4){
			return 'brown';
		}
		else if(obj.color==5){
			return 'purple';
		}
	}
</script>
{#if !obj.deleted}
	{#if obj.selected}
		<rect x={cx-(r+2)} y={cy-(r+2)} width={(r+2)*2} height={(r+2)*2} fill="grey" transition:fade></rect>
	{/if}	
	<circle transition:fade cx={cx} cy={cy} r={r} stroke="black" stroke-width={strokeWidth} fill="{color}" on:click={handler(obj)}/>
{/if}
