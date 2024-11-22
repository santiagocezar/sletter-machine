<script lang="ts">
import * as Blockly from 'blockly/core'
import * as es from 'blockly/msg/es'
import * as libraryBlocks from 'blockly/blocks';

import { javascriptGenerator, Order, type JavascriptGenerator } from 'blockly/javascript';
import type { Workspace, Block } from 'blockly';
    import { untrack } from 'svelte';

interface Props {
    value: string
    code: string
}

let { value = $bindable(), code = $bindable()  }: Props = $props()

let updating = $state(false)

let blocklyWrapper: HTMLElement | undefined = $state()
let toolbox: XMLDocument | undefined = $state()

let workspace: Workspace

$effect(() => {
    Blockly.setLocale(es as any)
    Blockly.defineBlocksWithJsonArray([
        {
            "type": "robot_set_power",
            "tooltip": "",
            "helpUrl": "",
            "message0": "fuerza motor %1 al %2%%",
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SIDE",
                    "options": [
                        [
                            "izquierdo",
                            "LEFT"
                        ],
                        [
                            "derecho",
                            "RIGHT"
                        ]
                    ]
                },
                {
                    "type": "input_value",
                    "name": "POWER",
                    "check": "Number"
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "style": "robot_blocks"
        },
        {
            "type": "robot_stop",
            "tooltip": "",
            "helpUrl": "",
            "message0": "apagar motores",
            "previousStatement": null,
            "nextStatement": null,
            "style": "robot_blocks"
        },
        {
            "type": "robot_outside",
            "tooltip": "",
            "helpUrl": "",
            "message0": "¿está afuera?",
            "output": "Boolean",
            "style": "robot_blocks"
        },
        {
            "type": "robot_pen_down",
            "tooltip": "",
            "helpUrl": "",
            "message0": "bajar lapiz",
            "previousStatement": null,
            "nextStatement": null,
            "style": "robot_blocks"
        },
        {
            "type": "robot_pen_up",
            "tooltip": "",
            "helpUrl": "",
            "message0": "subir lapiz",
            "previousStatement": null,
            "nextStatement": null,
            "style": "robot_blocks"
        },
        {
            "type": "robot_start",
            "tooltip": "",
            "helpUrl": "",
            "message0": "al inicio",
            "nextStatement": null,
            "style": "robot_control",
        },
        {
            "type": "robot_loop",
            "tooltip": "",
            "helpUrl": "",
            "message0": "por siempre",
            "message1": "hacer %1",
            "args1": [
                {
                    "type": "input_statement",
                    "name": "DO",
                }
            ],
            "nextStatement": null,
            "style": "robot_control",
        },
        {
            "type": "clock_wait",
            "tooltip": "",
            "helpUrl": "",
            "message0": "esperar %1 milisegundos",
            "args0": [
                {
                    "type": "input_value",
                    "name": "TIME",
                    "check": "Number"
                },
            ],
            "previousStatement": null,
            "nextStatement": null,
            "style": "robot_blocks"
        }
    ])
    javascriptGenerator.forBlock['robot_set_power'] = function(block: Block, generator: JavascriptGenerator) {
        const side = block.getFieldValue('SIDE');
        // TODO: change Order.ATOMIC to the correct operator precedence strength
        const power = generator.valueToCode(block, 'POWER', Order.ATOMIC);

        return `setMotor("${side}", ${power});\n`;
    }
    javascriptGenerator.forBlock['robot_outside'] = function(block: Block, generator: JavascriptGenerator) {
        return ["isOutside()", Order.NONE];
    }
    javascriptGenerator.forBlock['robot_start'] = function(block: Block, generator: JavascriptGenerator) {
        return "";
    }
    javascriptGenerator.forBlock['robot_loop'] = function(block: Block, generator: JavascriptGenerator) {
        const code = generator.statementToCode(block, 'DO');

        return `function loop() {${code}}`;
    }
    javascriptGenerator.forBlock['robot_pen_down'] = function(block: Block, generator: JavascriptGenerator) {
        return "penState(true);\n";
    }
    javascriptGenerator.forBlock['robot_pen_up'] = function(block: Block, generator: JavascriptGenerator) {
        return "penState(false);\n";
    }
    javascriptGenerator.forBlock['clock_wait'] = function(block: Block, generator: JavascriptGenerator) {
        const time = generator.valueToCode(block, 'TIME', Order.ATOMIC);

        return `wait(${time});\n`;
    }
    javascriptGenerator.forBlock['robot_stop'] = function(block: Block, generator: JavascriptGenerator) {
        return `stop();\n`;
    }

    const theme = Blockly.Theme.defineTheme('modern2', {
        name: 'modern2',
        base: Blockly.Themes.Zelos,
        blockStyles: {
            "robot_blocks": {
                colourPrimary: "#ff6c03"
            },
            "robot_control": {
                colourPrimary: "#414088"
            }
        },
        categoryStyles: {
            "robot_category": {
                colour: "#ff6c03"
            }
        },
        fontStyle: {
            family: 'Inter',
        },
        startHats: true
    })
    
    workspace = Blockly.inject(blocklyWrapper!, { theme, toolbox, renderer: "zelos" })

    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener(() => {
        updating = true

        code = javascriptGenerator.workspaceToCode(workspace)
        value = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
    })
})

