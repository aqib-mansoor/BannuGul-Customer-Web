// src/pages/Contact.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaTag } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SettingsContext } from "../context/SettingsContext";
import { BASE_URL } from "../api/urls";
import URLS from "../api/urls";

export default function Contact() {
  const { settings, loading } = useContext(SettingsContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await axios.post(`${BASE_URL}${URLS.CONTACT}`, {
        name,
        email,
        phone,
        title,
        description,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage({ type: "success", text: "✅ Message sent successfully!" });
        setName("");
        setEmail("");
        setPhone("");
        setTitle("");
        setDescription("");
      } else {
        setMessage({
          type: "error",
          text: "⚠️ Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
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
          <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-emerald-500 flex flex-col items-center justify-center p-8 relative">
            <img
              src="/contact.png"
              alt="Contact"
              className="w-32 h-32 md:w-40 md:h-40 mb-6 object-contain"
            />
            <h1 className="text-4xl font-bold text-white mb-4 text-center">
              Contact Us
            </h1>
            <p className="text-green-100 text-center mb-6 px-4">
              Reach out to us for support, queries, or feedback. We’re happy to
              help!
            </p>
            <div className="text-green-100 space-y-3 text-center">
              <p>✉️ {settings?.contact_email || "support@bannugul.com"}</p>
              <p>🏠 {settings?.contact_address || "Islamabad, Pakistan"}</p>
              <p>📞 {settings?.contact_phone || "+92 300 0000000"}</p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="md:w-1/2 p-10 sm:p-14 bg-gray-50 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
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

              {/* Email */}
              <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-green-600 transition shadow-sm">
                <FaEnvelope className="text-green-600 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>

              {/* Phone */}
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

              {/* Title */}
              <div className="flex items-center gap-3 border border-gray-300 p-4 rounded-2xl focus-within:ring-2 focus-within:ring-green-600 transition shadow-sm">
                <FaTag className="text-green-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Message Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 outline-none text-sm"
                  required
                />
              </div>

              {/* Message */}
              <textarea
                placeholder="Your Message"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition shadow-sm resize-none h-32"
                required
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-4 rounded-2xl font-semibold shadow-md transition-all ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* Response Message */}
            {message && (
              <p
                className={`mt-4 text-center font-medium ${
                  message.type === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
