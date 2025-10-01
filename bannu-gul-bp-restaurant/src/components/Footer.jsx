import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-500 via-teal-400 to-lime-400 text-gray-200 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="bg-white p-4 rounded-full shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="BannuGul Logo" className="h-14 w-14" />
          </div>
          <span className="text-2xl font-bold text-white">BannuGul</span>
          <p className="text-gray-200 text-center md:text-left text-sm">
            Discover and order from your favorite restaurants quickly and easily.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 text-gray-200">
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <a href="/" className="hover:text-green-100 transition-colors">Home</a>
          <a href="/orders" className="hover:text-green-100 transition-colors">Orders</a>
          <a href="/about" className="hover:text-green-100 transition-colors">About Us</a>
          <a href="/contact" className="hover:text-green-100 transition-colors">FAQ</a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 text-gray-200">
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <div className="flex items-center gap-3 hover:text-white transition-colors">
            <Phone className="w-5 h-5 text-green-100" />
            <span>+1-234-567-8900</span>
          </div>
          <div className="flex items-center gap-3 hover:text-white transition-colors">
            <Mail className="w-5 h-5 text-green-100" />
            <span>support@bannugul.com</span>
          </div>
          <div className="flex items-center gap-3 hover:text-white transition-colors">
            <MapPin className="w-5 h-5 text-green-100" />
            <span>Islamabad, Pakistan</span>
          </div>
        </div>

        {/* Newsletter & Social Media */}
        <div className="flex flex-col gap-4 text-gray-200">
          <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
          <p className="text-gray-100 text-sm">Subscribe to our newsletter for latest offers.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 rounded-l-md outline-none text-gray-900"
            />
            <button className="bg-white text-green-600 px-4 rounded-r-md font-semibold hover:bg-green-100 transition-colors">
              Subscribe
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-green-100 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-100 transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-100 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-green-200 mt-10 pt-6 text-center text-gray-100 text-sm">
        &copy; 2025 BannuGul. All rights reserved.
      </div>
    </footer>
  );
}
