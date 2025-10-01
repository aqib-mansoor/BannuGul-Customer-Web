// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import { AddressProvider } from "./context/AddressContext"; // <-- import AddressProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AddressProvider> {/* Wrap with AddressProvider */}
          <CartProvider>
            <App />
          </CartProvider>
        </AddressProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
