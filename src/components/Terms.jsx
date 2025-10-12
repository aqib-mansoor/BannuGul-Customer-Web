import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Terms({ isOpen, onClose }) {
  // 🔒 Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 sm:px-6">
          {/* 🔙 Click outside to close */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
          />

          {/* 💫 Animated Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-3xl sm:max-w-2xl lg:max-w-4xl p-6 sm:p-8 border border-green-100"
          >
            {/* ❌ Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close terms modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
                Terms & Conditions
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Please review these terms carefully before using our services.
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[70vh] pr-2 text-gray-700 leading-relaxed space-y-5 text-sm sm:text-base">
              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  1. Introduction
                </h3>
                <p>
                  Welcome to <strong>Bannu Gul BP Restaurant</strong> (“we,” “us,” or “our”).
                  By creating an account or using our website or mobile platform,
                  you agree to abide by these Terms & Conditions, our Privacy Policy,
                  and our Content Policies. These terms outline your legal rights and
                  obligations when using our services.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  2. User Responsibilities
                </h3>
                <p>
                  You must be at least 18 years old to register or place orders.
                  You are responsible for ensuring that your account information
                  (including email, password, and phone number) remains accurate and secure.
                </p>
                <p>
                  Any fraudulent or unauthorized activity will result in immediate
                  suspension of your account and potential legal action.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  3. Ordering & Payment
                </h3>
                <p>
                  Orders placed through our platform are subject to availability
                  and restaurant confirmation. Prices and menu items may vary without notice.
                  Payments must be completed through authorized channels — we do not
                  store your payment information directly.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  4. Cancellations & Refunds
                </h3>
                <p>
                  Once an order is confirmed, cancellation requests may not always be honored.
                  Refunds (if applicable) are processed in accordance with our Refund Policy.
                  Please reach out to our support team if you believe you have been
                  incorrectly charged.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  5. Privacy & Data Protection
                </h3>
                <p>
                  We collect personal information (such as name, email, and phone number)
                  solely to facilitate orders and improve user experience. All data is
                  securely stored and never shared with third parties without your consent.
                </p>
                <p>
                  For detailed information, please review our{" "}
                  <a
                    href="/privacy-policy"
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  6. Content & Intellectual Property
                </h3>
                <p>
                  All images, logos, and text displayed on the Bannu Gul BP Restaurant
                  platform are protected under copyright law. Unauthorized copying,
                  reproduction, or distribution of our content is strictly prohibited.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  7. Limitation of Liability
                </h3>
                <p>
                  We strive to provide a seamless experience but cannot be held liable
                  for issues beyond our control such as delivery delays, network errors,
                  or third-party service interruptions.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-green-600 text-lg mb-2">
                  8. Contact & Support
                </h3>
                <p>
                  For inquiries, feedback, or assistance, please visit our{" "}
                  <a
                    href="/contact"
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Contact Us
                  </a>{" "}
                  page or email us at{" "}
                  <a
                    href="mailto:support@bannugul.com"
                    className="text-green-600 hover:underline"
                  >
                    support@bannugul.com
                  </a>
                  .
                </p>
              </section>

              <p className="text-sm text-gray-500 italic mt-6 text-center">
                Last updated: October 2025
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-center sm:justify-end mt-6">
              <button
                onClick={onClose}
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
