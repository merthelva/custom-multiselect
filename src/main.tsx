import React from "react";
import ReactDOM from "react-dom/client";
import App from "App.tsx";
import "index.scss";
import { ErrorBoundary } from "components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong while loading UI</div>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
