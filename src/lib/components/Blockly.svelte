<script lang="ts">
    import * as Blockly from "blockly/core";
    import * as es from "blockly/msg/es";
    import * as libraryBlocks from "blockly/blocks";

    import {
        javascriptGenerator,
        Order,
        type JavascriptGenerator,
    } from "blockly/javascript";
    import type { Workspace, Block } from "blockly";
    import { untrack } from "svelte";
    import blocklySetup from "./blockly-setup";

    interface Props {
        value: string;
        code: string;
        highlightBlock: string | null;
    }

    let { value = $bindable(), code = $bindable(), highlightBlock }: Props = $props();

    let updating = $state(false);

    function blocklySetupAndBind(node: HTMLElement) {
        const workspace = blocklySetup(node)
        
        workspace.addChangeListener(() => {
            updating = true;
            code = javascriptGenerator.workspaceToCode(workspace);
            value = JSON.stringify(
                Blockly.serialization.workspaces.save(workspace),
            );
        });

        $effect(() => {
            const blocklyState = JSON.parse(value);
            console.log("parsing state")
            const u = untrack(() => updating);
            if (!u && blocklyState) {
                Blockly.Events.disable();
                Blockly.serialization.workspaces.load(blocklyState, workspace);
                console.log("loaded workspace")
                code = javascriptGenerator.workspaceToCode(workspace);
                Blockly.Events.enable();
            }
            updating = false;
        });

        $effect(() => {
            // console.log(`${highlightBlock} (${typeof highlightBlock})`)
            workspace.highlightBlock(highlightBlock)
        })
    }

</script>

<div class="wrapper" use:blocklySetupAndBind></div>

<style>
    :global {
        svg[display="none"] {
            display: none;
        }
        .blocklyMainBackground {
            stroke: none !important;
        }
        .blocklyTreeIcon {
            display: block;
            visibility: visible;
            width: 1em;
            height: 1em;
            border-radius: 1em;
            margin-right: 0.25em;
            background-color: var(--color);
            background-image: none;
            .blocklyTreeSelected & {
                background-color: white;
            }
        }
        .blocklyTreeRow {
            height: auto;
            margin: 0 4px 4px 4px;
            border-radius: 0.25rem;
            border: 1px solid var(--color) !important;
            height: 2rem;
            place-content: center;
            padding: 0 0.5rem !important;
            /*     color: var(--color); */
        }
        .blocklyToolboxDiv {
            background-color: white;
            border-right: 1px solid var(--border);
        }
        .blocklyTreeLabel {
            font: inherit;
            font-weight: bold;
        }
    }

    .wrapper {
        width: 100%;
        height: 100%;
    }
</style>
