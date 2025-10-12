import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Heart,
  Home,
  FileText,
  Info,
  Phone,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "./Logout";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsModalOpen(false);
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-600 font-semibold"
      : "hover:text-green-600 transition-colors";

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b-2 border-green-500">
        <div className="flex justify-between items-center px-3 sm:px-6 py-3 max-w-7xl mx-auto">
          {/* Logo + Name */}
          <div
            className="flex items-center gap-2 cursor-pointer min-w-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="App Logo"
              className="w-9 h-10 flex-shrink-0"
            />
            <h1 className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-green-600 truncate">
              BANNU GUL BP RESTAURANT
            </h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium items-center">
            <li
              className={`flex items-center gap-1 cursor-pointer ${isActive("/")}`}
              onClick={() => navigate("/")}
            >
              <Home size={18} className="text-green-600" /> Home
            </li>
            <li
              className={`flex items-center gap-1 cursor-pointer ${isActive("/orders")}`}
              onClick={() => navigate("/orders")}
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
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
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
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-inner border-t border-gray-100 animate-slideDown">
            {/* Menu Links */}
            <ul className="flex flex-col gap-4 p-4 text-gray-700 font-medium">
              {[
                { path: "/", icon: <Home size={18} />, label: "Home" },
                { path: "/orders", icon: <FileText size={18} />, label: "Orders" },
                { path: "/about", icon: <Info size={18} />, label: "About" },
                { path: "/contact", icon: <Phone size={18} />, label: "Contact" },
              ].map((link) => (
                <li
                  key={link.path}
                  className={`${isActive(link.path)} cursor-pointer flex items-center gap-2`}
                  onClick={() => {
                    navigate(link.path);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-green-600">{link.icon}</span> {link.label}
                </li>
              ))}
            </ul>

            {/* Mobile Auth Buttons (✅ Updated) */}
            <div className="flex flex-col items-center gap-3 p-4 border-t border-gray-200">
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                    className="px-5 py-2 w-auto bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setIsOpen(false);
                    }}
                    className="px-5 py-2 w-auto bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 shadow-sm transition"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2 w-auto bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 shadow-sm transition"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[66px]" />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
