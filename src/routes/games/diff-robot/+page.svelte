<script lang="ts">
import info from './info.md?raw'

import Blockly from "$lib/components/Blockly.svelte";
import { Robot, CodeRunner } from "$lib/diff-robot/control.svelte";
import { attachCanvas } from "$lib/diff-robot/rendering";
import { marked } from 'marked';
import DiagonalJoystick from '$lib/components/DiagonalJoystick.svelte';
import { untrack } from 'svelte';
import { Tabs } from 'melt/builders'

import Copy from '~icons/hugeicons/copy-01'
import Flag from '~icons/hugeicons/flag-02'
import Stop from '~icons/hugeicons/octagon'
import Puzzle from '~icons/hugeicons/puzzle'
import Info from '~icons/hugeicons/information-circle'

let canvas: HTMLCanvasElement | undefined = $state();
let paintCanvas: HTMLCanvasElement | undefined = $state();

let penDown = $state(true)

let code: string = $state("");
let blocklyState: string = $state("null");

const robot = new Robot()
const codeRunner = new CodeRunner(robot);

$effect(() => { robot.penDown = penDown })
$effect(() => {
    if (blocklyState != "null")
        localStorage.setItem("blocky-temp", blocklyState)
})

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
    paintCanvas!.getContext("2d").clearRect(0, 0, paintCanvas!.width, paintCanvas!.height)
}

const FRAME_TIME = 16.66
$effect(() => {
    blocklyState = localStorage.getItem("blocky-temp") ?? "null"
    // code = localStorage.getItem("blocky-temp-code") ?? ""

    const render = attachCanvas(canvas!, paintCanvas!)

    let lastTime = 0
    let simuElapsed = 0
    
    const update = (elapsed: number) => {
        const prevX = robot.positionX;
        const prevY = robot.positionY;
        while (simuElapsed < elapsed) {
            simuElapsed += FRAME_TIME
            while(!robot.isWaiting() && codeRunner.step()) {}
            robot.step(FRAME_TIME / 1000)
        }
        render(robot, prevX, prevY);
/*
        robot.outside = (Math.abs(robot.positionX) > paintCanvas!.width / 2)
            || (Math.abs(robot.positionY) > paintCanvas!.height / 2)*/

        lastTime = elapsed


        requestAnimationFrame(update)
    }

    untrack(() => {
        update(lastTime);
    })
})

const tabs = new Tabs<"blocks" | "info">({
    value: "blocks"
})
</script>

<main>
    <div class="workspace">
        <div class="tab-list" {...tabs.triggerList}>
            <button class={{"palette-primary accent": tabs.value === "blocks"}} {...tabs.getTrigger("blocks")}>
                <Puzzle />
                Bloques
            </button>
            <button class={{"palette-primary accent": tabs.value === "info"}} {...tabs.getTrigger("info")}>
                <Info />
                Info
            </button>
        </div>
        <div {...tabs.getContent("blocks")}>
            <Blockly bind:value={blocklyState} bind:code={code} />
        </div>
        <div class="info-content" {...tabs.getContent("info")}>
            <article>
                {@html marked(info)}
            </article>
        </div>
    </div>
    <div class="buttons">
        <button class="btn" onclick={copyToClipboard}>
            <Copy />
        </button>
        <div class="expand"></div>
        <button class="accent palette-secondary" onclick={runCode}>
            <Flag />
        </button>
        <button class="accent palette-evil" onclick={reset}>
            <Stop />
        </button>
    </div>
    <div class="view-container">
        <canvas style="display: none;" bind:this={paintCanvas} width="600" height="300"></canvas>
        <canvas bind:this={canvas} width="600" height="300"></canvas>
	</div>
    <div class="actions">
        <div class="joystick">
            <DiagonalJoystick bind:x={robot.powerL} bind:y={robot.powerR} />
        </div>
        <div class="plastic power">
            <p>Motor izquierdo</p>
            <div class="bar" style="--value: {Math.abs(robot.powerL)}"></div>
            <p>Motor derecho</p>
            <div class="bar" style="--value: {Math.abs(robot.powerR)}"></div>
        </div>
        <label class="plastic pencil">
            <div class={["toggle", "surface-colors", {"palette-evil": !penDown, "palette-secondary": penDown}]}>
                <input type="checkbox" bind:checked={penDown}>
                <div class="thumb"></div>
            </div>
            Activar lapiz
        </label>
    </div>
</main>

<style lang="less">
main {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: minmax(0, min-content) minmax(0, min-content) minmax(0, 1fr);
    min-height: 0;
    height: 100%;
    --border: var(--bg4);
}
.workspace {
    grid-row: span 3;
    display: grid;
    grid-template-rows: subgrid;

    border-top: 1px solid var(--border);
    border-right: 1px solid var(--border);

    /*> :global(*) {
        width: 100%;
        height: 100%;
    }*/
    :global(.info-content) {
        overflow: auto;
    }
    :global([role="tabpanel"]) {
        border-top: 1px solid var(--border);
        grid-row: span 2;
    }
    article {
        padding: 0 5rem 5rem 5rem;
        margin: 0 auto;
    }
}
.view-container {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    width: min-content;
    margin: 0;
    padding: 0;
    border-radius: 0;
    overflow: visible;
}
.buttons {
    border-top: 1px solid var(--border);
    padding: .5rem;
    display: flex;
    gap: .5rem;
    justify-content: end;
    height: min-content;

    .expand {
        flex-grow: 1;
    }
}
[role="tablist"] {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    align-items: center;
    padding: 0 .5rem;
    gap: .5rem;
}
.actions {
    display: grid;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    grid-template-columns: auto auto;
    place-content: center;
    overflow: hidden;
}
.joystick {
    grid-row: span 2;
}
.power, .pencil {
    display: flex;
    gap: .5rem 1rem;
    padding: .5rem;
    user-select: none;
}
.power {
    flex-direction: column;

}
.bar {
    position: relative;
    background-color: blue;
    width: 100%;
    height: 1rem;
    border-radius: .25rem;
}
.bar::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    background-color: yellow;
    width: calc(100% * var(--value));
    transition: width .05s;
    border-radius: inherit;
    height: 100%;
}
.toggle {
    --width: 2rem;
    --height: 1rem;
    --border: 2px;
    --thumb-size: 1.5rem;
    background-color: var(--bg1);
    border: var(--border) solid var(--bg0);
    border-radius: 1rem;
    position: relative;
    width: var(--width);
    height: var(--height);
    margin: calc((var(--thumb-size) - var(--height)) / 2)
}
.toggle input {
    position: fixed;
    left: -100%;
    top: -100%;
    visibility: hidden;
    width: 0;
    height: 0;
}
.thumb {
    --offset: calc((var(--height) - var(--thumb-size)) / 2 - var(--border));
    position: absolute;
    left: var(--offset);
    top: var(--offset);
    background-color: var(--c60);
    border: 2px solid var(--c50);
    border-radius: 1rem;
    width: var(--thumb-size);
    height: var(--thumb-size);
    transition: left .1s;
}
input:checked + .thumb {
    left: calc(100% - var(--offset) - var(--thumb-size));
}
</style>
