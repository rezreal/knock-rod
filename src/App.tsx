
import './App.css';
import {KnockRod,} from "./knockRod";
import {DSS1, DSSE} from "./knockRodProtocol";
import {useState} from "react";
import {KnockRodState} from "./knockRodState";


function App() {
  const [state, setState] = useState<KnockRodState | undefined>(undefined);
  const [rod, setRod] = useState<KnockRod | undefined>(undefined);

  async function go() {

    const ports = await window.navigator.serial.getPorts();

    const port = ports.length === 0 ? await window.navigator.serial.requestPort({}) : ports[0];
    let t = new KnockRod(port);
    t.addEventListener('stateChange', (e) => setState(e.detail.state))
    await t.init();
    setRod(t);

    console.info("ready for fun")
  }

  function renderMmm(mm:number) {
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

        {rod && state &&
        <table>
          <tbody>
          <tr>
            <td>Positioning Ended:</td>
            <td>{state.deviceStatusRegister1.has(DSS1.PEND) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Homing Ended:</td>
            <td>{state.deviceStatusRegister1.has(DSS1.HEND) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Controller ready status:</td>
            <td>{state.deviceStatusRegister1.has(DSS1.PWR) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Missed work part in push-motion operation:</td>
            <td>{state.deviceStatusRegister1.has(DSS1.PSFL) ? '⚠️' : '🟩'}</td>
          </tr>
          <tr>
            <td>Servo ON status (DSS1.SV):</td>
            <td>{state.deviceStatusRegister1.has(DSS1.SV) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Minor failure status (DSS1.ALMH):</td>
            <td>{state.deviceStatusRegister1.has(DSS1.ALMH) ? '⚠️' : '🟩'}</td>
          </tr>
          <tr>
            <td>Major failure alarm present (DSS1.ALMH):</td>
            <td>{state.deviceStatusRegister1.has(DSS1.ALMH) ? '⚠️' : '🟩'}</td>
          </tr>
          <tr>
            <td>Current Position:</td>
            <td>{renderMmm(state.currentPosition)}</td>
          </tr>
          <tr>
            <td>Moving signal (DSSE.MOVE):</td>
            <td>{state.expansionDeviceStatus.has(DSSE.MOVE) ? '✔️' : '❌'}</td>
          </tr>
          <tr>
            <td>Modbus enabled (DSSE.PMSS):</td>
            <td>{state.expansionDeviceStatus.has(DSSE.PMSS) ? '✔️' : '❌'}</td>
          </tr>
          </tbody>
        </table>
        }

        <div>
          <button onClick={go} disabled={!!state} className="App-link"> Start</button>

          {state && rod && <div>
                <button onClick={() => rod!.resetAlarm()} disabled={!state} > Reset Alarm</button>
                <button onClick={() => rod!.moveSimple()}> Move up</button>
                <button onClick={() => rod!.moveRetract()}> Retract</button>
                <button onClick={() => rod!.move2()}> Push until hitting workload</button>
                <button onClick={() => rod!.setServo(!(state?.deviceStatusRegister1.has(DSS1.SV) || false))}> Toggle servo</button>
                <button onClick={() => rod!.home()}> Home!!</button>
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

