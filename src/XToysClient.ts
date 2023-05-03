import {Dispatch} from "react";


export interface XToysConfig {
  readonly websocket: string;
  readonly token: string;
}


const XToysConfirmConnect =  { 'success': true }

export type XToysCommandUnion = SpeedMessage | PositionMessage

/**
 * either "speed" or "position" depending on what mode the user has selected on the toy controls
 */
export type XToysCommandMode = 'speed' | 'position'
export type XToysCommand = {
  mode: XToysCommandMode
}

export interface SpeedMessage extends XToysCommand {
  mode: 'speed',
  /** how fast to move the toy (integer in the range 0-100) */
   speed: number,
  /** the upper stroke length that has been set (integer in the range 20-100) */
   upper: number,
  /** the lower stroke length that has been set (integer in the range 0-80) */
   lower: number,
}

export interface PositionMessage extends XToysCommand {
  mode: 'position',
  /** the number of milliseconds the toy should take to move to the given position */
  duration: number,
  /** the position the toy should move to (integer in the range 0-100) */
  position: number
}

const example: SpeedMessage = {"mode": "speed", "speed": 50, "upper": 100, "lower": 0}
const exampleP: PositionMessage = {"mode": "position", "duration": 130, "position": 90}


export class XToysClient {
  private ws?: WebSocket;
  private listener?: EventListener;
  public constructor(private readonly config: XToysConfig, private readonly onCommand?: Dispatch<XToysCommandUnion>) {}

  public sendXToys(evt: any): void {
    console.info("sending", evt)
    this.ws?.send(JSON.stringify(evt)+"\n");
  }

  public stop(): void {
    if (this.listener) {
      this.ws?.removeEventListener('message', this.listener);
    }
    this.ws?.close(1000, "Going Away")
  }

  public async start(): Promise<void> {
    const t = this;
    this.ws = new WebSocket(
      `wss://webhook.xtoys.app/${this.config.websocket}?token=${this.config.token}`
    );

    this.ws.onopen = () => {

    };

    const connected = new Promise((resolve, reject) => {

      t.ws?.addEventListener('error', (e:Event)=> {
        reject(e);
      }, {once: true})

      t.ws?.addEventListener('message', (e:MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);

          if ((parsed as any).success === true) {
            resolve(undefined);
          }
        } catch (e) {
          reject(e);
        }

      }, {once: true})
    })

    await connected;
    console.info('YAY, connected to xtoys');

    t.ws?.addEventListener('message', (m) => {
      const parsed = JSON.parse(m.data) as XToysCommandUnion;
      t.onCommand?.(parsed);
    });

  }
}
