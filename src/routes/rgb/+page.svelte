<script lang="ts">

let components = $state([255, 255, 255])

let color = $derived.by(() => {
    return "#" + components.map(n => n.toString(16).padStart(2, "0")).join("")
})

let singleColor = $derived.by(() => {
    return components.map((_, i) => (
        "#" + components.map((n, j) => (
            i == j
            ? n.toString(16).padStart(2, "0")
            : "00"
        )).join("")
    ))
})

</script>

<div class="rgb" style={`--c: ${color};`}>
    {#each components as comp, i}
        <div class="bulb" style={`--c: ${singleColor[i]};`}>
            <input type="number" min="0" max="255" bind:value={components[i]}>
        </div>
    {/each}

    {#each singleColor as c}
        <p>{c}</p>
    {/each}

    <p>{color}</p>
</div>

<style>
.bulb {
    display: grid;
    place-items: center;
    width: 30vh;
    height: 30vh;
    border-radius: 100%;
    background-color: var(--c);
    background-image: radial-gradient(#fff, transparent);
    background-blend-mode: overlay;
    /*box-shadow: 0 0 50vh var(--c);*/
    mix-blend-mode: screen;
    margin-bottom: -10vh;
}
.rgb {
    flex-grow: 1;
}
</style>
