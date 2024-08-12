<script lang="ts">

let refColor = $state([0,0,0])

let color1 = $state([255, 255, 255])
let color2 = $state([255, 255, 255])


function deltaC([r1, g1, b1], [r2, g2, b2]) {
    const rm = (r1 + r2) / 2
    const { sqrt, pow } = Math
    return sqrt(
        (2 + rm / 256) * pow(r2-r1, 2) +
        4 * pow(g2-g1, 2) +
        (2 + (255-rm) / 256) * pow(b2-b1, 2)
    )
}

console.log("Test deltaC: " + deltaC([242, 212, 207], [242, 212, 207]))
const MAX_DELTA_C = deltaC([0, 0, 0], [255, 255, 255])

function distanceRGB(colorA, colorB) {
    return 100 - 100 * deltaC(colorA, colorB) / MAX_DELTA_C
}

let dist1 = $derived.by(() => {
    return distanceRGB(color1, refColor).toFixed(2) + "%"
})
let dist2 = $derived.by(() => {
    return distanceRGB(color2, refColor).toFixed(2) + "%"
})

function randomize() {
    refColor[0] = Math.floor(Math.random() * 256)
    refColor[1] = Math.floor(Math.random() * 256)
    refColor[2] = Math.floor(Math.random() * 256)
}

</script>

{#snippet block(color, dist)}
    <div class="block" style={`--c: rgb(${color.join(',')});`}>
        <div class="closeness">
            <h2>parecido:</h2>
            <h1>{dist}</h1>
        </div>
        <div class="inputs">
            {#each color as comp, i}
                <input class={"component-"+i} type="number" min="0" max="255" bind:value={color[i]}>
            {/each}
        </div>
    </div>
{/snippet}

<div class="rgb">
    {@render block(color1, dist1)}
    <button onclick={randomize} class="block" style={`--c: rgb(${refColor.join(',')});`}>
        Aleatorio
    </button>
    {@render block(color2, dist2)}
</div>

<style>
.rgb {
    flex-grow: 1;
    display: flex;
    font-family: Poppins, sans-serif;
}

.block {
    flex: 1 1;
    padding: 3vh;
    display: grid;
    grid-template-rows: 1fr auto;
    flex-direction: column;
    place-items: center;
    background-color: var(--c);
}

button.block {
    display: grid;
    place-content: end center;
    border: unset;
    color: white;
    font-weight: 900;
    font-size: 6vh;
    text-shadow: 0 1vh 2vh #0008
}

.closeness {
    text-align: center;
    box-shadow: 0 .5vh 1vh #0002;
    justify-self: center;
    border-radius: 2vh;
    padding: 1vh 3vh 0 3vh;
    background-color: white;
}

.closeness h1 {
    font-weight: bold;
    font-size: 10vh;
    font-family: monospace;
}
.closeness h2 {
    font-size: 5vh;
}

.block .inputs {
    display: flex;
    gap: 2vh;
}

.block input {
    --component: gray
    all: unset;
    font-family: monospace;
    width: 4ch;
    border-radius: 1vh;
    background-color: white;
    -moz-appearance: textfield;
    appearance: textfield;
    z-index: 2;
    font-size: 5vh;
    box-shadow: 0 .5vh 1vh #0002;
    text-align: center;
    border: .2vh solid var(--component);
    border-bottom-width: .5vh;
    background-image: linear-gradient(var(--component) -200%, #eee 50%, #fff)
}

.block input.component-0 {
    --component: #f00;
}
.block input.component-1 {
    --component: #0f0;
}
.block input.component-2 {
    --component: #00f;
}

.block input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
