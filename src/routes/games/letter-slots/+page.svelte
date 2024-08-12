<script>

import smears from '$lib/assets/smears.svg'

const slots = [
	"ZCGJLOUV".split(''),
	"SPIHADEFMWNT".split(''),
	"XRQÑBKY".split(''),
]

let currentSlot = $state(0)
let slotValues = $state(slots.map(_ => null))

function stop() {
	if (currentSlot == slots.length) {
		currentSlot = 0
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

<div class="slot-machine">
	{#each slotValues as slot, i}
		{#if currentSlot > i}
			<div stop class="slot"><span>{slot}</span></div>
		{:else}
			<div class="slot"></div>
		{/if}
	{/each}
</div>

<style>

.slot-machine {
	display: flex;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(to bottom, maroon, crimson, maroon);
	align-items: center;
	justify-content: center;
	gap: 2rem;
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
	background-image: var(--smear), linear-gradient(to bottom, #444 0%, #aaa 5%, #fff, #aaa 95%, #444 100%);
	background-size: contain;
	border: 1vh solid midnightblue;
	border-radius: 2vh;
	box-shadow: inset 0 1vh 4vh 1vh  #210a,
		0 -.5vh 2vh  #210a,
		0 .5vh 2vh  #fffa;
}

.slot-machine .slot span {
	font-size: 25vh;
	font-family: 'Rubik';
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
