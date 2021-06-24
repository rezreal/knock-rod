import {LineBreakTransformer} from "./lineBreakTransformer";
import * as ThrusterProtocol from "./trusterProtocol";



export class Thruster {

    public static readonly SERIAL_OPTIONS: SerialOptions = {
        baudRate: 19200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
    }

    constructor(private readonly port: SerialPort) {
    }

    private createReader() : ReadableStreamDefaultReader<string> | undefined {
        return this.port.readable
            ?.pipeThrough(new TextDecoderStream())
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();
    }

    public async init(): Promise<void> {
        await this.port.open(Thruster.SERIAL_OPTIONS);
        console.info("port opened");
        await this.wait(10);
        await this.write(":01050407FF00F0\r\n"); // ALRS Alarm reset command
        await this.wait(10);
        await this.write(":010504070000EF\r\n"); // ALRS Alarm reset command  (2)
        await this.wait(10);
        await this.write(":01050427FF00D0\r\n"); // PMSL PIO/Modbus Switching Setting (Enable Modus commands)
        await this.wait(10);
        await this.write(":01050403FF00F4\r\n"); // SON Servo ON/OFF  Servo ON (FF00)
        await this.wait(10);
        await this.write(":0105040B0000EB\r\n"); // HOME Home Return Start (0000)
        await this.wait(10);
        await this.write(":0105040BFF00EC\r\n"); // HOME Home Return End (FF00)
        await this.wait(10);
        await this.write(ThrusterProtocol.queryDeviceStatusCommand());
        await this.wait(10);
        console.info("Started Homing. Waiting for homing to complete...");
        await this.queryResponseWithRetry(ThrusterProtocol.queryDeviceStatusCommand(),
            (r) => ThrusterProtocol.parseDeviceStatusResponse(r).dss1.has(ThrusterProtocol.DSS1.HEND) );
        console.info("Waited for homing completed.")

    }


    private async queryResponseWithRetry<T>(query:string, responseExtractor: (a:string) => T | undefined, retryCount: number | undefined = undefined, retryInterval: number | undefined = undefined): Promise<T>{

        const actualRetryCount = retryCount || 3;
        const actualRetryInterval = retryInterval || 100;
        const reader = this.createReader();
        try {
            for (let i = 0; i < actualRetryCount; ++i) {
                await this.write(query);
                await this.wait(10);
                const readResponse = await reader?.read();

                const extracted = readResponse?.value ? responseExtractor(readResponse.value) : undefined;
                if (extracted !== undefined) {
                    return extracted;
                } else {
                    console.log("response extractor " + responseExtractor + " failed for response: " + readResponse)
                }
                await this.wait(actualRetryInterval);
            }
            throw new Error("Retried " + actualRetryCount + " but failed to accept response.");
        } finally {
            reader?.releaseLock();
        }
    }

    /***
     * @param cmd the command without LRC check and leading colon.
     */
    private async write(cmd: string): Promise<void> {
        const encoder = new TextEncoder();
        const writer = this.port.writable?.getWriter();
        await writer?.write(encoder.encode(cmd));
        writer?.releaseLock();
    }

    private async wait(ms: number) {
        await  new Promise( resolve => setTimeout(resolve, ms));
    }

}
