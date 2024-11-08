<script lang="ts">
import Blockly from "$lib/components/Blockly.svelte";
import { Robot, CodeRunner } from "$lib/diff-robot/control";
import { attachCanvas } from "$lib/diff-robot/rendering";

// transform matrices
const A = 1/2, B = -1/2;
const C = -1/2, D = -1/2;
const IA = 1, IB = -1;
const IC = -1, ID = -1;

let ball: HTMLElement = $state();
let base: HTMLElement = $state();

let canvas: HTMLCanvasElement = $state();
let paintCanvas: HTMLCanvasElement = $state();

let originX = 0, originY = 0;

let baseSize = 0;
let moving = false;

let penDown = $state(true)

let code: string = $state("");
let blocklyState: string = $state("null");

const robot = new Robot()
const codeRunner = new CodeRunner(robot);

$effect(() => robot.penDown = penDown)
$effect(() => {
    if (blocklyState != "null")
        localStorage.setItem("blocky-temp", blocklyState)
})
$effect(() => {
    if (code != "")
        localStorage.setItem("blocky-temp-code", code)
})

function stopMoving(ev: MouseEvent | TouchEvent) {
    console.log("what")
    moving = false

    robot.powerL = 0;
    robot.powerR = 0;

    moveBall()
}

function startMoving(ev: MouseEvent | TouchEvent) {
    moving = true
    const clickX = ev.clientX ?? ev.touches[0].clientX
    const clickY = ev.clientY ?? ev.touches[0].clientY

    const rect = base.getBoundingClientRect();
    baseSize = rect.width;
    originX = rect.left;
    originY = rect.top;

    setPowerFromClientPos(clickX, clickY);

    ev.preventDefault()
}

function keepMoving(ev: MouseEvent | TouchEvent) {
    if (!moving) return;
    const clickX = ev.clientX ?? ev.touches[0].clientX
    const clickY = ev.clientY ?? ev.touches[0].clientY

    setPowerFromClientPos(clickX, clickY);
}

function moveBall() {
    // const x = (A*powerX+B*powerY + 1) / 2 * 100;
    // const y = (C*powerX+D*powerY + 1) / 2 * 100;
    const x = (robot.powerL + 1) / 2 * 100;
    const y = (1 - robot.powerR) / 2 * 100;

    // console.log({tx, ty})
    ball.animate([{
        left: `${x}%`,
        top: `${y}%`,
    }], {
        duration: 0,
        fill: "forwards"
    })
}

function setPowerFromClientPos(x: number, y: number) {
    x = (x - originX) / baseSize * 2 - 1;
    y = (y - originY) / baseSize * 2 - 1;
    // console.log({x, y})

    robot.powerL = IA*x+IB*y;
    robot.powerR = IC*x+ID*y;

    if (robot.powerL < -1) robot.powerL = -1;
    if (robot.powerL > 1) robot.powerL = 1;
    if (robot.powerR < -1) robot.powerR = -1;
    if (robot.powerR > 1) robot.powerR = 1;

    moveBall()
}

function runCode() {
    reset()
    codeRunner.runCode(code)
}

function copyToClipboard() {
    navigator.clipboard.writeText(blocklyState)
}

function reset() {
    codeRunner.stop()
    robot.reset()

    // should probably move this somewhere else but eh.
    paintCanvas.getContext("2d").clearRect(0, 0, paintCanvas.width, paintCanvas.height)
}

$effect(() => {
    blocklyState = localStorage.getItem("blocky-temp") ?? "null"
    code = localStorage.getItem("blocky-temp-code") ?? ""

    const render = attachCanvas(canvas!, paintCanvas!)

    const update = () => {
        if (codeRunner.isRunning() && !codeRunner.step()) {
            robot.stop()
        }

        robot.step()

        render(robot);

        requestAnimationFrame(update)
    }

    update();
})
</script>

<svelte:document
    onmousemove={keepMoving}
    ontouchmove={keepMoving}
    onmouseup={stopMoving}
    ontouchend={stopMoving}
    ontouchcancel={stopMoving}
/>

<main>
    <div class="workspace">
        <Blockly bind:value={blocklyState} bind:code={code} />
    </div>
    <div class="buttons">
        <button class="btn material-symbols-sharp" onclick={copyToClipboard}>content_copy</button>
        <div class="expand"></div>
        <button class="btn green material-symbols-sharp" onclick={runCode}>flag</button>
        <button class="btn red material-symbols-sharp" onclick={reset} >dangerous</button>
    </div>
    <div class="view-container">
        <canvas style="display: none;" bind:this={paintCanvas} width="600" height="300"></canvas>
        <canvas bind:this={canvas} width="600" height="300"></canvas>
	</div>
    <div class="actions">
        <div
            class="card joystick"
            onmousedown={startMoving}
            ontouchstart={startMoving}
            role="none"
        >
            <div bind:this={base} class="base">
                <div bind:this={ball} class="ball">
                </div>
            </div>
        </div>
        <label>
            <input type="checkbox" bind:checked={penDown}>
            Activar lapiz
        </label>
    </div>
</main>


<style lang="less">
main {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: min-content min-content 1fr;
    height: 100%;
}
.workspace {
    grid-row: span 3;

    > :global(*) {
        width: 100%;
        height: 100%;
    }
}
.view-container {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    width: min-content;
    margin: 0;
    padding: 0;
    border-radius: 0;
    overflow: visible;
}
.actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}
.buttons {
    border-top: 1px solid #ddd;
    padding: .5rem;
    display: flex;
    gap: .5rem;
    justify-content: end;
    height: min-content;

    .expand {
        flex-grow: 1;
    }
}
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
