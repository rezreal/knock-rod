import {
    CTLF,
    DSS1,
    homeReturn,
    numericalValueMovementCommand, parseQueryStatusRegisterResponse,
    pioModbusOnCommand, queryStatusRegisters,
    resetAlarm,
    servoOnCommand
} from "./knockRodProtocol";
import {Task, TaskTimer} from 'tasktimer';
import {Mutex, withTimeout} from "async-mutex";
import {KnockRodParams, KnockRodState} from "./knockRodState";


export interface ConnectedEvent extends CustomEvent<{}> {
    readonly type: 'connected'
}

export interface ReadyEvent extends CustomEvent<{}> {
    readonly type: 'ready'
}

export interface StateChangeEvent extends CustomEvent<{ oldState: KnockRodState, state: KnockRodState }> {
    readonly type: 'stateChange'
}


export interface PalmDownButtonEvent extends CustomEvent<{ oldState: KnockRodState, state: KnockRodState }> {
    readonly type: 'palmdown'
}

export interface PalmUpButtonEvent extends CustomEvent<{ oldState: KnockRodState, state: KnockRodState }> {
    readonly type: 'palmup'
}


export enum ShockRodSize {
    FourInch = 100,
    SixInch = 150,
    EightInch = 200,
    TenInch = 250,
    TwelveInch = 300
}


interface ThrusterEventHandlersEventMap {
    "connected": ConnectedEvent;
    "stateChange": StateChangeEvent;
    "ready": ReadyEvent;
    "palmdown": PalmDownButtonEvent;
    "palmup": PalmUpButtonEvent;
}

export class KnockRod extends DocumentFragment {

    /**
     *  Silent interval: 9600 bps, (10 × 3.5) bits × 1/19200 bps = 1.823ms ~= 2
     */
    public static readonly silentInterval: number = 2;

    public static readonly SERIAL_OPTIONS: SerialOptions = {
        baudRate: 19200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
    }

    private _state: KnockRodState | undefined = undefined

    private params: KnockRodParams;


    public get state(): KnockRodState | undefined {
        return this._state;
    }

    private updateState(updater: (old: KnockRodState) => KnockRodState) {
        const oldState = this._state || {
            deviceStatusRegister1: new Set(),
            deviceStatusRegister2: new Set(),
            expansionDeviceStatus: new Set(),
            systemStatusRegister: new Set(),
            currentPosition: 0,
            input: 0,
        };
        this._state = updater(oldState);


        if ((this._state.input & 0x0001) === 1) {
            this.dispatchEvent(new CustomEvent('palmdown') as PalmDownButtonEvent);
        } else if ((this._state.input & 0x0001) === 0 && (oldState.input & 0x0001) === 1) {
            this.dispatchEvent(new CustomEvent('palmup') as PalmUpButtonEvent);
        }

        this.dispatchEvent(new CustomEvent('stateChange', {detail: {oldState, state: this._state}}) as StateChangeEvent);
    }



    constructor(private readonly port: SerialPort, private readonly size: ShockRodSize, params?: KnockRodParams) {
        super();
        this.params = params || { maxDepth: size*100, speed: 1000 }
    }

    public async resetAlarm(): Promise<void> {
        const release = await withTimeout(this.mutex, 100).acquire();
        try {
            await this.writeBytes(resetAlarm[0]); // ALRS Alarm reset command
            console.info("response: " + KnockRod.toHex(await this.readBytes(resetAlarm[0].byteLength)));
            await this.wait(20);
            await this.writeBytes(resetAlarm[1]); // ALRS Alarm reset command  (2)
            console.info("response: " + KnockRod.toHex(await this.readBytes(resetAlarm[0].byteLength)));
        } finally {
            release();
        }
    }

    public async moveRetract(): Promise<void> {
        this.timer.add(new Task({
            id: "task-move-retract",
            totalRuns: 1,
            removeOnCompleted: true,
            callback: () => this.queryAwaitResponseWithRetry(numericalValueMovementCommand(
                100,
                10,//10,
                30000,
                30,
                0, //51,
                []), 8, (a) => a, 1, 0)
        }));
        return Promise.resolve();
    }

