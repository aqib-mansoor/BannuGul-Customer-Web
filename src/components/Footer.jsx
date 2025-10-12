import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-full shadow-md">
                <img src="/logo.png" alt="BannuGul Logo" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">BannuGul</h2>
            </div>
            <p className="text-sm text-green-50 leading-relaxed">
              Discover and order from your favorite restaurants quickly and easily.
              We bring flavor and convenience right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-green-400 inline-block pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-green-50">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/orders" className="hover:text-white transition-colors">Orders</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-green-400 inline-block pb-1">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-green-50">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-200" />
                <span>+1-234-567-8900</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-200" />
                <span>support@bannugul.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-200" />
                <span>Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-green-400 inline-block pb-1">
              Stay Updated
            </h3>
            <p className="text-sm text-green-50 mb-3">
              Subscribe to our newsletter for the latest deals and restaurant updates.
            </p>
            <div className="flex w-full max-w-xs bg-white rounded-md overflow-hidden shadow-md mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 p-2 text-gray-700 text-sm outline-none"
              />
              <button className="bg-green-600 px-4 text-white font-semibold hover:bg-green-700 transition-colors">
                Go
              </button>
            </div>

            <div className="flex gap-4">
              <a href="#" className="hover:text-green-100 transition-transform hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-100 transition-transform hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-green-100 transition-transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-300 mt-10 pt-5 text-center text-green-50 text-sm">
          © 2025 <span className="font-semibold text-white">BannuGul</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
