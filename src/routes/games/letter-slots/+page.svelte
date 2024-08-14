<script lang="ts">
import smears from '$lib/assets/smears.svg'

const slots = [
	"ZCGJLOUV".split(''),
	"SPIHADEFMWNT".split(''),
	"XRQÑBKY".split(''),
]

let currentSlot = $state(0)
let slotValues = $state(slots.map(_ => "A"))

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

<main>
	<div class="slot-machine view-container">
		{#each slotValues as slot, i}
			{#if currentSlot > i}
				<div data-stop class="slot"><span>{slot}</span></div>
			{:else}
				<div class="slot"></div>
			{/if}
		{/each}
	</div>
	<button onclick={stop} class="btn">
		{currentSlot == slots.length ? "Reiniciar" : "Detener"} (barra espaciadora)
	</button>
</main>

<style>
@import "../color-slots/slots.less";

.slot-machine {
	background-image: linear-gradient(to bottom, maroon, crimson, maroon);
}

.slot {
	border-color: midnightblue;

	span {
		font-size: 20vmin;
		font-family: 'Rubik';
		font-weight: 700;
	}
}

</style>
