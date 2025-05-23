import type { Robot } from "./control.svelte";

export function createPencil(robot: Robot, width: number, height: number) {
    let clear = () => {}

    return {
        attach(canvas: HTMLCanvasElement) {
            const ctx = canvas.getContext("2d")!

            ctx.moveTo(width / 2, height / 2)
            ctx.strokeStyle = "#ff0044ff";
            ctx.lineWidth = 3;

            clear = () => {
                ctx.clearRect(0, 0, width, height)
                ctx.beginPath()
                ctx.moveTo(width / 2, height / 2)
            }

            $effect(() => {
                const x = robot.positionX + width / 2;
                const y = robot.positionY + height / 2;
        
                if (robot.penDown) {
                    ctx.lineTo(x, y)
                    ctx.stroke()
                } else {
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                }
            })
        },
        reset() {
            clear()
        }
    }
}