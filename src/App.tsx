import logo from './logo.svg';
import './App.css';
import {Thruster,} from "./thruster";
import {DSS1} from "./trusterProtocol";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hit <code>start</code> and select your selected actuator from the popup list.
        </p>

        <fieldset>
          <dl>
            <dt>Positioning Ended:</dt><dd>{thruster?.status?.has(DSS1.PEND) ? 'x':''}</dd>
            <dt>Homing Ended:</dt><dd>{thruster?.status?.has(DSS1.HEND) ? 'x':''}</dd>
            <dt>Controller ready status:</dt><dd>{thruster?.status?.has(DSS1.PWR) ? 'x':''}</dd>
            <dt>Servo ON status:</dt><dd>{thruster?.status?.has(DSS1.SV) ? 'x':''}</dd>
          </dl>
        </fieldset>


        <div>
          <button onClick={go}  className="App-link" > Start</button>
          <button onClick={()=>thruster?.move()}   > Retract</button>
          <button onClick={()=>thruster?.move2()}   > Push until hitting workload</button>
          <button onClick={()=>thruster?.home()}   > Home!!</button>
        </div>

        <p>
          Find the code on <a href="https://github.com/rezreal/knock-lot">github.com/rezreal/knock-lot</a>.
        </p>

      </header>
    </div>
  );
}

export default App;

let thruster: Thruster | undefined = undefined;

async function go() {

  const ports = await window.navigator.serial.getPorts();


  const port = ports.length == 0 ? await window.navigator.serial.requestPort({}) : ports[0];
  let t = new Thruster(port);
  await t.init();
  thruster = t;
  console.info("ready for fun")
}