    public async moveTo(targetPos:number): Promise<void> {
        await this.mutex.runExclusive(async () => {
            await this.writeBytes(numericalValueMovementCommand(
                Math.min(this.params.maxDepth, targetPos),
                10,//10,
                this.params.speed,
                30,
                0,//51, //51,
                []));
            console.info("response: " + KnockRod.toHex(await this.readBytes(homeReturn[0].byteLength)));
        })
    }

    public async moveSimple(): Promise<void> {
        await this.mutex.runExclusive(async () => {
            await this.writeBytes(numericalValueMovementCommand(
                20000,
                10,//10,
                30000,
                20,
                0,//51, //51,
                []));
            console.info("response: " + KnockRod.toHex(await this.readBytes(homeReturn[0].byteLength)));
        })
    }

    public async move2(): Promise<void> {
        await this.mutex.runExclusive(async () => {
            await this.writeBytes(numericalValueMovementCommand(
                150,
                -15000,//10,
                5000,
                20,
                35,//51, //51,
                [CTLF.PUSH]));
            console.info("response: " + KnockRod.toHex(await this.readBytes(homeReturn[0].byteLength)));
        })
    }

    /**
     * Homing may take up to 10 seconds
     */
    public async home(): Promise<void> {
        const release = await withTimeout(this.mutex, 100).acquire();
        try {
            await this.writeBytes(homeReturn[0]);
            console.info("response: " + KnockRod.toHex(await this.readBytes(homeReturn[0].byteLength)));
            await this.wait(KnockRod.silentInterval);
            await this.writeBytes(homeReturn[1]);
            console.info("response: " + KnockRod.toHex(await this.readBytes(homeReturn[0].byteLength)));
        } finally {
            release()
        }
        // let the homing status status settle
        await this.wait(200);
        // wait for up to 12 seconds for homing to become complete
        try {
            await this.waitUntil(12000, () => this.state?.deviceStatusRegister1.has(DSS1.HEND) || false);
        } catch (e) {
            throw new Error("Homing was not successful, waited for 12 seconds");
        }

    }


    public addEventListener<K extends keyof ThrusterEventHandlersEventMap>(type: K, listener: ((evt: ThrusterEventHandlersEventMap[K]) => any) | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        super.addEventListener(type as string, listener as (evt: Event) => any, options);
    }

    /*
    public removeEventListener<K extends keyof ThrusterEventHandlersEventMap>(type: K, listener: (this: KnockRod, ev: ThrusterEventHandlersEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        super.removeEventListener(type, listener, options)
    }
    */


    private writer: WritableStreamDefaultWriter<Uint8Array> | undefined = undefined;
    private reader: ReadableStreamDefaultReader<Uint8Array> | undefined = undefined;


    private readonly timer = new TaskTimer(80);
    private readonly mutex = new Mutex();

    public setParams(params: KnockRodParams) {
        this.params = {...params}
    }

    public async setServo(on: boolean) {
        console.info("setting servo " + (on ? 'on' : 'off'));
        const release = await withTimeout(this.mutex, 100).acquire();
        try {
            await this.writeBytes(servoOnCommand(on)); // SON Servo ON/OFF  Servo ON (FF00)
            console.info("response: " + KnockRod.toHex(await this.readBytes(servoOnCommand(on).byteLength)));
        } finally {
            release();
        }
    }

    public async init(): Promise<void> {

        await this.port.open(KnockRod.SERIAL_OPTIONS);
        this.writer = this.port.writable!.getWriter();
        this.reader = this.port.readable!.getReader();

        await this.resetAlarm();

        const release = await withTimeout(this.mutex, 100).acquire();
        try {
            await this.writeBytes(pioModbusOnCommand); // PMSL PIO/Modbus Switching Setting (Enable Modus commands)
            console.info("response: " + KnockRod.toHex(await this.readBytes(pioModbusOnCommand.byteLength)));
        } finally {
            release();
        }

        await this.setServo(true);

        //await this.writeBytes(ThrusterProtocol.queryDeviceStatusCommand());
        //await this.wait(10);

        await this.queryStatusRegister();

        dispatchEvent(new CustomEvent('connected', {}) as ConnectedEvent);

        // schedule status polling
        this.timer.add(new Task({
            id: "task-poll-status",
            tickInterval: 1,
            removeOnCompleted: false,
            callback: (_task: Task) => this.queryStatusRegister().catch((e) => {
                console.log("Status query polling failed. Stopping now.", e);
                _task.enabled = false;
            })
        }));


        // home if necessary
        if (!this.state?.deviceStatusRegister1.has(DSS1.HEND)) {
            console.info("Started Homing. Waiting for homing to complete...");
            await this.home();

            console.info("Waited for homing completed.")
        }

        this.timer.start();

        dispatchEvent(new CustomEvent('ready', {}) as ReadyEvent
        );




        console.info("Initialize complete.")

    }

