<script lang="ts">
let base: HTMLElement | undefined = $state();

interface Props {
    x?: number
    y?: number
}

let { x = $bindable(0), y = $bindable(0) }: Props = $props()

let originX = 0, originY = 0;
let baseSize = 0;
let moving = false;

const A = 1/2, B = -1/2;
const C = -1/2, D = -1/2;
const IA = 1, IB = -1;
const IC = -1, ID = -1;

const relX = $derived((x + 1) / 2 * 100)
const relY = $derived((1 - y) / 2 * 100)

function whateverPointer(fn: (x: number, y: number) => void) {
    return function(ev: MouseEvent | TouchEvent) {
        //@ts-expect-error
        const clickX = ev.clientX ?? ev.touches[0].clientX
        //@ts-expect-error
        const clickY = ev.clientY ?? ev.touches[0].clientY
        ev.preventDefault()

        return fn(clickX, clickY)
    }
}

function stopMoving(ev: MouseEvent | TouchEvent) {
    moving = false

    x = 0;
    y = 0;
}

function startMoving(x: number, y: number) {
    moving = true

    const rect = base!.getBoundingClientRect();
    baseSize = rect.width;
    originX = rect.left;
    originY = rect.top;

    mapClientPosition(x, y);
}

function keepMoving(x: number, y: number) {
    if (!moving) return;

    mapClientPosition(x, y)
}

function mapClientPosition(clientX: number, clientY: number) {
    clientX = (clientX - originX) / baseSize * 2 - 1;
    clientY = (clientY - originY) / baseSize * 2 - 1;
    // console.log({x, y})

    x = Math.min(Math.max(IA*clientX+IB*clientY, -1), 1);
    y = Math.min(Math.max(IC*clientX+ID*clientY, -1), 1);
}
</script>

<svelte:document
    onmousemove={whateverPointer(keepMoving)}
    ontouchmove={whateverPointer(keepMoving)}
    onmouseup={stopMoving}
    ontouchend={stopMoving}
    ontouchcancel={stopMoving}
/>

<div
    class="card joystick"
    onmousedown={whateverPointer(startMoving)}
    ontouchstart={whateverPointer(startMoving)}
    role="none"
>
    <div bind:this={base} class="base">
        <div class="ball" style="left: {relX}%; top: {relY}%">
        </div>
    </div>
</div>

<style lang="less">
.joystick {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 12rem;
    touch-action: none;

    .base {
        position: absolute;
        background-color: white;
        inset: 1rem;
        transform: rotate(-45deg) scale(0.707);
        border-radius: .5rem;
        box-shadow: inset -.25rem .25rem .5rem #0004;
        border: 1px solid #0004
    }
    .ball {
        position: absolute;
        pointer-events: none;
        aspect-ratio: 1 / 1;
        width: 20%;
        border-radius: 100%;
        background: radial-gradient(circle at 60% 40%, #f00, #400);
        translate: -50% -50%;
        left: 50%;
        top: 50%;
    }
}
</style>
