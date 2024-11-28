import Interpreter from "js-interpreter";

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

    positionX = 0;
    positionY = 0;

    // not local because of the render func @ rendering.ts
    speedX = 0;
    speedY = 0;

    rotation = 0;
    axisWidth = 50;
    length = 60;

    waiting = 0;

    outside = false;

    penDown = false;
    

    wait(ms: number) {
        this.waiting = ms / 1000
    }

    isWaiting() {
        return this.waiting > 0
    }

    step(dt: number) {
        if (this.isWaiting())
            this.waiting -= dt

        this.speedL += this.powerL / 10 * dt * 60;
        this.speedR += this.powerR / 10 * dt * 60;

        this.rotation += (this.speedL - this.speedR) / this.axisWidth * dt * 60;

        const speedMagnitude = (this.speedL + this.speedR) / 2 * dt * 60;

        this.speedL *= Math.pow(.25, dt);
        this.speedR *= Math.pow(.25, dt);

        this.speedX = speedMagnitude * Math.cos(this.rotation);
        this.speedY = speedMagnitude * Math.sin(this.rotation);

        this.positionX += this.speedX;
        this.positionY += this.speedY;
    }

    setMotor(side: "LEFT" | "RIGHT", power: number) {
        if (side == "LEFT") this.powerL = power / 100
        else this.powerR = power / 100
    }

    stop() {
        this.powerL = 0;
        this.powerR = 0;
    }


    penState(state: boolean) {
        this.penDown = state;
    }
    
    isOutside() {
        return this.outside
    }
    
    isOnBorder() {
        const r2BorderStart = ringRadius ** 2;
        const r2BorderEnd = (ringRadius + ringBorder) ** 2;
        const r2Robot = this.positionX ** 2 + this.positionY ** 2;
        
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

    constructor(forRobot: Robot) {
        this.robot = forRobot
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
        bindFn("penState")
        bindFn("isOutside")
        bindFn("wait")
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
