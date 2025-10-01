// src/pages/Contact.jsx
import { useState, useContext } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SettingsContext } from "../context/SettingsContext";


export default function Contact() {
  const { settings, loading } = useContext(SettingsContext); // Get settings from context

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Message sent!\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDescription: ${description}`
    );
    // Replace alert with API call if needed
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Panel */}
          <div className="md:w-1/2 bg-green-600 flex flex-col items-center justify-center p-8 relative">
            <img
              src="/contact.png"
              alt="Contact"
              className="w-32 h-32 md:w-40 md:h-40 mb-6 object-contain"
            />
            <h1 className="text-4xl font-bold text-white mb-4 text-center">Contact Us</h1>
            <p className="text-green-100 text-center mb-6 px-4">
              Reach out to us for support, queries, or feedback. We are here to help!
            </p>
            <div className="text-green-100 space-y-3 text-center">
          
              <p>✉️ {settings?.contact_email || "support@bannugul.com"}</p>
              <p>🏠 {settings?.contact_address || "Islamabad, Pakistan"}</p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:w-1/2 p-10 sm:p-14 bg-gray-50 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-green-600 transition shadow-sm">
                <FaUser className="text-green-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-green-600 transition shadow-sm">
                <FaEnvelope className="text-green-600 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-green-600 transition shadow-sm">
                <FaPhone className="text-green-600 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>

              <textarea
                placeholder="Your Message"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition shadow-sm resize-none h-32"
                required
              />

              <button
                type="submit"
                className="bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition font-semibold shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
