import {LineBreakTransformer} from "./lineBreakTransformer";
import * as ThrusterProtocol from "./trusterProtocol";
import {
    DSS1,
    DSS2, positionVelocityAndAccelerationCommand,
    queryDeviceStatusCommand,
    resetAlarm
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

    constructor(private readonly port: SerialPort) {
    }


    public async move(): Promise<void> {
        await this.write(positionVelocityAndAccelerationCommand(Math.round(Math.random() * 18000), Math.round(10000 + Math.random() * 20000), Math.round(Math.random() * 30 + 1), 10))
    }

    public async home(): Promise<void> {
        await this.write(":0105040B0000EB\r\n"); // HOME Home Return Start (0000)
        console.info("response: " + await this.readOnce());
        await this.wait(10);
        await this.write(":0105040BFF00EC\r\n"); // HOME Home Return End (FF00)
        console.info("response: " + await this.readOnce());

        await this.wait(200);

        await this.write(queryDeviceStatusCommand());
        console.info("status: " + await this.readOnce());

    }

    private readonly encoder = new TextEncoder();
    private writer: WritableStreamDefaultWriter<Uint8Array> | undefined = undefined;
    private reader: ReadableStreamDefaultReader<string> | undefined = undefined;
    private flushableTransformer: LineBreakTransformer | undefined = undefined;


    public async init(): Promise<void> {
        await this.port.open(Thruster.SERIAL_OPTIONS);
        this.writer = this.port.writable!.getWriter();
        this.flushableTransformer = new LineBreakTransformer();
        this.reader = this.port.readable!
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(new TransformStream(this.flushableTransformer))
            .getReader();

        console.info("port opened");
        await this.wait(10);
        await this.write(resetAlarm()[0]); // ALRS Alarm reset command
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        await this.write(resetAlarm()[1]); // ALRS Alarm reset command  (2)
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        await this.write(":01050427FF00D0\r\n"); // PMSL PIO/Modbus Switching Setting (Enable Modus commands)
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        await this.write(":01050403FF00F4\r\n"); // SON Servo ON/OFF  Servo ON (FF00)
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        await this.write(":0105040B0000EB\r\n"); // HOME Home Return Start (0000)
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        await this.write(":0105040BFF00EC\r\n"); // HOME Home Return End (FF00)
        console.info("response: " + await this.readOnce());
        await this.wait(20);
        //await this.write(ThrusterProtocol.queryDeviceStatusCommand());
        //await this.wait(10);
        console.info("Started Homing. Waiting for homing to complete...");

        const response = await this.queryResponseWithRetry(ThrusterProtocol.queryDeviceStatusCommand(),
            (r) => {
                const parsedDeviceStatusReponse = ThrusterProtocol.parseDeviceStatusResponse(r);
                return parsedDeviceStatusReponse.dss1.has(ThrusterProtocol.DSS1.HEND) ? parsedDeviceStatusReponse : undefined
            }, 8, 1000);

        this.deviceStatusRegister1 = response.dss1;
        this.deviceStatusRegister2 = response.dss2;
        console.info("Waited for homing completed.")

    }

    private async readOnce(): Promise<string | undefined> {
        const res = await this.reader!.read();
        return res.value;
    }

    private async queryResponseWithRetry<T>(query: string, responseExtractor: (a: string) => T | undefined, retryCount: number | undefined = undefined, retryInterval: number | undefined = undefined): Promise<T> {

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

    /***
     * @param cmd the command without LRC check and leading colon.
     */
    private async write(cmd: string): Promise<void> {
        console.info("writing cmd: " + cmd);
        await this.writer!.write(this.encoder.encode(cmd));
    }

    private async writeRTU(cmd: ArrayBufferLike): Promise<void> {
        const uint8Array = new Uint8Array(cmd);
        function buf2hex() : string {
            return [...uint8Array].map((x:number) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        console.info("writing cmd: " + buf2hex());
        await this.writer!.write(uint8Array);
    }

    private async wait(ms: number) {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

}
