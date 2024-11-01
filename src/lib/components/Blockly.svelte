<script lang="ts">
import * as Blockly from 'blockly/core'
import * as es from 'blockly/msg/es'
import * as libraryBlocks from 'blockly/blocks';
import { javascriptGenerator, Order, type JavascriptGenerator } from 'blockly/javascript';
import blocks from './every_blocks.json'
import type { Workspace, Block } from 'blockly';

interface Props {
    oncodechange: (code: string) => void; 
}

const { oncodechange }: Props = $props()

let blocklyWrapper: HTMLElement | undefined = $state()
let toolbox: XMLDocument | undefined = $state()

let workspace: Workspace
let code: string = $state("")

$effect(() => {
    Blockly.setLocale(es as any)
    Blockly.defineBlocksWithJsonArray([
        {
            "type": "motor_set_power",
            "tooltip": "",
            "helpUrl": "",
            "message0": "motor %1 al %2",
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
            "colour": 30
        }
    ])
    javascriptGenerator.forBlock['motor_set_power'] = function(block: Block, generator: JavascriptGenerator) {
        const side = block.getFieldValue('SIDE');
        // TODO: change Order.ATOMIC to the correct operator precedence strength
        const power = generator.valueToCode(block, 'POWER', Order.ATOMIC);

        return `setMotor("${side}", ${power})`;
    }

    workspace = Blockly.inject(blocklyWrapper!, { toolbox })
    
    workspace.addChangeListener(() => {
        console.timeLog("gola")
        code = javascriptGenerator.workspaceToCode(workspace)
        oncodechange(code)
    })
})
</script>

<div bind:this={blocklyWrapper}></div>

<xml bind:this={toolbox} xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
    <category name="Lógica" colour="%&lcub;BKY_LOGIC_HUE&rcub;">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null"></block>
      <block type="logic_ternary"></block>
    </category>
    <category name="Robotito" colour="30">
        <block type="motor_set_power">
            <value name="POWER">
              <shadow type="math_number">
                <field name="NUM">100</field>
              </shadow>
            </value>
        </block>
        <block type="motor_set_power">
            <value name="SIDE">
            </value>
            <value name="POWER">
              <shadow type="math_number">
                <field name="NUM">100</field>
              </shadow>
            </value>
        </block>
      </category>
    <category name="Bucles" colour="%&lcub;BKY_LOOPS_HUE&rcub;">
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
    <category name="Cálculos" colour="%&lcub;BKY_MATH_HUE&rcub;">
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
    <category name="Texto" colour="%&lcub;BKY_TEXTS_HUE&rcub;">
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
    <category name="Listas" colour="%&lcub;BKY_LISTS_HUE&rcub;">
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
    <category name="Variables" colour="%&lcub;BKY_VARIABLES_HUE&rcub;" custom="VARIABLE"></category>
    <category name="Funciones" colour="%&lcub;BKY_PROCEDURES_HUE&rcub;" custom="PROCEDURE"></category>
  </xml>