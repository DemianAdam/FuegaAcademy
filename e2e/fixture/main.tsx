import React from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "../../src/app/AppProviders";
import { AppRouter } from "../../src/app/AppRouter";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
