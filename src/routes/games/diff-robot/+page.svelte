<script lang="ts">
let ball: HTMLElement = $state();
let base: HTMLElement = $state();
let canvas: HTMLCanvasElement = $state();
let paintCanvas: HTMLCanvasElement = $state();
let originX = 0, originY = 0;
let powerX = 0, powerY = 0;
let baseSize = 0;
let moving = false;

let speedL = 0, speedR = 0;
let robotX = 0, robotY = 0;
let robotPhi = 0;
let robotWidth = 50;
let robotLength = 60;

const A = 1/2, B = -1/2;
const C = -1/2, D = -1/2;
const IA = 1, IB = -1;
const IC = -1, ID = -1;
// function transform(x: number, y: number): [number, number] {
//     return [
//     ]
// }
// function invTransform(x: number, y: number): [number, number] {
//     return [
//         IA*x+IB*y,
//         IC*x+ID*y,
//     ]
// }


function stopMoving(ev: MouseEvent | TouchEvent) {
    moving = false

    powerX = 0;
    powerY = 0;

    moveBall()
}
function startMoving(ev: MouseEvent | TouchEvent) {
    moving = true
    const clickX = ev.clientX ?? ev.touches[0].clientX
    const clickY = ev.clientY ?? ev.touches[0].clientY

    const rect = base.getBoundingClientRect();
    baseSize = rect.width;
    originX = rect.left;
    originY = rect.top;

    setPowerFromClientPos(clickX, clickY);

    ev.preventDefault()

    /*
    if (doubleClick) {
        angle += 90
        currentPiece.setAttribute("data-angle", angle)

        currentPiece.animate([{
            transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`
        }], {
            duration: 200,
            easing: "cubic-bezier(.01,.68,.23,1.2)",
            fill: "forwards"
        })
    }
    doubleClick = true
    setTimeout(() => doubleClick = false, 200)
    */
}


function keepMoving(ev: MouseEvent | TouchEvent) {
    if (!moving) return;
    const clickX = ev.clientX ?? ev.touches[0].clientX
    const clickY = ev.clientY ?? ev.touches[0].clientY

    setPowerFromClientPos(clickX, clickY);

    ev.preventDefault()

    /*
    if (doubleClick) {
        angle += 90
        currentPiece.setAttribute("data-angle", angle)

        currentPiece.animate([{
            transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`
        }], {
            duration: 200,
            easing: "cubic-bezier(.01,.68,.23,1.2)",
            fill: "forwards"
        })
    }
    doubleClick = true
    setTimeout(() => doubleClick = false, 200)
    */
}

function moveBall() {
    // const x = (A*powerX+B*powerY + 1) / 2 * 100;
    // const y = (C*powerX+D*powerY + 1) / 2 * 100;
    const x = (powerX + 1) / 2 * 100;
    const y = (1 - powerY) / 2 * 100;

    // console.log({tx, ty})
    ball.animate([{
        left: `${x}%`,
        top: `${y}%`,
    }], {
        duration: 0,
        fill: "forwards"
    })
}

function setPowerFromClientPos(x: number, y: number) {
    x = (x - originX) / baseSize * 2 - 1;
    y = (y - originY) / baseSize * 2 - 1;
    // console.log({x, y})
    powerX = IA*x+IB*y, powerY = IC*x+ID*y;

    if (powerX < -1) powerX = -1;
    if (powerX > 1) powerX = 1;
    if (powerY < -1) powerY = -1;
    if (powerY > 1) powerY = 1;

    moveBall()
}

function update(ctx: CanvasRenderingContext2D, paintCtx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.drawImage(paintCanvas, 0, 0, paintCanvas.width, paintCanvas.height)

    speedL += powerX / 10
    speedR += powerY / 10
    robotPhi += (speedL - speedR) / robotWidth;
    const speed = (speedL + speedR) / 2;
    const speedX = speed * Math.cos(robotPhi);
    const speedY = speed * Math.sin(robotPhi);
    speedL *= .95;
    speedR *= .95;
    robotX += speedX;
    robotY += speedY;

    paintCtx.beginPath()
    paintCtx.moveTo(robotX, robotY)
    paintCtx.lineTo(robotX + speedX, robotY + speedY)
    paintCtx.stroke()

    ctx.save()
    ctx.translate(robotX, robotY)
    ctx.rotate(robotPhi)
    ctx.translate(-robotX, -robotY)

    ctx.fillStyle = "#ffaa10";
    ctx.fillRect(robotX, robotY - robotWidth / 2, robotLength / 2, robotWidth);
    ctx.beginPath();
    ctx.moveTo(robotX + robotLength / 2, robotY - robotWidth / 2);
    ctx.lineTo(robotX + robotLength, robotY);
    ctx.lineTo(robotX + robotLength / 2, robotY + robotWidth / 2);
    ctx.lineTo(robotX, robotY);
    ctx.fill();
    ctx.fillStyle = "#111122";
    ctx.fillRect(robotX - 10, robotY - robotWidth / 2 - 5, 20, 10);
    ctx.fillRect(robotX - 10, robotY + robotWidth / 2 - 5, 20, 10);
    ctx.restore()


    requestAnimationFrame(() => update(ctx, paintCtx))
}

$effect(() => {
    robotX = canvas.width / 2;
    robotY = canvas.height / 2;
    update(
        canvas.getContext("2d"),
        paintCanvas.getContext("2d")
    )

})
</script>

<main
    onmousemove={keepMoving}
    ontouchmove={keepMoving}
    onmouseup={stopMoving}
    ontouchstop={stopMoving}
>
	<div class="view-container">
        <canvas style="display: none;" bind:this={paintCanvas} width="640" height="360"></canvas>
        <canvas bind:this={canvas} width="640" height="360"></canvas>
	</div>
	<div
        class="card joystick"
        onmousedown={startMoving}
        ontouchstart={startMoving}
	>
        <div bind:this={base} class="base">
            <div bind:this={ball} class="ball">
            </div>
        </div>
	</div>
</main>


<style lang="less">
.view-container {
    border: 1px solid black;
    width: min-content;
    margin-left: auto;
    margin-right: auto;
    border-radius: 0;
    overflow: visible;
}
.joystick {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 12rem;
    margin: 0 auto;
    .base {
        position: absolute;
        background-color: white;
        inset: 1rem;
        transform: rotate(-45deg) scale(0.707);
        border-radius: .5rem;
        box-shadow: inset -.25rem .25rem .5rem #0004;
        border: 1px solid #0004
    }
    .ball {
        position: absolute;
        pointer-events: none;
        aspect-ratio: 1 / 1;
        width: 20%;
        border-radius: 100%;
        background: radial-gradient(circle at 60% 40%, #f00, #400);
        translate: -50% -50%;
        left: 50%;
        top: 50%;
    }
}
</style>
