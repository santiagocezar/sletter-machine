import { type Robot, ringBorder, ringRadius } from "./control.svelte";

export function attachCanvas(canvas: HTMLCanvasElement, paintCanvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;
    const paintCtx = paintCanvas.getContext("2d")!;
    
    const w = paintCanvas.width;
    const h = paintCanvas.height;
    
    
    function render(robot: Robot, prevX: number, prevY: number) {
        const w = paintCanvas.width;
        const h = paintCanvas.height;

        const x = robot.positionX + w / 2;
        const y = robot.positionY + h / 2;

        ctx.clearRect(0, 0, w, h)

        // ring
        ctx.fillStyle = "444";
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, ringRadius + ringBorder + 1, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "#ededed";
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, ringRadius + ringBorder, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "#444";
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, ringRadius, 0, 2 * Math.PI)
        ctx.fill()
        
        ctx.drawImage(paintCanvas, 0, 0, w, h)
        

        if (robot.penDown) {
            paintCtx.strokeStyle = "#ff0044ff";
            paintCtx.lineWidth = 3;
            paintCtx.beginPath()
            paintCtx.moveTo(prevX + w / 2, prevY + h / 2)
            paintCtx.lineTo(x, y)
            paintCtx.stroke()
        }

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(robot.rotation)
        ctx.translate(-x, -y)

        ctx.fillStyle = "#ffaa10";
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(x, y + robot.axisWidth / 2);
        ctx.lineTo(x, y - robot.axisWidth / 2);
        ctx.lineTo(x + robot.length / 2, y - robot.axisWidth / 2);
        ctx.lineTo(x + robot.length, y);
        ctx.lineTo(x + robot.length / 2, y + robot.axisWidth / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#111122";
        ctx.fillRect(x - 10, y - robot.axisWidth / 2 - 5, 20, 10);
        ctx.fillRect(x - 10, y + robot.axisWidth / 2 - 5, 20, 10);
        ctx.fillStyle = robot.isOnBorder() ? "lime" : "darkred";
        ctx.beginPath()
        ctx.arc(x + robot.length / 2, y, 4, 0, 2 * Math.PI)
        ctx.fill()
        ctx.restore()
    }

    return render
}
