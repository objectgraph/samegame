<script>
	import Sphere from './Sphere.svelte'
	import Game from './Game.js'
	import GameStats from './GameStats.svelte'
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	
	let rows = 10;
	let cols = 10;
	let numColors = 5;
	$:  game = new Game(rows,cols,numColors);
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
	.noselect {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
			-ms-user-select: none; /* Internet Explorer/Edge */
				user-select: none; /* Non-prefixed version, currently
									supported by Chrome, Edge, Opera and Firefox */
	}
</style>
<div>
	<div id="setup">
		Rows: <input type="text" bind:value={rows}>
		Cols: <input type="text" bind:value={cols}>
		Colors: <input type="text" bind:value={numColors}>

	</div>
	<div id="scores">
		<span>Score: {game.score}</span>
		<span>Selection: {game.currentSelection}</span>
		<span>Game Over:{game.gameOver}</span>
	</div>
	<div id="gamestats">
		<GameStats data={game.data}/>
	</div>
	<div class="noselect">
	<svg width={cols*40} height={rows*40}>
	{#each game.data as row,i}
		{#each game.data[i] as cell,j (cell.id)}
		<g transition:fly={options} >
			<Sphere obj={cell} handler={handleClick}/>
			</g>
		{/each}
	{/each}
	</svg>
	</div>
	<div id="controls">
		<button on:click={handleNewGame}>New Game
		</button>
		<button on:click={handleUndo}>Undo
		</button>
		<button on:click={handleRedo}>Redo
		</button>
	</div>
</div>