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
	<div class="slot-machine view-container">
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

<style lang="scss">
@import "./slots.scss";
</style>
