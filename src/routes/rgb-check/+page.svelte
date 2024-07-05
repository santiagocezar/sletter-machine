<script lang="ts">

let refColor = $state([255, 255, 255])

let color1 = $state([255, 255, 255])
let color2 = $state([255, 255, 255])

function distanceRGB(colorA, colorB) {
    return (100 - Math.sqrt(
        Math.pow(colorB[0] - colorA[0], 2) +
        Math.pow(colorB[1] - colorA[1], 2) +
        Math.pow(colorB[2] - colorA[2], 2)
    ) / 442 * 100).toFixed(2) + "%"
}

let dist1 = $derived.by(() => {
    return distanceRGB(color1, refColor)
})
let dist2 = $derived.by(() => {
    return distanceRGB(color2, refColor)
})

function randomize() {
    refColor[0] = Math.floor(Math.random() * 256)
    refColor[1] = Math.floor(Math.random() * 256)
    refColor[2] = Math.floor(Math.random() * 256)
}

</script>

{#snippet block(color, dist)}
    <div class="block" style={`--c: rgb(${color.join(',')});`}>
        <h1>
            {dist}
        </h1>
        <div class="inputs">
            {#each color as comp, i}
                <input type="number" min="0" max="255" bind:value={color[i]}>
            {/each}
        </div>
    </div>
{/snippet}

<div class="rgb">
    {@render block(color1, dist1)}
    <button onclick={randomize} class="block" style={`--c: rgb(${refColor.join(',')});`}>
        Elegir
    </button>
    {@render block(color2, dist2)}
</div>

<style>
.rgb {
    flex-grow: 1;
    display: flex;
}

.block {
    flex: 1 1;
    padding: 3vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--c);
}

button.block {
    display: grid;
    place-content: end center;
    border: unset;
    color: white;
    font-family: Poppins, sans-serif;
    font-weight: 900;
    font-size: 10vh;
    text-shadow: 0 1vh 2vh #0008
}

.block h1 {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: white;
    font-family: Poppins, sans-serif;
    font-weight: 900;
    font-size: 10vh;
    text-shadow: 0 1vh 2vh #0008
}

.block .inputs {
    display: flex;
    gap: 2vh;
}

.block input {
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

.block input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
