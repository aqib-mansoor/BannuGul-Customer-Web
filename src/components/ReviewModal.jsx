// src/components/ReviewModal.jsx
import { useState, useEffect } from "react";
import { X, Star, CheckCircle2 } from "lucide-react";
import { POST, getAuthHeaders } from "../api/httpMethods";
import URLS from "../api/urls";

export default function ReviewModal({ isOpen, onClose, orderId, restaurant, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const payload = {
        restaurant_id: restaurant?.id,
        rating,
        comment: review,
        order_id: orderId,
      };

      const res = await POST(URLS.ADD_REVIEW, payload, { headers });

      if (res?.data && res.data.error === false) {
        setSuccess(true);
        setRating(0);
        setReview("");

        // ✅ notify parent
        if (onSubmitted) onSubmitted(orderId);

        // ✅ keep success modal for at least 30s
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 30000);
      } else {
        alert(res?.data?.error_msg || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3 sm:px-0">
      <div className="bg-white rounded-3xl w-full max-w-md sm:max-w-lg p-5 sm:p-8 shadow-2xl relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        {!success ? (
          <>
            <h2 className="text-base sm:text-lg font-semibold text-center text-gray-800 mt-1 mb-1">
              Rate your experience with
            </h2>
            <p className="text-center text-green-600 font-medium text-sm sm:text-base mb-5">
              {restaurant?.name || "this restaurant"}
            </p>

            <div className="flex justify-center mb-5 space-x-1 sm:space-x-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || rating);
                return (
                  <Star
                    key={star}
                    size={28}
                    onClick={() => !loading && setRating(star)}
                    onMouseEnter={() => !loading && setHoverRating(star)}
                    onMouseLeave={() => !loading && setHoverRating(0)}
                    className={`cursor-pointer transition-all transform hover:scale-110 ${
                      filled
                        ? "fill-amber-400 text-amber-400 drop-shadow-md"
                        : "text-gray-300 hover:text-amber-300"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                );
              })}
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              placeholder="Share your thoughts about the food or delivery..."
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none shadow-sm placeholder-gray-400"
              disabled={loading}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-5 w-full py-2.5 sm:py-3 rounded-full text-white font-medium shadow-md transition-all duration-200 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 animate-fadeIn text-center">
            <CheckCircle2
              className="text-green-600 mb-3 animate-bounce"
              size={56}
              strokeWidth={1.5}
            />
            <h3 className="text-green-700 font-semibold text-base sm:text-lg">
              Thank you!
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Your review has been submitted successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
