<script context="module" lang="ts">
	import {
		modeData,
		seededRandomInt,
		Stats,
		GameState,
		Settings,
		LetterStates,
		getWordNumber,
		words,
	} from "./utils";
	import Game from "./components/Game.svelte";
	import { letterStates, settings, mode } from "./stores";
	import { GameMode } from "./enums";
	import { Toaster } from "./components/widgets";
	import { setContext } from "svelte";
    
    // SEO Component Import
    import SeoContent from "./components/SeoContent.svelte";

	document.title = "Wordle+ | An infinite word guessing game";
</script>

<script lang="ts">
	export let version: string;
	setContext("version", version);
	localStorage.setItem("version", version);
	let stats: Stats;
	let word: string;
	let state: GameState;
	let toaster: Toaster;

	settings.set(new Settings(localStorage.getItem("settings")));
	settings.subscribe((s) => localStorage.setItem("settings", JSON.stringify(s)));

	const hash = window.location.hash.slice(1).split("/");
	const modeVal: GameMode = !isNaN(GameMode[hash[0]])
		? GameMode[hash[0]]
		: +localStorage.getItem("mode") || modeData.default;
	mode.set(modeVal);
	
	if (!isNaN(+hash[1]) && +hash[1] < getWordNumber(modeVal)) {
		modeData.modes[modeVal].seed =
			(+hash[1] - 1) * modeData.modes[modeVal].unit + modeData.modes[modeVal].start;
		modeData.modes[modeVal].historical = true;
	}
	mode.subscribe((m) => {
		localStorage.setItem("mode", `${m}`);
		window.location.hash = GameMode[m];
		stats = new Stats(localStorage.getItem(`stats-${m}`) || m);
		word = words.words[seededRandomInt(0, words.words.length, modeData.modes[m].seed)];
		if (modeData.modes[m].historical) {
			state = new GameState(m, localStorage.getItem(`state-${m}-h`));
		} else {
			state = new GameState(m, localStorage.getItem(`state-${m}`));
		}
		letterStates.set(new LetterStates(state.board));
	});

	$: saveState(state);
	function saveState(state: GameState) {
		if (modeData.modes[$mode].historical) {
			localStorage.setItem(`state-${$mode}-h`, state.toString());
		} else {
			localStorage.setItem(`state-${$mode}`, state.toString());
		}
	}
</script>

<Toaster bind:this={toaster} />

{#if toaster}
	<main class="app-container">
		<div class="game-wrapper">
			<Game {stats} bind:word {toaster} bind:game={state} />
		</div>

		<SeoContent />
	</main>
{/if}

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		min-height: 100vh;
		/* Root level scroll handle */
		overflow-y: auto;
		overflow-x: hidden;
	}

	.game-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-shrink: 0;
	}
</style>
