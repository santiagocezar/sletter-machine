import * as Blockly from "blockly/core";
import * as es from "blockly/msg/es";
import "blockly/blocks";

import {
    javascriptGenerator,
    Order,
    type JavascriptGenerator,
} from "blockly/javascript";
import type { WorkspaceSvg, Block } from "blockly";

import { browser } from "$app/environment";

export interface CreateBlocklyOpts<B extends BlockDefs> {
    blockDefs: B,
    generators: GeneratorsFor<B>
    toolboxXML: string
    onChange(state: string, code: string): void
}

export function createBlockly<B extends BlockDefs>(opts: CreateBlocklyOpts<B>) {
    if (!browser) return {
        attach() {},
        highlightBlock() {},
        loadWorkspace() {}
    }

    let theme = createBlockly.theme
    /** Avoid running this more than once */
    if (!theme) {
        Blockly.setLocale(es as any);
        
        /**
         * This allow custom CSS styling based on the color of the category.
         */
        Blockly.registry.register(
            Blockly.registry.Type.TOOLBOX_ITEM,
            Blockly.ToolboxCategory.registrationName,
            class CustomCategory extends Blockly.ToolboxCategory {
                constructor(categoryDef: Blockly.utils.toolbox.CategoryInfo, parentToolbox: Blockly.IToolbox, opt_parent?: Blockly.ICollapsibleToolboxItem) {
                    super(categoryDef, parentToolbox, opt_parent);
                }
                addColourBorder_(color: string) {
                    this.rowDiv_?.style.setProperty("--color", color);
                }
            },
            true,
        );
            
        javascriptGenerator.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
        theme = Blockly.Theme.defineTheme("modern2", {
            name: "modern2",
            base: Blockly.Themes.Zelos,
            componentStyles: {
                workspaceBackgroundColour: "var(--bg3)",
                toolboxBackgroundColour: "var(--bg2)",
                flyoutBackgroundColour: "var(--bg2)",
            },
            blockStyles: {
                robot_blocks: {
                    colourPrimary: "#ff6c03",
                },
                robot_control: {
                    colourPrimary: "#414088",
                },
            },
            categoryStyles: {
                robot_category: {
                    colour: "#ff6c03",
                },
            },
            fontStyle: {
                family: "Inter",
            },
            startHats: true,
        });
    }

    Blockly.defineBlocksWithJsonArray(opts.blockDefs as unknown as any[]);
    Object.assign(javascriptGenerator.forBlock, opts.generators)

    let currentWorkspace: WorkspaceSvg | null = null
    const onWorkspaceLoad: WorkspaceCallback[] = []

    function getWorkspace(cb: WorkspaceCallback) {
        if (currentWorkspace) {
            cb(currentWorkspace)
        } else {
            onWorkspaceLoad.push(cb)
        }
    }

    return {
        attach(blocklyWrapper: HTMLElement) {
            const workspace = Blockly.inject(blocklyWrapper, {
                theme,
                toolbox: opts.toolboxXML,
                zoom: {
                    startScale: .8
                },
                renderer: "zelos",
            });
            
            currentWorkspace = workspace

            workspace.addChangeListener((e) => {
                Blockly.Events.disableOrphans(e)
                
                // if ([
                //     Blockly.Events.BLOCK_CHANGE,
                //     Blockly.Events.BLOCK_CREATE,
                //     Blockly.Events.BLOCK_DELETE,
                // ].includes(e.type as any)) {
                    const code = javascriptGenerator.workspaceToCode(workspace);
                    const state = JSON.stringify(
                        Blockly.serialization.workspaces.save(workspace),
                    );

                    opts.onChange(state, code)
                // }
            });
            
            let cb: WorkspaceCallback | undefined
            while (cb = onWorkspaceLoad.pop()) {
                cb(workspace)
            }
        },
        highlightBlock(id: string | null) {
            getWorkspace((workspace) => {
                workspace.highlightBlock(id)
            })
        },
        loadWorkspace(state: string) {
            const stateObject = JSON.parse(state);
            console.log("parsing state")
            if (stateObject) {
            
                getWorkspace((workspace) => {
                    // Blockly.Events.disable();
                    Blockly.serialization.workspaces.load(stateObject, workspace);
                    // Blockly.Events.enable();
                    console.log("loaded workspace")
                })
            }
        }
    }
}

export namespace createBlockly {
    export let theme: Blockly.Theme | null = null
}

type WorkspaceCallback = (workspace: WorkspaceSvg) => void

type BlockDefs = readonly { type: string }[]

export type GeneratorHandler = (block: Block, generator: JavascriptGenerator) => [string, number] | string | null

export type GeneratorsFor<B extends BlockDefs> = Record<B[number]["type"], GeneratorHandler>
