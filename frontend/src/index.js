import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/common/reset.css";
import "./styles/common/common.css";

console.log("App is running");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
