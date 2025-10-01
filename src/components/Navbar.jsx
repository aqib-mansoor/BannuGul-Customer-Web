// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Menu, X, User, Heart, Home, FileText, Info, Phone } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from localStorage safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      setUser(null);
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // Active link helper
  const isActive = (path) =>
    location.pathname === path
      ? "text-green-600 font-semibold"
      : "hover:text-green-600";

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-3 bg-white shadow">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/logo.png" alt="App Logo" className="w-9 h-10" />
        <h1 className="text-lg md:text-xl font-bold text-green-600">
          BANNU GUL BP RESTAURANT
        </h1>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 text-gray-700 font-medium items-center">
        <li
          className={`flex items-center gap-1 cursor-pointer ${isActive("/")}`}
          onClick={() => navigate("/")}
        >
          <Home size={18} className="text-green-600" /> Home
        </li>
        <li
          className={`flex items-center gap-1 cursor-pointer ${isActive("/orders")}`}
          onClick={() => {
            navigate("/orders");
            setIsOpen(false);
          }}
        >
          <FileText size={18} className="text-green-600" /> Orders
        </li>
        <li
          className={`flex items-center gap-1 cursor-pointer ${isActive("/about")}`}
          onClick={() => navigate("/about")}
        >
          <Info size={18} className="text-green-600" /> About
        </li>
        <li
          className={`flex items-center gap-1 cursor-pointer ${isActive("/contact")}`}
          onClick={() => navigate("/contact")}
        >
          <Phone size={18} className="text-green-600" /> Contact
        </li>
      </ul>

      {/* Desktop Auth */}
      <div className="hidden md:flex gap-5 items-center">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            {/* Favorite & Profile Icons */}
            <Heart
              size={22}
              className="text-green-600 cursor-pointer hover:text-green-700"
              onClick={() => navigate("/favorites")}
            />
            <User
              size={22}
              className="text-green-600 cursor-pointer hover:text-green-700"
              onClick={() => navigate("/profile")}
            />
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu + Auth */}
      <div className="md:hidden flex items-center gap-3">
        {user && (
          <User
            size={22}
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        )}
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50">
          <ul className="flex flex-col gap-4 p-4 text-gray-700 font-medium">
            <li
              className={`${isActive("/")} cursor-pointer flex items-center gap-2`}
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
            >
              <Home size={18} className="text-green-600" /> Home
            </li>
            <li
              className={`${isActive("/orders")} cursor-pointer flex items-center gap-2`}
              onClick={() => {
                navigate("/orders");
                setIsOpen(false);
              }}
            >
              <FileText size={18} className="text-green-600" /> Orders
            </li>
            <li
              className={`${isActive("/about")} cursor-pointer flex items-center gap-2`}
              onClick={() => {
                navigate("/about");
                setIsOpen(false);
              }}
            >
              <Info size={18} className="text-green-600" /> About
            </li>
            <li
              className={`${isActive("/contact")} cursor-pointer flex items-center gap-2`}
              onClick={() => {
                navigate("/contact");
                setIsOpen(false);
              }}
            >
              <Phone size={18} className="text-green-600" /> Contact
            </li>
          </ul>
          <div className="flex flex-col gap-2 p-4 border-t border-gray-200">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex gap-4 items-center">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
