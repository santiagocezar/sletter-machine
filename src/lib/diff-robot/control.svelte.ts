//@ts-expect-error
import Interpreter from "js-interpreter";

const ANGULAR_ACCEL = 6
// const ANGULAR_ACCEL = 12
const SPEED_MULT = 60

const DRAG = 0.25
const FRICTION = 1
// const FRICTION = 4



export const ringRadius = 120;
export const ringBorder = 10;

export class Robot {
    // this is tied to svelte's state because
    // it's fun to see the joystick move by it's
    // own when executing.
    powerL = $state(0);
    powerR = $state(0);

    speedL = 0;
    speedR = 0;

    positionX = $state(0);
    positionY = $state(0);

    // not local because of the render func @ rendering.ts
    speedX = 0;
    speedY = 0;

    rotation = $state(0);
    axisWidth = 50;
    length = 60;

    waiting = 0;
    
    waitingToStop = false;

    outside = false;

    penDown = false;
    

    wait(ms: number) {
        this.waiting = ms / 1000
    }

    isWaiting() {
        if (this.waitingToStop) {
            return (
                this.waitingToStop = Math.abs(this.speedL) + Math.abs(this.speedR) > 0.01
            )
        }

        return this.waiting > 0
    }

    /**
     * Make the robot tick
     * @param dt time since last frame in seconds
     * @returns the actual duration of the tick, for partial frames
     */
    step(dt: number): number {
        if (this.waiting > 0) {
            if (this.waiting < dt) {
                dt = this.waiting
                this.waiting = 0    
            } else {
                this.waiting -= dt
            }
        }

        this.speedL += this.powerL * dt * ANGULAR_ACCEL;
        this.speedR += this.powerR * dt * ANGULAR_ACCEL;

        this.rotation += (this.speedL - this.speedR) / this.axisWidth * dt * SPEED_MULT;

        const speedMagnitude = (this.speedL + this.speedR) / 2 * dt * SPEED_MULT;

        this.speedL *= Math.pow(DRAG, dt);
        this.speedR *= Math.pow(DRAG, dt);

        this.speedL = Math.sign(this.speedL) * Math.max(0, Math.abs(this.speedL) - FRICTION * dt);
        this.speedR = Math.sign(this.speedR) * Math.max(0, Math.abs(this.speedR) - FRICTION * dt);

        this.speedX = speedMagnitude * Math.cos(this.rotation);
        this.speedY = speedMagnitude * Math.sin(this.rotation);

        this.positionX += this.speedX;
        this.positionY += this.speedY;

        return dt
    }

    setMotor(side: "LEFT" | "RIGHT", power: number) {
        if (side == "LEFT") this.powerL = power / 100
        else this.powerR = power / 100
    }

    stop() {
        this.powerL = 0;
        this.powerR = 0;
    }

    fullStop() {
        this.stop()
        this.waitingToStop = true
    }

    penState(state: boolean) {
        this.penDown = state;
    }
    
    isOutside() {
        return this.outside
    }
    
    isOnBorder() {
        const sensorX = (this.positionX + this.length / 2 * Math.cos(this.rotation))
        const sensorY = (this.positionY + this.length / 2 * Math.sin(this.rotation))
        const r2BorderStart = ringRadius ** 2;
        const r2BorderEnd = (ringRadius + ringBorder) ** 2;
        const r2Robot = sensorX ** 2 + sensorY ** 2;
        
        return r2BorderStart < r2Robot && r2Robot < r2BorderEnd;        
    }

    reset() {
        this.stop();

        this.positionX = 0;
        this.positionY = 0;

        this.speedL = 0;
        this.speedR = 0;

        this.rotation = 0;

        this.waiting = 0;
    }
}

type Methods<T> =
    {
        [K in keyof T]-?: T[K] extends Function ? K : never
    }[keyof T]

export class CodeRunner {
    robot: Robot
    interpreter: Interpreter | null = null;
    callback = () => {}
    highlightCallback: (id: string | null) => void

    constructor(forRobot: Robot, highlightCallback: (id: string | null) => void) {
        this.robot = forRobot
        this.highlightCallback = highlightCallback
    }

    initApi = (interpreter: Interpreter, globalObject: any) => {
        const bindFn = (method: Methods<Robot>) =>
            interpreter.setProperty(
                globalObject, method,
                interpreter.createNativeFunction(
                    this.robot[method].bind(this.robot)
                ));

        bindFn("setMotor")
        bindFn("stop")
        bindFn("fullStop")
        bindFn("penState")
        bindFn("isOutside")
        bindFn("isOnBorder")
        bindFn("wait")

        interpreter.setProperty(
            globalObject, "highlightBlock",
            interpreter.createNativeFunction(
                this.highlightCallback
            ));
    }

    runCode(code: string) {
        this.interpreter = new Interpreter(code, this.initApi);
    }

    stop() {
        this.interpreter = null;
        this.callback()
    }

    step(): boolean {
        if (!this.interpreter)
            return false
        
        if (this.robot.isWaiting())
            return false

        if (!this.interpreter.step()) {
            this.interpreter.appendCode("if(typeof loop == 'function') loop()")
            return false
        }
        return true;
    }
    isRunning(): boolean {
        return this.interpreter != null;
    }
}