$effect(() => {
    const blocklyState = JSON.parse(value)
    const u = untrack(() => updating)
    if (!u && blocklyState) {
        Blockly.Events.disable()
        Blockly.serialization.workspaces.load(blocklyState, workspace);
        code = javascriptGenerator.workspaceToCode(workspace)
        Blockly.Events.enable()
    }
    updating = false;
})
</script>

<div class="wrapper" bind:this={blocklyWrapper}></div>

<xml bind:this={toolbox} xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
    <category name="Lógica" categorystyle="logic_category">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>
    <category name="Robotito" categorystyle="robot_category">
        <block type="robot_start"></block>
        <block type="robot_loop"></block>
        <block type="robot_set_power">
            <value name="POWER">
              <shadow type="math_number">
                <field name="NUM">100</field>
              </shadow>
            </value>
        </block>
        <block type="robot_set_power">
            <field name="SIDE">RIGHT</field>
            <value name="POWER">
              <shadow type="math_number">
                <field name="NUM">100</field>
              </shadow>
            </value>
        </block>
        <block type="robot_stop"></block>
        <block type="clock_wait">
            <value name="TIME">
              <shadow type="math_number">
                <field name="NUM">1000</field>
              </shadow>
            </value>
        </block>
        <block type="robot_outside"></block>
        <block type="robot_pen_down"></block>
        <block type="robot_pen_up"></block>
      </category>
    <category name="Bucles" categorystyle="loop_category">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_whileUntil"></block>
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach"></block>
      <block type="controls_flow_statements"></block>
    </category>
    <category name="Cálculos" categorystyle="math_category">
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant"></block>
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list"></block>
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float"></block>
      <block type="math_atan2">
        <value name="X">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="Y">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Texto" categorystyle="text_category">
      <block type="text"></block>
      <block type="text_join"></block>
      <block type="text_append">
        <value name="TEXT">
          <shadow type="text"></shadow>
        </value>
      </block>
      <block type="text_length">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_isEmpty">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <block type="text_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">texto</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_charAt">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">texto</field>
          </block>
        </value>
      </block>
      <block type="text_getSubstring">
        <value name="STRING">
          <block type="variables_get">
            <field name="VAR">texto</field>
          </block>
        </value>
      </block>
      <block type="text_changeCase">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_trim">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_prompt_ext">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Listas" categorystyle="list_category">
      <block type="lists_create_with">
        <mutation items="0"></mutation>
      </block>
      <block type="lists_create_with"></block>
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length"></block>
      <block type="lists_isEmpty"></block>
      <block type="lists_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">lista</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">lista</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">lista</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">lista</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort"></block>
    </category>
    <sep></sep>
    <category name="Variables" categorystyle="variable_category" custom="VARIABLE"></category>
    <category name="Funciones" categorystyle="procedure_category" custom="PROCEDURE"></category>
  </xml>

<style>
:global{
  svg[display="none"] {
    display: none;
  }
  .blocklyMainBackground {
    stroke: none !important;
  }
  .blocklyTreeRow {
    height: auto;
    margin: 0 4px 4px 4px;
    border-radius: 4px;
  }
  .blocklyTreeLabel {
  	font: inherit
  }
}


.wrapper {
  width: 100%;
  height: 100%;
}
</style>
