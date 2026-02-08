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

		<article class="seo-section">
			<div class="seo-container">
				<h1>Wordle+ Infinite: Play Unlimited Word Games Online</h1>
				
				<p>Welcome to <strong>Wordle+</strong>, the ultimate destination for fans of the viral word-guessing phenomenon. While the original game offers only one challenge per day, our version provides an <strong>Infinite Wordle</strong> mode, allowing you to sharpen your vocabulary skills without any limits.</p>

				<h2>How to Play Wordle Infinite</h2>
				<p>The rules of Wordle+ are simple yet addictive. Your goal is to guess a hidden five-letter word in six attempts or less. Each time you make a guess, the tiles will change color to provide clues:</p>
				<ul>
					<li><strong>Green:</strong> The letter is correct and in the right position.</li>
					<li><strong>Yellow:</strong> The letter is in the word but in the wrong spot.</li>
					<li><strong>Gray:</strong> The letter is not in the word at all.</li>
				</ul>

				<h2>Why Choose Wordle+?</h2>
				<p>Our platform is designed for enthusiasts who can't get enough of daily puzzles. Here is what makes Wordle+ special:</p>
				<ol>
					<li><strong>Unlimited Gameplay:</strong> No more waiting 24 hours. Play as many games as you want in our Infinite Mode.</li>
					<li><strong>Hourly Challenges:</strong> If Daily is too slow and Infinite is too fast, try our Hourly mode for a fresh challenge every 60 minutes.</li>
					<li><strong>Dark & Light Modes:</strong> Play comfortably at any time of day with our customizable themes, including a colorblind-friendly mode.</li>
					<li><strong>Statistics Tracking:</strong> Keep an eye on your win percentage, current streak, and guess distribution to see how you improve over time.</li>
				</ol>

				<h2>Tips and Strategies for Success</h2>
				<p>To master Wordle+, start with a word that contains many vowels and common consonants like "ARISE," "CRANE," or "ADIEU." Avoid repeating letters in your first two guesses to eliminate as many possibilities as quickly as possible. Remember, sometimes the hidden word might have duplicate letters (like "ROBOT" or "SWEET")!</p>

				<h2>Perfect for Brain Training</h2>
				<p>Word games like Wordle+ are more than just fun; they are a great way to improve cognitive function, expand your vocabulary, and keep your mind sharp. Whether you are a linguistic expert or just looking for a quick mental break, Wordle+ offers the perfect balance of challenge and relaxation.</p>
				
				<p class="footer-note">Start your Wordle+ journey today and see how many streaks you can maintain. Happy guessing!</p>
			</div>
		</article>
	</main>
{/if}

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* Scrolling smoothly handle karne ke liye */
		overflow-x: hidden;
	}

	.game-wrapper {
		/* IMPORTANT: Isse game chhota nahi hoga */
		height: 100vh; 
		width: 100%;
		flex-shrink: 0; /* Isse content game ko squeeze nahi karega */
		
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		/* Agar mobile par keyboard overlap ho to ise use karein */
		position: relative; 
	}

	.seo-section {
		background-color: var(--bg-secondary);
		color: var(--fg-primary);
		padding: 60px 20px;
		border-top: 1px solid var(--border-primary);
		
		/* SEO readability ke liye */
		user-select: text;
		-webkit-user-select: text;
		flex-shrink: 0;
	}

	.seo-container {
		max-width: 800px;
		margin: 0 auto;
		line-height: 1.7;
	}

	/* ... baki SEO headings ki styling same rahegi ... */
	.seo-container h1 { font-size: 2.5rem; margin-bottom: 20px; color: var(--color-correct); text-align: center; }
	.seo-container h2 { font-size: 1.8rem; margin-top: 40px; margin-bottom: 15px; border-left: 5px solid var(--color-present); padding-left: 15px; }
	.seo-container p { margin-bottom: 20px; font-size: 1.1rem; opacity: 0.9; }
</style>