    private async queryStatusRegister() {
        return this.queryAwaitResponseWithRetry(queryStatusRegisters,
            25,
            (r) => parseQueryStatusRegisterResponse(r)
            , 1, 0).then((r) => {
            this.updateState((old) => ({
                ...old,
                currentPosition: r.pnow,
                expansionDeviceStatus: r.dsse,
                deviceStatusRegister1: r.dss1,
                deviceStatusRegister2: r.dss2,
                systemStatusRegister: r.stat,
                input: r.dipm
            }));
            return r;
        })
    }

    private static joinArr(a: readonly Uint8Array[]): Uint8Array {
        if (a.length === 1) {
            return a[0];
        } else {
            const totalLength = new Int8Array(a.reduce((akk, nxt) => akk + nxt.length, 0));
            const resArray = new Uint8Array(totalLength);
            let length = 0;
            for (let array of a) {
                resArray.set(array, length);
                length += array.length;
            }
            return resArray;
        }
    }


    /**
     * Retries query until it is followed by a response matched by the responseExtractor (emitting a non undefined value).
     * @param query the command to execute on each retry.
     * @param responseSize the size of the response that is expected.
     * @param responseExtractor response matcher that should extract only a value when it matches. If it fails it should return undefined.
     * @param retryCount How often should the query be retried.
     * @param retryInterval How much time should be waited between different query attempts.
     */
    private async queryAwaitResponseWithRetry<T>(query: ArrayBufferLike, responseSize: number, responseExtractor: (a: Uint8Array) => T | undefined, retryCount: number | undefined = undefined, retryInterval: number | undefined = undefined): Promise<T> {
        const actualRetryCount = retryCount || 3;
        const actualRetryInterval = retryInterval || 100;
        const actualReadTimeout = 100;

        for (let i = 0; i < actualRetryCount; ++i) {
            const releaser = await withTimeout(this.mutex, 200).acquire();
            try {
                await this.writeBytes(query);

                const readResponse = await Promise.any([this.readBytes(responseSize), this.wait(actualReadTimeout).then(() => undefined)]);

                let extracted: T | undefined;
                try {
                    extracted = readResponse ? responseExtractor(readResponse) : undefined;
                } catch (e) {
                    //console.log("response extractor failed with: " + e)
                    extracted = undefined;
                }

                if (extracted !== undefined) {
                    return extracted;
                } else {
                    console.log("response extractor failed for response: " + readResponse)
                }
            } finally {
                releaser();
            }
            await this.wait(actualRetryInterval);
        }
        throw new Error("Retried " + actualRetryCount + " but failed to accept response.");

    }

    private static toHex(buf: Uint8Array | undefined): string | undefined {
        if (buf === undefined) {
            return undefined;
        }
        return [...buf].map((x: number) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    private async readBytes(expectedBytes: number): Promise<Uint8Array | undefined> {
        let reads: Uint8Array[] = [];
        let readBytes: number = 0;

        while (readBytes < expectedBytes) {
            const res = await this.reader!.read();
            if (res.done) {
                break;
            } else {
                readBytes += res.value!.length;
                reads.push(res.value!);
            }
        }

        return KnockRod.joinArr(reads);
    }

    private async writeBytes(cmd: ArrayBufferLike): Promise<void> {
        const uint8Array = new Uint8Array(cmd);

        await this.writer!.write(uint8Array);
    }

    private async wait(ms: number) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }


    private async waitUntil(ms: number, test: () => boolean, periodMs: number = 100) {
        const until = new Date().getTime() + ms;
        while (!test()) {
            await this.wait(periodMs);
            if (new Date().getTime() > until) {
                throw new Error(`Waited for ${test} for ${ms}ms.`);
            }
        }

    }

}
