<script>
	import Sphere from './Sphere.svelte'
	import Game from './Game.js'
	import {flip} from 'svelte/animate'
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	const rows = 12;
	const cols = 12;
	const game = new Game(rows,cols);
	const options = {};

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	function handleClick(obj){
		game.action(obj)
		game.data = game.data //make it reactive
	}

	function handleNewGame(){
		game.newGame();
		game.data = game.data //make it reactive
	}
	
	function handleUndo(){
		game.undo();
		game.data = game.data
	}
	
	function handleRedo(){
		game.redo();
		game.data = game.data
	}
	
	function debug(){
		console.log(game.data)
	}
</script>

<style>
	svg{
		border:1px solid grey
	}
	#scores{
		display:flex;
		justify-content:space-around;
		margin:5px;
	}
	#controls{
		display:flex;
		justify-content:space-around;
		margin:5px;
	}
</style>
<div>
	<div id="scores">
		<span>Score: {game.score}</span>
		<span>Selection: {game.currentSelection}</span>
		<span>Game Over:{game.gameOver}</span>
	</div>
	
	<svg width={cols*40} height={rows*40}>
	{#each game.data as row,i}
		{#each game.data[i] as cell,j (cell.id)}
		<g in:receive="{{key: cell.id}}"
		out:send="{{key: cell.id}}"
			animate:flip={options}  >
						<Sphere obj={cell} handler={handleClick}/>
			</g>
		{/each}
	{/each}
	</svg>
	<div id="controls">
		<button on:click={handleNewGame}>New Game
		</button>
		<button on:click={handleUndo}>Undo
		</button>
		<button on:click={handleRedo}>Redo
		</button>
	</div>
</div>