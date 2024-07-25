import React from "react";
import ReactDOM from "react-dom/client";
import { lazy, Suspense } from 'react';
import "./index.css";
import { SupabaseProvider } from "./integrations/supabase/index.js";

const App = lazy(() => import('./App.jsx'));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </SupabaseProvider>
  </React.StrictMode>,
);