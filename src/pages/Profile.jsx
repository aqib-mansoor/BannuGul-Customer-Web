import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LogoutModal from "../components/Logout";
import {
  Mail,
  Phone,
  Heart,
  Info,
  BookOpen,
  FileText,
  CreditCard,
  MapPin,
  Key,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import { POST } from "../api/httpMethods";
import URLS, { getUserImageUrl } from "../api/urls";

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Alert state
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    profile_image: user.profile_image || "",
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      profile_image: user.profile_image || "",
    });
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await POST(
        URLS.UPDATE_PROFILE,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profile_image: formData.profile_image,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!res.data.error) {
        setUser({ ...user, ...formData });
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
        showAlert("✅ Profile updated successfully!", "success");
        setEditing(false);
      } else {
        showAlert("❌ Failed to update profile.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("⚠️ An error occurred. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const essentials = [
    { label: "Orders", icon: Package, path: "/orders" },
    { label: "Addresses", icon: MapPin, path: "/addresses" },
    { label: "Favorites", icon: Heart, path: "/favorites" },
  ];

  const general = [
    { label: "Help Center", icon: Info },
    { label: "Business", icon: BookOpen },
    { label: "Terms & Policies", icon: FileText },
    { label: "Payment Methods", icon: CreditCard },
    { label: "Change Password", icon: Key },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* ✅ Smooth Alert */}
      {alertMessage && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-md text-white font-medium transition-all ${
            alertType === "success"
              ? "bg-green-600 animate-bounce"
              : "bg-red-600 animate-pulse"
          }`}
        >
          {alertMessage}
        </div>
      )}

      <main className="flex-1 px-4 md:px-10 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-200">
          {/* 🧑‍💼 Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-8 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
            <img
              src={user.image ? getUserImageUrl(user.image) : "/profile_pic.jpg"}
              alt="Profile"
              className="w-28 h-28 md:w-40 md:h-40 rounded-full shadow-md object-cover border-4 border-white"
              onError={(e) => (e.target.src = "/profile_pic.jpg")}
            />

            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {formData.name}
                  </h2>
                  <p className="text-gray-500 flex justify-center md:justify-start items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" /> {formData.email}
                  </p>
                  <p className="text-gray-500 flex justify-center md:justify-start items-center gap-2">
                    <Phone className="w-4 h-4" /> {formData.phone}
                  </p>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-3 bg-green-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-green-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-semibold"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* ✅ Essentials */}
          <div className="p-6 md:p-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-5 text-center md:text-left">
              Your Essentials
            </h3>

            {/* ✅ Horizontal scroll on mobile */}
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-2 md:px-0 pb-2">
              {essentials.map((item) => (
                <div
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="min-w-[110px] md:min-w-0 flex-shrink-0 
                    flex flex-col items-center justify-center
                    bg-gradient-to-br from-green-50 to-green-100 
                    hover:from-green-100 hover:to-green-200 
                    rounded-2xl shadow-sm p-4 md:p-6 cursor-pointer 
                    transition-all hover:shadow-md hover:scale-105 
                    border border-green-200 text-center"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm transition">
                    <item.icon className="text-green-700 w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700 mt-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ✅ General Section */}
            <h3 className="text-xl font-semibold text-gray-700 mt-12 mb-5">
              General
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {general.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl hover:shadow-md hover:scale-105 transition cursor-pointer"
                >
                  <item.icon className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
