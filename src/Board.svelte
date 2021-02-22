<script>
	import Sphere from './Sphere.svelte'
	import Game from './Game.js'
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	
	const rows = 12;
	const cols = 12;
	const game = new Game(rows,cols);
	const options = {duration:500};


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
		<g transition:fly={options} >
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