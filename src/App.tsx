import './App.css';
import {KnockRod, ShockRodSize,} from "./knockRod";
import {DSS1, DSSE, STAT} from "./knockRodProtocol";
import {FC, useEffect, useState} from "react";
import {KnockRodParams, KnockRodState} from "./knockRodState";
import {XToysClient, XToysCommandUnion, XToysConfig} from "./XToysClient";
import {useRef} from "react/index";

export interface Config {
    readonly xtoys: XToysConfig
    readonly serialDevice: UsbDeviceIdentifier | undefined
}

type UsbDeviceIdentifier = Required<SerialPortInfo>

function getSessionStorageOrDefault<T>(key: any, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
        return defaultValue;
    }
    return JSON.parse(stored) as T;
}

interface Props {

}

const App: FC<Props> = (_props: Props) => {

    const [config, setConfig] = useState<Config>(getSessionStorageOrDefault('config', {
        serialDevice: undefined,
        xtoys: {token: '', websocket: ''}
    }));
    const [params, _setParams] = useState<KnockRodParams>(getSessionStorageOrDefault('params', {
        speed: 0,
        acceleration: 30
    }));

    const latestParams = useRef(params)
    function setParams(p:KnockRodParams) {
        latestParams.current = p;
        _setParams(p);
    }

    const [rodConnecting, setRodConnecting] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem('config', JSON.stringify(config));
    }, [config]);


    const [size, setSize] = useState(ShockRodSize.EightInch)
    const [state, setState] = useState<KnockRodState | undefined>(undefined);
    const rod = useRef<KnockRod | undefined>(undefined);

    const [xToys, setXToys] = useState<XToysClient | undefined>(undefined);

    async function go() {

        const ports = await window.navigator.serial.getPorts();
        /** close all ports */
        for (const p of ports) {

            await p.writable?.getWriter().abort();
            await p.readable?.getReader().cancel('terminating');
            //await p.close();

            // forget if possible
            if ((p as any).forget) {
                await (p as any).forget();
            }
        }



        const port = await window.navigator.serial.requestPort({filters: config.serialDevice ? [config.serialDevice] : []});
        if (!port.getInfo().usbVendorId || !port.getInfo().usbProductId) {
            throw new Error("Serial device has no vedor or productId")
        }

        setConfig(c => ({...c, serialDevice: port.getInfo() as UsbDeviceIdentifier}))
        let t = new KnockRod(port, size);
        t.addEventListener('stateChange', (e) => setState(e.detail.state))

        setRodConnecting(true);
        console.info("connecting to rod...")
        try {
            await t.init();
            rod.current = t;
        } finally {
            console.info("connecting is over")
            setRodConnecting(false);
        }

        console.info("ready for fun")
    }

    function renderAcceleration(speed: number) {
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 4}).format(speed / 10.0) + "cm/s^2";
    }

    function renderSpeed(speed: number) {
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 4}).format(speed / 10.0) + "cm/s";
    }

    function renderMmm(mm: number) {
        return new Intl.NumberFormat('en-US', {maximumFractionDigits: 4}).format(mm / 10.0) + "cm";
    }

    function disconnectXToys() {
        xToys?.stop();
        setXToys(undefined);
    }

    async function connectXToys() {

        const c = new XToysClient(config.xtoys, (c) => {
            onCommand(c)
        });
        await c.start();
        setXToys(c);
    }

    function onCommand(cmd: XToysCommandUnion) {
        if (cmd.mode === 'position') {
            rod.current?.moveToWithin(cmd.position/100, cmd.duration, latestParams.current.acceleration)
            if (!!rod.current) console.info('move to ' + cmd.position)
        } else if (cmd.mode === 'speed'){
            console.info('oscillate with', cmd)
            rod.current?.oscillate(cmd.speed / 100, cmd.lower/100, cmd.upper/100, latestParams.current.acceleration)

        }
        else {
            console.info(cmd)
        }

    }



    return (
        <div className="App">
            <header className="App-header">


                <fieldset>
                    <legend>XToys</legend>
                    <p>
                        You can have XToys control your device as Custom XToys Webhook Toy. Create a custom toy of type "Stroker or Thrust Toy (Speed + Position)"
                        and add the Websocket credentials here.
                    </p>
                    <label>Websocket <input type='text' disabled={!!xToys} onChange={(i) => setConfig((c) => ({
                        ...c,
                        xtoys: {...c.xtoys, websocket: i.target.value}
                    }))} value={config.xtoys.websocket}/></label>
                    <br />
                    <label>Token <input type='text' disabled={!!xToys}
                                        onChange={(i) => setConfig((c) => ({
                                            ...c,
                                            xtoys: {...c.xtoys, token: i.target.value}
                                        }))}
                                        value={config.xtoys.token}/></label>
                    <br/>
                    <button onClick={() => connectXToys()} disabled={!!xToys}>connect</button>
                    {!!xToys && <button onClick={() => disconnectXToys()}>disconnect</button>}
                </fieldset>

                {!rod &&
                    <p>
                        Hit <code>start</code> and select your selected actuator from the popup list.
                    </p>
                }


                {rod && state &&
                    <table>
                        <tbody>

                        <tr>
                            <td>Operation mode status (DSSE.PMSS):</td>
                            <td>{state.systemStatusRegister.has(STAT.RMDS) ? 'MANU️' : 'AUTO'}</td>
                        </tr>
                        <tr>
                            <td>Modbus enabled (DSSE.PMSS):</td>
                            <td>{state.expansionDeviceStatus.has(DSSE.PMSS) ? '✔️' : '❌'}</td>
                        </tr>
                        <tr>
                            <td>Safety speed enabled status (DSS1.SFTY):</td>
                            <td><input type="checkbox" checked={state.deviceStatusRegister1.has(DSS1.SFTY)}
                                       onChange={(e) => rod.current?.setSafetySpeed(e.target.checked)}/>{state.deviceStatusRegister1.has(DSS1.SFTY) ? '✔️' : '❌'}
                            </td>
                        </tr>
                        <tr>
                            <td>Controller ready status:</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.PWR) ? '✔️' : '❌'}</td>
                        </tr>
                        <tr>
                            <td>Emergency Stop: (DSS1.EMGS)</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.EMGS) ? '🟠' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Missed work part in push-motion operation:</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.PSFL) ? '🟠️' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Servo ON status (DSS1.SV):</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.SV) ? '🟢' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Minor failure status (DSS1.ALMH):</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.ALMH) ? '🟡' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Major failure alarm present (DSS1.ALMH):</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.ALMH) ? '🔴️' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Input Value:</td>
                            <td>{state.input}</td>
                        </tr>

                        <tr>
                            <td>Moving signal (DSSE.MOVE):</td>
                            <td>{state.expansionDeviceStatus.has(DSSE.MOVE) ? '🟢️' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Push Motion in progress signal (DSSE.PUSH):</td>
                            <td>{state.expansionDeviceStatus.has(DSSE.PUSH) ? '🟢️' : '⚪'}</td>
                        </tr>
                        <tr>
                            <td>Positioning Ended:</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.PEND) ? '✔️' : '❌'}</td>
                        </tr>
                        <tr>
                            <td>Homing Ended:</td>
                            <td>{state.deviceStatusRegister1.has(DSS1.HEND) ? '✔️' : '❌'}</td>
                        </tr>
                        </tbody>
                    </table>
                }

                {rod && state &&
                    <table>
                        <tbody>
                        <tr>
                            <td>Safety Speed: {renderSpeed(params.speed)}</td>
                            <td><input type="range" value={params.speed}
                                       onChange={(e) => setParams({...params, speed: parseInt(e.target.value)})}
                                       min="100" step="100"
                                       max="40000"/></td>
                        </tr>
                        <tr>
                            <td>Acceleration: {renderAcceleration(params.acceleration)}</td>
                            <td><input type="range" value={params.acceleration}
                                       onChange={(e) => setParams({...params, acceleration: parseInt(e.target.value)})}
                                       min="5" step="1"
                                       max="50"/></td>
                        </tr>
                        <tr>
                            <td>Current Position:</td>
                            <td>{renderMmm(state.currentPosition)}<br/>
                                <input type="range" value={state.currentPosition} disabled={true} min="0" max="20000"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                }

                <div>
                    {!state && !rodConnecting &&

                        <>
                            <select onSelect={(e) => setSize(Number.parseInt(e.currentTarget.value)) } value={size}>
                                <option value={ShockRodSize.EightInch} >8 inch (20cm)</option>
                                <option value={ShockRodSize.TwelveInch}>12 inch (30cm)</option>
                            </select>
                        <button onClick={go} className="App-link"> Start</button>
                        </>
                    }

                    {rodConnecting &&
                        <strong>ROD IS CONNECTING. STAND BY.</strong>
                    }

                    {state && rod && <div>


                        <button onClick={() => rod.current?.resetAlarm()} disabled={!state}> Reset Alarm</button>
                        <button onClick={() => rod.current?.moveSimple()}> Move up</button>


                        <button
                            onClick={() => rod.current?.setServo(!(state?.deviceStatusRegister1.has(DSS1.SV) || false))}> Toggle
                            servo
                        </button>
                        <button onClick={() => rod.current?.home()}>Home</button>

                        <br/>


                    </div>
                    }

                </div>

                {!rod &&
                    <p>
                        Find the code on <a href="https://github.com/rezreal/knock-lot">github.com/rezreal/knock-lot</a>.
                    </p>
                }


            </header>
        </div>
    );
}

export default App;

