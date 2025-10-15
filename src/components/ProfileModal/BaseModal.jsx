import { X, Mail } from "lucide-react";

export default function BaseModal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-100 animate-fadeIn">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={22} />
        </button>

        {/* 🏷️ Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          {title}
        </h2>

        {/* 🧩 Content */}
        <div className="text-gray-600 space-y-4">{children}</div>

        {/* 📧 Support Email (always shown) */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-green-600" />
            Need help?{" "}
            <a
              href="mailto:support@bannugul.com"
              className="text-green-600 font-medium hover:underline"
            >
              support@bannugul.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
