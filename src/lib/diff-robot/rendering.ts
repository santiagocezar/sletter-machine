import type { Robot } from "./control";

export function attachCanvas(canvas: HTMLCanvasElement, paintCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    const paintCtx = paintCanvas.getContext("2d")!;

    function render(robot: Robot) {
        const w = paintCanvas.width;
        const h = paintCanvas.height;

        const x = robot.positionX + w / 2;
        const y = robot.positionY + h / 2;

        ctx.clearRect(0, 0, w, h)

        ctx.drawImage(paintCanvas, 0, 0, w, h)

        if (robot.penDown) {
            paintCtx.beginPath()
            paintCtx.moveTo(x - robot.speedX, y - robot.speedY)
            paintCtx.lineTo(x, y)
            paintCtx.stroke()
        }

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(robot.rotation)
        ctx.translate(-x, -y)

        ctx.fillStyle = "#ffaa10";
        ctx.fillRect(x, y - robot.axisWidth / 2, robot.length / 2, robot.axisWidth);
        ctx.beginPath();
        ctx.moveTo(x + robot.length / 2, y - robot.axisWidth / 2);
        ctx.lineTo(x + robot.length, y);
        ctx.lineTo(x + robot.length / 2, y + robot.axisWidth / 2);
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.fillStyle = "#111122";
        ctx.fillRect(x - 10, y - robot.axisWidth / 2 - 5, 20, 10);
        ctx.fillRect(x - 10, y + robot.axisWidth / 2 - 5, 20, 10);
        ctx.restore()
    }

    return render
}
