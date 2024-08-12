<script lang="ts">

import smears from '$lib/assets/smears.svg'

const slots = [
	["#ff0", "#0f0", "#f00", "#f0f", "#0ff", "#00f"],
	["#fa0", "#af0", "#f0a", "#a0f", "#0fa", "#0af"],
	["#a40", "#4a0", "#faf", "#a8f", "#0aa", "#048"],
]

let currentSlot = $state(0)
let slotValues = $state(slots.map(_ => "#000"))

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
	const onSpace = (e: KeyboardEvent) => (e.code == "Space" && stop())
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

<main>
	<div class="slot-machine">
		{#each slotValues as slot, i}
			{#if currentSlot > i}
				<div data-stop class="slot">
					<span class="color" style={"--c: " + slot}>
					</span>
				</div>
			{:else}
				<div class="slot"></div>
			{/if}
		{/each}
	</div>
	<button onclick={stop} class="btn">
		{currentSlot == slots.length ? "Reiniciar" : "Detener"} (barra espaciadora)
	</button>
</main>

<style lang="less">

.slot-machine {
	position: relative;
	display: flex;
	background-image: linear-gradient(to bottom, #bbb, #fff, #bbb);
	align-items: center;
	justify-content: center;
	gap: 2rem;
	padding: 2rem;
	margin: 2rem;
	border-radius: 2rem;
}

.slot {
	width: 20%;
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
	--smear: url("");
	background-image: var(--smear), linear-gradient(to bottom, #aaa 0%, #ddd 5%, #fff, #ddd 95%, #aaa 100%);
	background-size: contain;
	border: 2px solid gray;
	border-radius: 5%;
	box-shadow: inset 0 1rem 4rem 1rem  #2104,
		0 -.5vh 2vh  #2104,
		0 .5vh 2vh  #fff4;

	animation: fast .2s infinite, misalign .1333s infinite step-start;
	&[data-stop] {
		animation: stop-bg .3s cubic-bezier(.44,1.14,.7,1.09);

		span {
			animation: stop .3s cubic-bezier(.44,1.14,.7,1.09);
		}
	} 
}

.color {
	display: inline-block;
	width: 60%;
	height: 60%;
	border: 1vh solid black;
	border-radius: 100%;
	background-color: var(--c);
	box-shadow: 0 1rem 10rem var(--c);
}

.btn {
	font-size: 1.5rem;
	margin: 0 auto;
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

</style>
