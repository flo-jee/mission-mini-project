import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

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
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </BrowserRouter>
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
    </SupabaseProvider>
  </React.StrictMode>,
);
