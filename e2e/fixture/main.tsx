import { ThemeStates } from "./ThemeStates";
import "../../src/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "../../src/app/AppProviders";
import { AppRouter } from "../../src/app/AppRouter";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      {new URLSearchParams(location.search).get("scenario") === "states" ? <ThemeStates /> : <AppRouter />}
    </AppProviders>
  </React.StrictMode>,
);
