import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Thruster} from "../src";

const App = () => {
  return (
    <div>
        <a onClick={go}> go</a>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

async function go() {

        try {
        const port = await window.navigator.serial.requestPort({});
        console.info(port);
        const thruster = await new Thruster(port).init();
    } catch (err) {
        console.info("Could not open port: " + err);
    }

}

