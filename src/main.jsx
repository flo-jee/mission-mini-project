import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { SupabaseProvider } from "./supabase/context";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseProvider>
      <AuthProvider>
        <UserProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
    </SupabaseProvider>
  </React.StrictMode>,
);
