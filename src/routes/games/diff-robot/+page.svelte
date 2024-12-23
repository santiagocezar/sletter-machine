<script lang="ts">
import info from './info.md?raw'

import Blockly from "$lib/components/Blockly.svelte";
import { Robot, CodeRunner } from "$lib/diff-robot/control.svelte";
import { attachCanvas } from "$lib/diff-robot/rendering";
import { TabContent, TabItem, TabList, TabView } from "$lib/components/tabs/index";
import { marked } from 'marked';
import DiagonalJoystick from '$lib/components/DiagonalJoystick.svelte';
import { untrack } from 'svelte';

let canvas: HTMLCanvasElement = $state();
let paintCanvas: HTMLCanvasElement = $state();

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
// $effect(() => {
//     if (code != "")
//         localStorage.setItem("blocky-temp-code", code)
// })

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

$inspect(code)
</script>

<main>
    <div class="workspace">
        <TabView>
            <TabList>
                <TabItem>Bloques</TabItem>
                <TabItem>Info</TabItem>
            </TabList>
            <TabContent>
                <Blockly bind:value={blocklyState} bind:code={code} />
            </TabContent>
            <TabContent class="info-content">
                <section>
                    {@html marked(info)}
                </section>
            </TabContent>
        </TabView>
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
        <DiagonalJoystick bind:x={robot.powerL} bind:y={robot.powerR} />
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
    grid-template-rows: minmax(0, min-content) minmax(0, min-content) minmax(0, 1fr);
    min-height: 0;
    height: 100%;
    --border: #ddd;
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
    section {
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
.actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
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
</style>
