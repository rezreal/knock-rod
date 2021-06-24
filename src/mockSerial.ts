import {wait} from "./waitUtil";

export class MockSource implements UnderlyingSource<Uint8Array> {

    public setStringReply(str: string): void {
        this.nextReply = new TextEncoder().encode(str);
    }

    public nextReply: Uint8Array | undefined;

    async start(controller: any): Promise<void> {
        console.info("started source for controller ", controller);
    }

    async pull(controller: any): Promise<void> {
        console.info("cancelled source for controller", controller);
        if (this.nextReply) {
            controller.enqueue(this.nextReply);
            this.nextReply = undefined;
        }
        return wait(1);
    }

    async cancel(_controller: any): Promise<void> {
        console.info("cancelled source");
    }

    //readonly type = typeof Uint8Array;

}

export class MockSink implements UnderlyingSink<Uint8Array> {
    close(): void {
        console.info("closed sink");
    }

    start(_controller: WritableStreamDefaultController): void {
        console.info("started sink");
    }


    //readonly type = typeof Uint8Array;

    async write(chunk: Uint8Array, _controller: any): Promise<void> {
        console.info(`writing array: ${chunk} - parsed: ${new TextDecoder().decode(chunk)}`);
        return wait(1);
    }


}

export class MockSerialPort extends SerialPort {

    onconnect: ((this: SerialPort, ev: Event) => any) | null = null;

    async open(options: SerialOptions): Promise<void> {
        await wait(10)
        console.log("Port open with options", options)
    }

    public readonly mockSource = new MockSource();
    public readonly mockSink = new MockSink();

    readonly readable: ReadableStream<Uint8Array> = new ReadableStream(this.mockSource);
    readonly writable: WritableStream<Uint8Array> = new WritableStream(this.mockSink);

}

export class MockSerial implements Serial, EventTarget {

    readable: boolean = true;
    writeable: boolean = true;

    onconnect: ((this: Serial, ev: Event) => any) | null = (ev) => console.info("onConnect called", ev);
    ondisconnect: ((this: Serial, ev: Event) => any) | null = (ev) => console.info("onDisconnect called", ev);


    addEventListener(_type: "connect" | "disconnect" | string, _listener: ((this: this, ev: Event) => any) | EventListenerOrEventListenerObject | null, _useCapture?: boolean | AddEventListenerOptions): void {
        throw  new Error("not implemented");
    }

    dispatchEvent(event: Event): boolean {
        throw new Error("not implemented dispatch for event:" + event);
    }

    private readonly port: SerialPort = new MockSerialPort();

    getPorts(): Promise<SerialPort[]> {
        return Promise.resolve([this.port]);
    }

    removeEventListener(_type: "connect" | "disconnect", _callback: (this: SerialPort, ev: Event) => any, _useCapture?: boolean): void;
    removeEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(_type: "connect" | "disconnect" | string, _callback: ((this: SerialPort, ev: Event) => any) | EventListenerOrEventListenerObject | null, _useCapture?: boolean | EventListenerOptions): void {
    }

    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort> {
        return Promise.resolve(this.port);
    }

}