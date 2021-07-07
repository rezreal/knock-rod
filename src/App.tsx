import './App.css';
import {KnockRod, ShockRodSize,} from "./knockRod";
import {DSS1, DSSE, STAT} from "./knockRodProtocol";
import {useCallback, useEffect, useState} from "react";
import {KnockRodState} from "./knockRodState";

function getSessionStorageOrDefault<T>(key:any, defaultValue: T): T {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored) as T;
}


function App() {

  const [params, setParams] = useState<{
    minDepth: number,
    maxDepth: number,
    speed: number,
    showStats: boolean,
    program: 'palm' | 'pi' | undefined
  }>(getSessionStorageOrDefault('params',{minDepth: 100, maxDepth: 5000, speed: 3000, showStats: false, program: undefined}));


  useEffect(() => {
    sessionStorage.setItem('params', JSON.stringify(params));
  }, [params]);

  useEffect(() => {
    if (params.program === 'pi') {
      // TODO: continue

    }
  }, [params]);


  const [state, setState] = useState<KnockRodState | undefined>(undefined);
  const [rod, setRod] = useState<KnockRod | undefined>(undefined);

  const onPalmDown = useCallback(() => {
    if (rod && state && params.program === 'palm') {
      return rod.moveTo(Math.min(params.maxDepth, state.currentPosition + 15000));
    }
    return Promise.resolve();

  }, [rod, state, params]);

  const onPalmUp = useCallback(() => {
    if (rod && params.program === 'palm') {
      return rod.moveTo(params.minDepth);
    }
    return Promise.resolve();
  }, [rod, params]);


  useEffect(() => {
    rod?.addEventListener('palmdown', onPalmDown);
    rod?.addEventListener('palmup', onPalmUp);
    return () => rod?.removeEventListener('palmdown', onPalmDown) && rod?.removeEventListener('palmup', onPalmUp) ;
  }, [rod, onPalmDown, onPalmUp]);

  useEffect(() => {
    rod?.setParams(params)
  }, [params, rod]);

  async function go() {

    const ports = await window.navigator.serial.getPorts();

    const port = ports.length === 0 ? await window.navigator.serial.requestPort({}) : ports[0];
    let t = new KnockRod(port, ShockRodSize.EightInch);
    t.addEventListener('stateChange', (e) => setState(e.detail.state))
    await t.init();
    setRod(t);


    console.info("ready for fun")
  }

  function renderSpeed(speed: number) {
    return new Intl.NumberFormat('de-DE', { maximumFractionDigits:4  }).format(speed/1000.0) + "cm/s";
  }

  function renderMmm(mm: number) {
      return new Intl.NumberFormat('de-DE', { maximumFractionDigits:4  }).format(mm/1000.0) + "cm";
  }

  return (
    <div className="App">
      <header className="App-header">


        {!rod &&
          <p>
            Hit <code>start</code> and select your selected actuator from the popup list.
          </p>
        }


        {rod && state && params.showStats &&
        <table>
          <tbody>

          <tr>
            <td>Operation mode status  (DSSE.PMSS):</td>
            <td>{state.systemStatusRegister.has(STAT.RMDS) ? 'MANU️' : 'AUTO'}</td>
          </tr>
          <tr>
            <td>Modbus enabled (DSSE.PMSS):</td>
            <td>{state.expansionDeviceStatus.has(DSSE.PMSS) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Safety speed enabled status (DSS1.SFTY):</td>
            <td><input type="checkbox" checked={state.deviceStatusRegister1.has(DSS1.SFTY)} onChange={ (e) => rod?.setSafetySpeed(e.target.checked) }/>{state.deviceStatusRegister1.has(DSS1.SFTY) ? '✔️' : '❌'}</td>
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
            <td>Speed: {renderSpeed(params.speed)}</td>
            <td><input type="range" value={params.speed}
                       onChange={(e) => setParams({...params, speed: parseInt(e.target.value)})} min="100" step="100"
                       max="40000"/></td>
          </tr>
          <tr>
            <td>Min depth: {renderMmm(params.minDepth)}</td>
            <td><input type="range" value={params.minDepth}
                       onChange={(e) => setParams({...params, minDepth: Math.min(parseInt(e.target.value), params.maxDepth)})} min="100" step="100"
                       max="20000"/></td>
          </tr>
          <tr>
            <td>Max depth: {renderMmm(params.maxDepth)}</td>
            <td><input type="range" value={params.maxDepth}
                       onChange={(e) => setParams({...params, maxDepth: Math.max(parseInt(e.target.value), params.minDepth)})} min="100" step="100"
                       max="20000"/></td>
          </tr>
          <tr>
            <td>Current Position:</td>
            <td>{renderMmm(state.currentPosition)}<br/>
              <input type="range" value={state.currentPosition} disabled={true} min="0" max="20000"/></td>
          </tr>
          </tbody>
        </table>
        }

        <div>
          { !state &&
            <button onClick={go} className="App-link"> Start</button>
          }

          {state && rod && <div>

            <button onClick={() => setParams({...params, showStats: !params.showStats})}
                    title={"Settings"}>{params.showStats ? 'show less' : 'show more'}</button>

            <button onClick={() => rod!.resetAlarm()} disabled={!state}> Reset Alarm</button>
            <button onClick={() => rod!.moveSimple()}> Move up</button>
            <button onClick={() => rod!.moveRetract()}> Retract</button>
            <button onClick={() => rod!.move2()}> Push until hitting workload</button>
            <button onClick={() => rod!.setServo(!(state?.deviceStatusRegister1.has(DSS1.SV) || false))}> Toggle servo</button>
            <button onClick={() => rod!.home()}> Home!!</button>

            <br />
            <label htmlFor={'program'}>Program: </label>

            <select id="program" name="program" value={params.program} onChange={(e) => setParams({...params, program: e.currentTarget.value as any})} defaultValue={undefined}>
              <option value={undefined}> -- select an option -- </option>
              <option value="palm">Palm control</option>
            </select>

          </div>
          }

        </div>

        { !rod &&
          <p>
            Find the code on <a href="https://github.com/rezreal/knock-lot">github.com/rezreal/knock-lot</a>.
          </p>
        }


      </header>
    </div>
  );
}

export default App;

