<script>

import smears from '$lib/assets/smears.svg'

const slots = [
	["#ff0", "#0f0", "#f00", "#f0f", "#0ff", "#00f"],
	["#fa0", "#af0", "#f0a", "#a0f", "#0fa", "#0af"],
	["#a40", "#4a0", "#faf", "#a8f", "#0aa", "#048"],
]

let currentSlot = $state(0)
let slotValues = $state(slots.map(_ => null))

let attempts = $state(0)

function stop() {
	if (currentSlot == slots.length) {
		currentSlot = 0
		attempts++;
	} else {
		const bag = slots[currentSlot]
		slotValues[currentSlot] = bag[Math.floor(Math.random() * bag.length)]
		currentSlot++
	}
}

$effect(() => {
	const onSpace = e => (e.code == "Space" && stop())
	document.addEventListener("keypress", onSpace)
	return () => {
		document.removeEventListener("keypress", onSpace)
	}
})

</script>

<svelte:head>
	<link rel="preload" as="image" href={smears}>
	<link rel="preload" as="image" href={smears + '#smear1'}>
	<link rel="preload" as="image" href={smears + '#smear2'}>
	<link rel="preload" as="image" href={smears + '#smear3'}>
</svelte:head>
<!--
<div>
{#each slots as colors}
	<p>
	{#each colors as color}

	{/each}
	</p>
{/each}
</div>-->

<div class="slot-machine">
	{#each slotValues as slot, i}
		{#if currentSlot > i}
			<div stop class="slot">
				<span class="color" style={"--c: " + slot}>
				</span>
			</div>
		{:else}
			<div class="slot"></div>
		{/if}
	{/each}
	<!--<p class="waring">
		Advertenica: No pueden ganar.
		{attempts > 3 ? "Posta, literalmente no les va a tocar dos veces el mismo color." : ""}
		{attempts > 6 ? "¡baastaa! :(" : ""}
	</p>-->
</div>

<style>

.slot-machine {
	display: flex;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(to bottom, #bbb, #fff, #bbb);
	align-items: center;
	justify-content: center;
	gap: 2rem;
}

.color {
	display: inline-block;
	width: 60%;
	height: 60%;
	border: 1vh solid black;
	border-radius: 100%;
	background-color: var(--c);
	box-shadow: 0 1vh 20vh var(--c);
}

@keyframes fast {
	0% {
		--smear: url("$lib/assets/smears.svg#smear1");
	}
	17% {
		--smear: url("$lib/assets/smears.svg#smear2");
	}
	33% {
		--smear: url("");
	}
	50% {
		--smear: url("$lib/assets/smears.svg#smear3");
	}
	66% {
		--smear: url("$lib/assets/smears.svg#smear1");
	}
	83% {
		--smear: url("");
	}
}

@keyframes misalign {
	0% {
		background-position-y: -5px;
	}
	25% {
		background-position-y: 5px;
	}
	50% {
		background-position-y: -2px;
	}
	75% {
		background-position-y: 2px;
	}
}

@keyframes stop {
	0% {
		background-position-y: -100px;
		translate: 0 -20%;
	}
	100% {
		background-position-y: 0;
		translate: 0 0;
	}
}

@keyframes stop-bg {
	0% {
		background-position-y: -10vh;
	}
	100% {
		background-position-y: 0;
	}
}

.slot-machine .slot {
	width: 40vh;
	height: 40vh;
	display: flex;
	align-items: center;
	justify-content: center;
	--smear: url("");
	background-image: var(--smear), linear-gradient(to bottom, #aaa 0%, #ddd 5%, #fff, #ddd 95%, #aaa 100%);
	background-size: contain;
	border: 1vh solid gray;
	border-radius: 2vh;
	box-shadow: inset 0 1vh 4vh 1vh  #2104,
		0 -.5vh 2vh  #2104,
		0 .5vh 2vh  #fff4;
}

.slot-machine .slot span {
	font-size: 25vh;
	font-family: Poppins;
	font-weight: 700;
}

.slot-machine .slot[stop] span {
	animation: stop .3s cubic-bezier(.44,1.14,.7,1.09);
}
.slot-machine .slot[stop] {
	animation: stop-bg .3s cubic-bezier(.44,1.14,.7,1.09);
}

.slot-machine .slot:not([stop]) {
	animation: fast .2s infinite, misalign .1333s infinite step-start;
}

</style>
