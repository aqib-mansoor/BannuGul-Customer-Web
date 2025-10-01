// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import Orders from "./pages/Orders";      // ✅ Correct import
import About from "./pages/About";        
import Contact from "./pages/Contact";    
import Navbar from "./components/Navbar";
import FloatingCart from "./components/FloatingCart"; 
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import Profile from "./pages/Profile";

export default function App() {
  const location = useLocation();
  const showNavbar = location.pathname === "/";
  const hideCart = location.pathname === "/login" || location.pathname === "/register";

  return (
    <SettingsProvider>
      <CartProvider>
        {showNavbar && <Navbar />}
        {!hideCart && <FloatingCart />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/orders" element={<Orders />} />      {/* ✅ Fixed */}
          <Route path="/about" element={<About />} />        
          <Route path="/contact" element={<Contact />} />    
          <Route path="/profile" element={<Profile />} />  
        </Routes>
      </CartProvider>
    </SettingsProvider>
  );
}
