<script lang="ts">

let light = $state(true);

let components = $state([255, 255, 255])


let color = $derived.by(() => {
    return "#" + components.map(n => (n ?? 0).toString(16).padStart(2, "0")).join("")
})

let singleColor = $derived.by(() => {
    return components.map((_, i) => (
        "#" + components.map((n, j) => (
            i == j
            ? (n ?? 0).toString(16).padStart(2, "0")
            : "00"
        )).join("")
    ))
})

$effect(() => {
	const onSpace = e => {
        light = !light
        e.preventDefault()
	}
	document.addEventListener("keypress", onSpace)
	return () => {
		document.removeEventListener("keypress", onSpace)
	}
})
</script>

<div class="rgb" {light} style={`--c: ${color};`}>
    {#each components as comp, i}
        <div class="bulb" style={`--c: ${singleColor[i]};`}>
            <input type="number" min="0" max="255" bind:value={components[i]}>
        </div>
    {/each}

</div>
 <!--   {#each singleColor as c}
        <p>{c}</p>
    {/each}

    <p>{color}</p>-->

<style>
.rgb {
    flex-grow: 1;
    display: grid;
    grid-template-rows: auto auto;
    place-content: center;
    place-items: center;
    gap: 0 4vh;
    background-color: black;
    transition: background-color .2s ease;
    overflow: hidden;
}

.rgb[light="true"] {
    background-color: white;
}

.bulb {
    display: grid;
    place-items: center;
    grid-row-start: 2;
    width: 30vh;
    height: 30vh;
    border-radius: 100%;
    background-color: black;
/*     background-image: radial-gradient(#fff, transparent); */
/*     background-blend-mode: overlay; */
}

.bulb input {
    all: unset;
    font-family: monospace;
    width: 4ch;
    border-radius: 1vh;
    background-color: white;
    -moz-appearance: textfield;
    appearance: textfield;
    z-index: 2;
    font-size: 5vh;
    box-shadow: 0 1vh 2vh #0004;
    text-align: center;
}
.bulb input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.bulb input,
.bulb::before {
    grid-row-start: 1;
    grid-column-start: 1;
}
.bulb::before {
    content: "";
    pointer-events: none;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background-image: radial-gradient(var(--c), var(--c), transparent, transparent);
    mix-blend-mode: screen;
    background-blend-mode: overlay;
    transform: scale(8);
    transition: transform .2s ease;
}
.rgb[light="true"] .bulb::before {
    transform: scale(1.5);
}

.bulb:first-child {
    grid-row-start: 1;
    grid-column: span 2;
}

.rgb {
    flex-grow: 1;
}
</style>
