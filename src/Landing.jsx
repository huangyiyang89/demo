import reactLogo from "/react.svg";
import viteLogo from "/vite.svg";
import antdlogo from "/antd.svg";
import "./Landing.css";
import { Button } from "antd";

function Landing() {
  return (
    <div className="flex-box">
      <div className="container">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://ant.design" target="_blank">
            <img src={antdlogo} className="logo antd" alt="antd logo" />
          </a>
        </div>
        <h1>Vite + React + Ant Design</h1>

        <div className="card">
          <Button type="primary" size="large" href="/app">
            Start Demo
          </Button>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React and Antd logos to learn more
        </p>
      </div>
    </div>
  );
}

export default Landing;
