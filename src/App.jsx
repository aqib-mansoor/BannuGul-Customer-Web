// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RestaurantDetails from "./pages/RestaurantDetails";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import FloatingCart from "./components/FloatingCart";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import Profile from "./pages/Profile";


export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Navbar only on homepage
  const showNavbar = location.pathname === "/";

  // ✅ Hide cart on login & register
  const hideCart = ["/login", "/register"].includes(location.pathname);

  return (
    <SettingsProvider>
      <CartProvider>
        {showNavbar && <Navbar />}
        {!hideCart && <FloatingCart />}

        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />

          
        </Routes>
      </CartProvider>
    </SettingsProvider>
  );
}
