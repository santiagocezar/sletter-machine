<script lang="ts">
    import { SvelteWebSocket } from "$lib/ws.svelte";
    import Dial from "./Dial.svelte";


let light = $state(true);

let components = $state([128, 128, 128])

let color = $derived.by(() => {
    return "#" + components.map(n => (n ?? 0).toString(16).padStart(2, "0")).join("")
})

const ws = new SvelteWebSocket("http://192.168.0.18/ws")

let lastController = new AbortController()

$effect(() => {
    const data = new Uint8Array(components).buffer
    const conn = ws.connection
    if(conn) {
        conn.send(data)
    }
    // lastController.abort()
    // lastController = new AbortController()
    // fetch(`http://192.168.64.179/?r=${components[0]}&g=${components[1]}&b=${components[2]}`, {
    //     signal: lastController.signal,
    // })

})

const componentColor = ["#f00", "#0f0", "#00f"]

let singleColor = $derived.by(() => {
    return components.map((_, i) => (
        "#" + components.map((n, j) => (
            i == j
            ? Math.round(n).toString(16).padStart(2, "0")
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
            <div class="bulb" style="--c: {singleColor[i]}; --bg4: #000; --text: {componentColor[i]}">
                <Dial bind:value={() => components[i] / 255, (v) => components[i] = v * 255} />
                <!-- <input type="number" min="0" max="255" bind:value={components[i]}> -->
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
    padding: 2rem;
    overflow: hidden;
}

.rgb[data-light="true"] {
    background-color: white;
}

.bulb {
    width: 30vmin;
    height: 30vmin;
    display: grid;
    border-radius: 100%;
    background-color: black;

    & > :global(*), &::before {
        grid-area: 1 / 1;
    }

    & > :global(*) {   
        margin: 2rem;
        z-index: 3;
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
        z-index: 2;

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
