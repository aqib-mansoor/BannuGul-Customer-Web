// src/components/ForgotPasswordModal.jsx
import { useState } from "react";
import { XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { POST } from "../api/httpMethods";
import URLS from "../api/urls";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify + reset
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  if (!isOpen) return null;

  // Utility to show temporary messages
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast("error", "Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await POST(URLS.FORGOT_PASSWORD, { phone });

      if (!res.data.error) {
        showToast("success", res.data.message || "OTP sent successfully!");
        setStep(2);
      } else {
        showToast("error", res.data.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      showToast("error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showToast("error", "Please enter the OTP.");
      return;
    }
    if (!newPassword.trim()) {
      showToast("error", "Please enter your new password.");
      return;
    }

    try {
      setLoading(true);
      const payload = { phone, otp, new_password: newPassword };
      const res = await POST(URLS.RESET_PASSWORD, payload);

      if (!res.data.error) {
        showToast("success", "Password reset successfully!");
        setTimeout(() => handleClose(), 2000);
      } else {
        showToast("error", res.data.message || "Invalid OTP or reset failed.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      showToast("error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setNewPassword("");
    setToast({ type: "", message: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-white/95 rounded-3xl shadow-2xl w-full max-w-md p-8 transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
          {step === 1 ? "Forgot Password" : "Verify & Reset Password"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          {step === 1
            ? "Enter your registered phone number to receive an OTP."
            : "Enter the OTP you received and create a new password."}
        </p>

        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        )}

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-2xl p-4 focus:ring-2 focus:ring-green-600 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP + Reset Password */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndReset} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border border-gray-300 rounded-2xl p-4 focus:ring-2 focus:ring-green-600 shadow-sm"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded-2xl p-4 focus:ring-2 focus:ring-green-600 shadow-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Verify & Reset Password"}
            </button>

            <div className="flex justify-between mt-2 text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-green-600 font-semibold hover:underline"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
