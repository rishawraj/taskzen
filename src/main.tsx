import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./main.css";
import { DarkModeProvider } from "./Context/DarkModeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DarkModeProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DarkModeProvider>
);
