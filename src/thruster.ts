import {
    CTLF,
    DSS1,
    DSS2,
    homeReturn,
    numericalValueMovementCommand,
    parseDeviceStatusResponse,
    pioModbusOnCommand,
    queryDeviceStatusCommand,
    resetAlarm,
    servoOnCommand
} from "./trusterProtocol";

export class Thruster {

    public static readonly SERIAL_OPTIONS: SerialOptions = {
        baudRate: 19200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
    }

    private deviceStatusRegister1: Set<DSS1> = new Set()
    private deviceStatusRegister2: Set<DSS2> = new Set()

    public get status(): ReadonlySet<DSS1> {
        return this.deviceStatusRegister1;
    }


    constructor(private readonly port: SerialPort) {
    }

    public async move(): Promise<void> {
        await this.write(numericalValueMovementCommand(
            100,
            5000,//10,
            30000,
            1,
            0, //51,
            []));
    }

    public async move2(): Promise<void> {
        await this.write(numericalValueMovementCommand(
            14000,
            8000,//10,
            20000,
            30,
             10,//51, //51,
            [CTLF.PUSH]));
    }

    public async home(): Promise<void> {

        await this.write(homeReturn[0]);
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(10);
        await this.write(homeReturn[1]);
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(200);
    }

    private writer: WritableStreamDefaultWriter<Uint8Array> | undefined = undefined;
    private reader: ReadableStreamDefaultReader<Uint8Array> | undefined = undefined;


    public async init(): Promise<void> {
        await this.port.open(Thruster.SERIAL_OPTIONS);
        this.writer = this.port.writable!.getWriter();
        this.reader = this.port.readable!
            .getReader();

        console.info("port opened");
        await this.wait(10);

        await this.write(resetAlarm[0]); // ALRS Alarm reset command
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(20);
        await this.write(resetAlarm[1]); // ALRS Alarm reset command  (2)
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(20);

        await this.write(pioModbusOnCommand); // PMSL PIO/Modbus Switching Setting (Enable Modus commands)
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(20);
        await this.write(servoOnCommand(true)); // SON Servo ON/OFF  Servo ON (FF00)
        console.info("response: " + Thruster.toHex(await this.readOnce()));
        await this.wait(20);

        //await this.write(ThrusterProtocol.queryDeviceStatusCommand());
        //await this.wait(10);
        console.info("Started Homing. Waiting for homing to complete...");

        const r1 = await this.queryAwaitResponseWithRetry(queryDeviceStatusCommand,
            (r) =>  parseDeviceStatusResponse(r), 8, 1000);
        this.deviceStatusRegister1 = r1.dss1;
        this.deviceStatusRegister2 = r1.dss2;

        // home if necessary
        if (!r1.dss1.has(DSS1.HEND)) {

            await this.write(homeReturn[0]); // HOME Home Return Start (0000)
            console.info("response: " + Thruster.toHex(await this.readOnce()));
            await this.wait(20);
            await this.write(homeReturn[1]); // HOME Home Return End (FF00)
            console.info("response: " + Thruster.toHex(await this.readOnce()));
            await this.wait(20);

            const r2 = await this.queryAwaitResponseWithRetry(queryDeviceStatusCommand,
                (r) => {
                    const parsedDeviceStatusResponse = parseDeviceStatusResponse(r);
                    return parsedDeviceStatusResponse.dss1.has(DSS1.HEND) ? parsedDeviceStatusResponse : undefined
                }, 8, 1000);
            this.deviceStatusRegister1 = r2.dss1;
            this.deviceStatusRegister2 = r2.dss2;

        }


        console.info("Waited for homing completed.")

    }

    private async readOnce(): Promise<Uint8Array | undefined> {
        const res = await this.reader!.read();
        return res.value;
    }

    /**
     * Retries query until it is followed by a response matched by the responseExtractor (emitting a non undefined value).
     * @param query the command to execute on each retry.
     * @param responseExtractor response matcher that should extract only a value when it matches. If it fails it should return undefined.
     * @param retryCount How often should the query be retried.
     * @param retryInterval How much time should be waited between different query attempts.
     */
    private async queryAwaitResponseWithRetry<T>(query: ArrayBufferLike, responseExtractor: (a: Uint8Array) => T | undefined, retryCount: number | undefined = undefined, retryInterval: number | undefined = undefined): Promise<T> {

        const actualRetryCount = retryCount || 3;
        const actualRetryInterval = retryInterval || 100;
        const actualReadTimeout = 100;
        for (let i = 0; i < actualRetryCount; ++i) {

            await this.write(query);
            await this.wait(10);
            const readResponse = await Promise.any([this.reader!.read(), this.wait(actualReadTimeout).then(() => undefined)]);
            console.info("read response: " + readResponse?.value, readResponse)

            let extracted: T | undefined;
            try {
                extracted = readResponse?.value ? responseExtractor(readResponse.value) : undefined;
            } catch (e) {
                console.log("response extractor failed with: " + e)
                extracted = undefined;
            }

            if (extracted !== undefined) {
                return extracted;
            } else {
                console.log("response extractor failed for response: " + readResponse?.value)
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

    private async write(cmd: ArrayBufferLike): Promise<void> {
        const uint8Array = new Uint8Array(cmd);
        console.info("writing cmd: 0x" + Thruster.toHex(uint8Array));
        await this.writer!.write(uint8Array);
    }

    private async wait(ms: number) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }
}
