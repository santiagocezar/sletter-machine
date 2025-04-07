<script lang="ts">
import info from './info.md?raw'

import Blockly from "$lib/components/Blockly.svelte";
import { Robot, CodeRunner, ringBorder, ringRadius } from "$lib/diff-robot/control.svelte";
import { marked } from 'marked';
import DiagonalJoystick from '$lib/components/DiagonalJoystick.svelte';
import { untrack } from 'svelte';
import { Tabs } from 'melt/builders'

import Copy from '~icons/hugeicons/copy-01'
import Flag from '~icons/hugeicons/flag-02'
import Stop from '~icons/hugeicons/octagon'
import Puzzle from '~icons/hugeicons/puzzle'
import Save from '~icons/hugeicons/floppy-disk'
import Open from '~icons/hugeicons/folder-open'
import Info from '~icons/hugeicons/information-circle'
import FullScreen from '~icons/hugeicons/full-screen'

const CANVAS_W = 600
const CANVAS_H = 300

let penDown = $state(true)

let code: string = $state("");
let blocklyState: string = $state("null");
let highlightBlock: string | null = $state(null);
let fullscreen: boolean = $state(false);

let paintCtx: CanvasRenderingContext2D | undefined = undefined;

const robot = new Robot()
const codeRunner = new CodeRunner(robot, (id) => {
    highlightBlock = id
});

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

const twoDigits = (n: number) => ("0" + n).slice(-2)

function downloadFile() {
    const now = new Date() 
    const year = "" + now.getFullYear()
    const month = twoDigits(now.getMonth() + 1)
    const day = twoDigits(now.getDate())
    const hour = twoDigits(now.getHours())
    const min = twoDigits(now.getMinutes())
    const sec = twoDigits(now.getSeconds())

    const stateBlob = new Blob([blocklyState])
    
    const a = document.createElement("a")

    a.href = URL.createObjectURL(stateBlob)
    a.download = `bloques-${year}${month}${day}${hour}${min}${sec}.json`
    document.body.appendChild(a);

    a.click()

    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

function openFile(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return

    const file = e.target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
        const res = (e.target?.result)?.toString()
        if (res) {
            blocklyState = res
        } 
    }

    reader.readAsText(file)
}

function reset() {
    codeRunner.stop()
    robot.reset()

    paintCtx?.clearRect(0, 0, CANVAS_W, CANVAS_H)
}

function toggleFullscreen() {
    fullscreen = !fullscreen
}

const FRAME_TIME = 16.66
$effect(() => {
    blocklyState = localStorage.getItem("blocky-temp") ?? "null"
    // code = localStorage.getItem("blocky-temp-code") ?? ""

    let lastTime = 0
    let simuElapsed = 0
    
    const update = (elapsed: number) => {
        const prevX = robot.positionX;
        const prevY = robot.positionY;
        while (simuElapsed < elapsed) {
            while(codeRunner.step()) {}
            simuElapsed += robot.step(FRAME_TIME / 1000) * 1000
        }

        if (paintCtx) {
            const x = robot.positionX + CANVAS_W / 2;
            const y = robot.positionY + CANVAS_H / 2;
    
            if (robot.penDown) {
                paintCtx.strokeStyle = "#ff0044ff";
                paintCtx.lineWidth = 3;
                paintCtx.beginPath()
                paintCtx.moveTo(prevX + CANVAS_W / 2, prevY + CANVAS_H / 2)
                paintCtx.lineTo(x, y)
                paintCtx.stroke()
            }
        }

        lastTime = elapsed

        requestAnimationFrame(update)
    }

    untrack(() => {
        update(lastTime);
    })
})

function paintCanvas(node: HTMLCanvasElement) {
    paintCtx = node.getContext("2d")!;
}

const tabs = new Tabs<"blocks" | "info">({
    value: "blocks"
})
</script>

<main class={{ fullscreen }}>
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
            <Blockly 
                bind:value={blocklyState}
                bind:code={code} 
                {highlightBlock}
            />
        </div>
        <div class="info-content" {...tabs.getContent("info")}>
            <article>
                {@html marked(info)}
            </article>
        </div>
    </div>
    <div class="view">
        <div class="buttons">
            <button onclick={downloadFile}>
                <Save /> Descargar
            </button>
            <label class="button">
                <input type="file" onchange={openFile}>
                <Open /> Abrir
            </label>
            <div class="expand"></div>
            <button class="" onclick={toggleFullscreen}>
                <FullScreen />
            </button>
            <button class="accent palette-secondary" onclick={runCode}>
                <Flag />
            </button>
            <button class="accent palette-evil" onclick={reset}>
                <Stop />
            </button>
        </div>
        <div class="view-container">
            <svg viewBox="-{CANVAS_W / 2} -{CANVAS_H / 2} {CANVAS_W} {CANVAS_H}">
                <circle 
                    fill="#ededed"
                    cx="0" cy="0" r={ringRadius + ringBorder}
                    stroke="#444"
                    stroke-width="1"
                ></circle>
                <circle 
                    fill="#444"
                    cx="0" cy="0" r={ringRadius}
                ></circle>
            </svg>
            <canvas use:paintCanvas width={CANVAS_W} height={CANVAS_H}></canvas>
            <svg viewBox="-{CANVAS_W / 2} -{CANVAS_H / 2} {CANVAS_W} {CANVAS_H}">
                <g transform="translate({robot.positionX} {robot.positionY}) rotate({robot.rotation / Math.PI * 180})">
                    <path
                        fill="#ffaa10" stroke="white"
                        d="
                            M 0 {robot.axisWidth / 2}
                            l {robot.length / 2} 0
                            l {robot.length / 2} -{robot.axisWidth / 2}
                            l -{robot.length / 2} -{robot.axisWidth / 2}
                            l -{robot.length / 2} 0
                            z
                        "
                    ></path>
                    <rect fill="#111122" x="-10" y={robot.axisWidth / 2 - 5} width="20" height="10"></rect>
                    <rect fill="#111122" x="-10" y={-robot.axisWidth / 2 - 5} width="20" height="10"></rect>
                    <circle 
                        fill={robot.isOnBorder() ? "lime" : "darkred"}
                        cx={robot.length / 2} cy="0" r={4}
                    ></circle>
                </g>
            </svg>
        </div>
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
    grid-template-rows: minmax(0, min-content) minmax(0, 1fr);
    min-height: 0;
    height: 100%;
    --border: var(--bg4);
}
.fullscreen {
    & .workspace {
        visibility: hidden;
        opacity: 0;
    }
    & .actions {
        visibility: hidden;
        opacity: 0;
    }
    & .view {
        grid-area: 1 / 1 / -1 / -1;

        & .view-container, & canvas {
            width: 100%;
            // height: 100%;
        }
    }
}
.workspace {
    grid-row: span 3;
    display: grid;
    grid-template-rows: minmax(0, min-content) minmax(0, 1fr);

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
    display: grid;
    grid-template: 1fr / 1fr;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    width: 100%;
    margin: 0;
    padding: 0;
    border-radius: 0;
    overflow: visible;

    & * {
        grid-area: 1 / 1 / -1 / -1;
    }
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
    padding: .5rem;
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
input[type="file"] {
    display: none;
}
</style>
