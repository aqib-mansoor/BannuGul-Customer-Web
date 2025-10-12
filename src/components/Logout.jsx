// src/components/Logout.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onLogout }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Confirm Logout
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition text-center"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition text-center"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
