import logo from './logo.svg';
import './App.css';
import {Thruster,} from "./thruster";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hit <code>start</code> and select your selected actuator from the popup list.
        </p>


        <div>
          <button onClick={go}  className="App-link" > Start</button>
          <button onClick={()=>thruster?.move()}   > Move!!</button>
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

  const port = await window.navigator.serial.requestPort({});
  let t = new Thruster(port);
  await t.init();
  thruster = t;
  console.info("ready for fun")
}

