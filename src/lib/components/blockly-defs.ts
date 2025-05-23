import { Order } from "blockly/javascript";
import type { GeneratorsFor } from "./blockly-init";

export { default as TOOLBOX } from "./toolbox.xml?raw" 

export const BLOCKS = [
    {
        type: "robot_set_power",
        tooltip: "Enciende un motor para que ejerza cierta fuerza.",
        helpUrl: "",
        message0: "fuerza motor %1 al %2%%",
        args0: [
            {
                type: "field_dropdown",
                name: "SIDE",
                options: [
                    ["izquierdo", "LEFT"],
                    ["derecho", "RIGHT"],
                ],
            },
            {
                type: "input_value",
                name: "POWER",
                check: "Number",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
    {
        type: "robot_stop",
        tooltip:
            "Apaga todos los motores del robot y espera a que se detenga por completo antes de continuar.",
        helpUrl: "",
        message0: "apagar motores",
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
    {
        type: "robot_full_stop",
        tooltip:
            "Apaga todos los motores del robot y espera a que se detenga por completo antes de continuar.",
        helpUrl: "",
        message0: "apagar motores y esperar",
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
    {
        type: "robot_outside",
        tooltip:
            "Verdadero si el robot se encuentra fuera de la pantalla.",
        helpUrl: "",
        message0: "¿está afuera?",
        output: "Boolean",
        style: "robot_blocks",
    },
    {
        type: "robot_borderline",
        tooltip:
            'Verdadero si el robot se encuentra sobre el borde blanco del "ring".',
        helpUrl: "",
        message0: "¿está al borde?",
        output: "Boolean",
        style: "robot_blocks",
    },
    {
        type: "robot_pen_down",
        tooltip: "Activa el dibujo.",
        helpUrl: "",
        message0: "bajar lapiz",
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
    {
        type: "robot_pen_up",
        tooltip: "Desactiva el dibujo.",
        helpUrl: "",
        message0: "subir lapiz",
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
    {
        type: "robot_start",
        tooltip:
            "Ejecuta el siguiente código solamente al iniciar el programa.",
        helpUrl: "",
        message0: "al inicio",
        nextStatement: null,
        style: "robot_control",
    },
    {
        type: "robot_loop",
        tooltip:
            "Ejecuta el siguiente código repetidas veces hasta que se detenga el programa.",
        helpUrl: "",
        message0: "por siempre",
        message1: "%1",
        args1: [
            {
                type: "input_statement",
                name: "DO",
            },
        ],
        nextStatement: null,
        style: "robot_control",
    },
    {
        type: "clock_wait",
        tooltip:
            "Suspende la ejecución durante una determinada cantidad de tiempo.",
        helpUrl: "",
        message0: "esperar %1 milisegundos",
        args0: [
            {
                type: "input_value",
                name: "TIME",
                check: "Number",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: "robot_blocks",
    },
] as const;

export const GENERATORS: GeneratorsFor<typeof BLOCKS> = {
    robot_set_power(block, generator) {
        const side = block.getFieldValue("SIDE");
        // TODO: change Order.ATOMIC to the correct operator precedence strength
        const power = generator.valueToCode(block, "POWER", Order.ATOMIC);

        return `setMotor("${side}", ${power});\n`;
    },
    robot_outside(block, generator) {
        return ["isOutside()", Order.NONE];
    },
    robot_borderline(block, generator) {
        return ["isOnBorder()", Order.NONE];
    },
    robot_start(block, generator) {
        return "";
    },
    robot_loop(block, generator) {
        const code = generator.statementToCode(block, "DO");

        return `function loop() {${code}}`;
    },
    robot_pen_down(block, generator) {
        return "penState(true);\n";
    },
    robot_pen_up(block, generator) {
        return "penState(false);\n";
    },
    clock_wait(block, generator) {
        const time = generator.valueToCode(block, "TIME", Order.ATOMIC);

        return `wait(${time});\n`;
    },
    robot_stop(block, generator) {
        return `stop();\n`;
    },
    robot_full_stop(block, generator) {
        return `fullStop();\n`;
    },
}
