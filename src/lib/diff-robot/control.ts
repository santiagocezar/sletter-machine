import Interpreter from "js-interpreter";

export class Robot {
    powerL = 0;
    powerR = 0;

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

    penDown = false;

    step() {
        this.speedL += this.powerL / 10;
        this.speedR += this.powerR / 10;

        this.rotation += (this.speedL - this.speedR) / this.axisWidth;

        const speedMagnitude = (this.speedL + this.speedR) / 2;

        this.speedX = speedMagnitude * Math.cos(this.rotation);
        this.speedY = speedMagnitude * Math.sin(this.rotation);

        this.positionX += this.speedX;
        this.positionY += this.speedY;

        this.speedL *= .95;
        this.speedR *= .95;
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

    reset() {
        this.stop();

        this.positionX = 0;
        this.positionY = 0;

        this.speedL = 0;
        this.speedR = 0;

        this.rotation = 0;
    }
}

export class CodeRunner {
    robot: Robot
    interpreter: Interpreter | null = null;
    callback = () => {}

    constructor(forRobot: Robot) {
        this.robot = forRobot
    }

    initApi = (interpreter: Interpreter, globalObject: any) => {
        interpreter.setProperty(
            globalObject, 'setMotor',
            interpreter.createNativeFunction(
                this.robot.setMotor.bind(this.robot)
            ));
        interpreter.setProperty(
            globalObject, 'stop',
            interpreter.createNativeFunction(
                this.robot.stop.bind(this.robot)
            ));

        interpreter.setProperty(
            globalObject, 'penState',
            interpreter.createNativeFunction(
                this.robot.penState.bind(this.robot)
            ));

        const wait = interpreter.createAsyncFunction(
            function (time: number, cb: () => void) {
                // Delay the call to the callback.
                setTimeout(cb, time);
            },
        );
        interpreter.setProperty(globalObject, 'wait', wait);
    }

    runCode(code: string) {
        this.interpreter = new Interpreter(code, this.initApi);
    }

    stop() {
        this.interpreter = null;
        this.callback()
    }

    step(): boolean {
        if (this.interpreter && !this.interpreter.run()) {
            console.log("Finalizó la ejecución del código")
            this.stop();
            return false;
        }
        return true;
    }
    isRunning(): boolean {
        return this.interpreter != null;
    }
}
