import logo from './logo.svg';
import './App.css';
import {Thruster,} from "./thruster";
import { wait} from "./waitUtil";
import {ButtonHTMLAttributes} from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>


        <div>
          <button onClick={go}  className="App-link" > Start</button>
          <button onClick={()=>thruster?.move()}   > Move!!</button>
          <button onClick={()=>thruster?.home()}   > Home!!</button>
        </div>

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

