// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Mail,
  Phone,
  Heart,
  Gift,
  Ticket,
  Info,
  BookOpen,
  FileText,
  Star,
  Award,
  ShoppingCart,
  CreditCard,
  MapPin,
  Key,
  Settings,
} from "lucide-react";
import { POST } from "../api/httpMethods";
import  URLS from "../api/urls";


export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
        { headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } }
      );

      if (!res.data.error) {
        setUser({ ...user, ...formData });
        localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
        alert("Profile updated successfully!");
        setEditing(false);
      } else alert("Failed to update profile.");
    } catch (err) {
      console.error(err);
      alert("An error occurred. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { label: "Subscription", icon: Gift },
    { label: "Rewards", icon: Heart },
    { label: "Vouchers", icon: Ticket },
    { label: "Premium", icon: Star },
    { label: "Awards", icon: Award },
    { label: "Points", icon: ShoppingCart },
  ];

  const general = [
    { label: "Help Center", icon: Info },
    { label: "Bannu Gul Business", icon: BookOpen },
    { label: "Terms & Policies", icon: FileText },
    { label: "Payment Methods", icon: CreditCard },
    { label: "Saved Addresses", icon: MapPin },
    { label: "Change Password", icon: Key },
    { label: "Order History", icon: ShoppingCart },
    { label: "Favorites", icon: Heart },
    { label: "Subscriptions", icon: Gift },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 md:px-12 py-6">
        <section className="bg-white shadow-2xl rounded-3xl w-full max-w-7xl flex flex-col md:flex-row overflow-visible h-auto md:h-[calc(100vh-100px)]">

          {/* Left Panel: Profile */}
          <div className="md:w-1/3 flex flex-col items-center justify-start md:justify-center p-8 md:p-12 gap-4">
            <img
              src={formData.profile_image || "/profile_pic.jpg"}
              alt="Profile"
              className="w-36 h-36 md:w-52 md:h-52 rounded-full shadow-xl object-cover"
            />

            <div className="flex flex-col items-center gap-2 mt-4 text-center w-full">
              {editing ? (
                <div className="flex flex-col gap-3 w-full">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded-lg text-center"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-2 rounded-lg text-center"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border p-2 rounded-lg text-center"
                  />
                  <div className="flex gap-2 mt-2 flex-col md:flex-row">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg flex-1 hover:bg-green-700 transition"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex-1 hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-800">{formData.name}</h2>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone}</span>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 bg-green-600 text-white font-semibold py-2 px-6 rounded-2xl hover:bg-green-700 transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Panel: Perks & General */}
          <div className="md:w-2/3 p-6 sm:p-10 flex flex-col gap-6 overflow-visible">

            {/* Settings Icon Top Right */}
            <div className="absolute top-6 right-6 cursor-pointer">
              <Settings className="w-6 h-6 text-gray-600 hover:text-gray-800 transition" />
            </div>

            {/* Perks Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Your Essentials
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:flex sm:flex-row sm:gap-2">
                {perks.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-2 bg-green-100 p-4 rounded-2xl shadow-sm hover:scale-105 transition cursor-pointer text-center w-full sm:w-auto md:w-[120px] md:h-[120px]"
                  >
                    <item.icon className="text-green-600 w-6 h-6" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>


            {/* General Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">General</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {general.map(item => (
                  <div key={item.label} className="flex items-center gap-2 bg-blue-100 p-4 rounded-2xl shadow-sm hover:scale-105 transition cursor-pointer">
                    <item.icon className="text-blue-600 w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition w-max self-end mt-4"
            >
              Logout
            </button>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
