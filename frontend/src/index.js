import React from "react";
import ReactDOM from "react-dom/client";
import "../src/styles/common/reset.css";
import "../src/styles/common/common.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
