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
	const onSpace = (e: KeyboardEvent) => {
        if (e.code == "Space") {
            e.preventDefault()
            light = !light
        }
	}
	document.addEventListener("keypress", onSpace)
	return () => {
		document.removeEventListener("keypress", onSpace)
	}
})
</script>

<main>
    <div class="rgb view-container" data-light={light} style={`--c: ${color};`}>
        {#each components as comp, i}
            <div class="bulb" style={`--c: ${singleColor[i]};`}>
                <input type="number" min="0" max="255" bind:value={components[i]}>
            </div>
        {/each}
    </div>
	<button onclick={() => light = !light} class="btn important">
		{light ? "Encender" : "Apagar"} (barra espaciadora)
	</button>
</main>

<style lang="less">
.rgb {
    flex-grow: 1;
    display: grid;
    grid-template-rows: auto auto;
    place-content: center;
    place-items: center;
    gap: 0 4vmin;
    background-color: black;
    transition: background-color .2s ease;
    overflow: hidden;
}

.rgb[data-light="true"] {
    background-color: white;
}

.bulb {
    display: grid;
    place-items: center;
    grid-row-start: 2;
    width: 30vmin;
    height: 30vmin;
    border-radius: 100%;
    background-color: black;
    
    input {
        all: unset;
        font-family: monospace;
        width: 4ch;
        border-radius: 1vmin;
        background-color: var(--bg1);
        -moz-appearance: textfield;
        appearance: textfield;
        z-index: 2;
        font-size: 5vmin;
        box-shadow: inset 0 1vmin 1vmin #0002;
        border: .2vmin solid color-mix(in lab, black 20%, var(--c));
        border-top-width: .4vmin;
        text-align: center;
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    }
    
    input, &::before {
        grid-row-start: 1;
        grid-column-start: 1;
    }

    &::before {
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
        
        .rgb[data-light="true"] & {
            transform: scale(1.5);
        }
    }

    &:first-child {
        grid-row-start: 1;
        grid-column: span 2;
    }
}

.btn {
	margin: 0 auto;
}

</style>
