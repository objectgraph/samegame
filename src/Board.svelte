<script>
	import Sphere from './Sphere.svelte'
	import Game from './Game.js'
	import GameStats from './GameStats.svelte'
	import { crossfade, fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let rows = 10;
	let cols = 10;
	let numColors = 5;
	$: game = new Game(rows, cols, numColors);
	const options = {duration: 500};

	function handleClick(obj) {
		game.action(obj)
		game = game; // trigger reactivity
	}

	function handleNewGame() {
		game.newGame();
		game = game; // trigger reactivity
	}
	
	function handleUndo() {
		game.undo();
		game = game; // trigger reactivity
	}
	
	function handleRedo() {
		game.redo();
		game = game; // trigger reactivity
	}
</script>

<style>
	svg {
		border: 1px solid grey;
		border-radius: 5px;
	}
	#scores {
		display: flex;
		justify-content: space-around;
		margin: 5px;
	}
	#controls {
		display: flex;
		justify-content: space-around;
		margin: 5px;
	}
	
	.ctr {
		display: grid;
		place-items: center;
	}
	.noselect {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>

<div>
	<div id="setup">
		Rows: <input type="range" min="2" max="10" bind:value={rows}>
		Cols: <input type="range" min="2" max="10" bind:value={cols}>
		Colors: <input type="range" min="2" max="5" bind:value={numColors}>
	</div>
	<div id="scores">
		<span>Score: {game.score}</span>
		<span>Selection: {game.currentSelection}</span>
		<span>Game Over: {game.gameOver}</span>
	</div>
	<div id="gamestats" class="ctr">
		<GameStats data={game.data}/>
	</div>
	<div class="ctr noselect">
		<svg width={cols*40} height={rows*40}>
			{#each game.data as row, i}
				{#each row as cell, j (cell.id)}
					<g transform="translate({cell.col * 40}, {cell.row * 40})">
						<Sphere {cell} handler={handleClick}/>
					</g>
				{/each}
			{/each}
		</svg>
	</div>
	<div id="controls">
		<button on:click={handleNewGame}>New Game</button>
		<button on:click={handleUndo}>Undo</button>
		<button on:click={handleRedo}>Redo</button>
	</div>
</div>