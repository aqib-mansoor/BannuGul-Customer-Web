// src/components/orderDetails/OrderDetailsModal.jsx
import React, { useState } from "react";
import api from "../../api/axios";
import Lottie from "lottie-react";
import { MapPin, Store, Calendar, Hash, Phone, X } from "lucide-react";
import "../../styles/scrollbar.css";

// Import animations
import cancelAnim from "../../assets/lottie/cancel_state.json";
import pendingAnim from "../../assets/lottie/pending_state.json";
import preparingAnim from "../../assets/lottie/order_preparing.json";
import dispatchedAnim from "../../assets/lottie/delivery_anim.json";
import deliveredAnim from "../../assets/lottie/checked-done.json";

export default function OrderDetailsModal({
  selectedOrder,
  closeModal,
  detailsLoading,
  refreshOrders,
}) {
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showCancelField, setShowCancelField] = useState(false);

  // 🔔 Alert State
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  if (!selectedOrder) return null;

  // Normalize backend status
  let currentStatus = selectedOrder.order_summary.status?.toLowerCase();
  if (currentStatus === "canceled_by_user" || currentStatus === "cancelled_by_user") {
    currentStatus = "cancelled";
  } else if (currentStatus === "preparing" || currentStatus === "processing") {
    currentStatus = "processing";
  } else if (currentStatus === "ready_to_deliver") {
    currentStatus = "dispatched";
  } else if (currentStatus === "pending") {
    currentStatus = "pending";
  } else if (currentStatus === "accepted") {
    currentStatus = "accepted";
  } else if (currentStatus === "DELIVERED") {
    currentStatus = "DELIVERED";
  }

  const statusSteps = [
    { name: "pending", label: "Pending" },
    { name: "accepted", label: "Accepted" },
    { name: "processing", label: "Processing" },
    { name: "dispatched", label: "Dispatched" },
    { name: "delivered", label: "Delivered" },
  ];

  const getLottieAnimation = () => {
    switch (currentStatus) {
      case "pending":
        return pendingAnim;
      case "accepted":
        return deliveredAnim;
      case "processing":
        return preparingAnim;
      case "dispatched":
        return dispatchedAnim;
      case "delivered":
        return deliveredAnim;
      case "cancelled":
        return cancelAnim;
      default:
        return null;
    }
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      showAlert("⚠️ Please provide a reason for cancellation", "error");
      return;
    }
    try {
      setCancelling(true);
      const res = await api.post(
        "/api/orderCancelUser",
        {
          order_id: selectedOrder.order_summary.order_id,
          reason: cancelReason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!res.data.error) {
        showAlert("✅ Order cancelled successfully", "success");
        setTimeout(() => {
          closeModal();
          refreshOrders();
        }, 1500);
      }
    } catch (err) {
      console.error("Error cancelling order:", err.response?.data || err.message);
      showAlert("❌ Failed to cancel order. Try again later.", "error");
    } finally {
      setCancelling(false);
    }
  };

  const lottieAnimation = getLottieAnimation();

  const deliveryFee =
    selectedOrder.order_summary.delivery_charges ||
    selectedOrder.delivery_charges ||
    0;

  const subTotal = selectedOrder.order_summary.total_price - deliveryFee;
  const grandTotal = selectedOrder.order_summary.total_price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-auto max-h-[85vh] flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-green-600">Order Details</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            <X size={22} />
          </button>
        </div>

        {alertMessage && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-semibold text-white ${
              alertType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {alertMessage}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 px-6 py-4 overflow-y-auto scrollbar-hide">
          {detailsLoading ? (
            <p className="text-center text-green-600">Loading details...</p>
          ) : (
            <>
              {/* Top Info */}
              <div className="mb-5">
                <h1 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">
                  <Store size={18} className="text-green-700" />
                  {selectedOrder.restaurant?.name}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2">
                    <Hash size={14} className="text-green-600" />
                    Order #: {selectedOrder.order_summary.order_number}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-green-600" />
                    {new Date(selectedOrder.order_summary.order_date).toLocaleString()}
                  </p>
                  {selectedOrder.restaurant?.phone && (
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-green-600" />
                      {selectedOrder.restaurant.phone}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Store size={14} className="text-green-600" />
                    {selectedOrder.restaurant?.address}
                  </p>
                </div>
              </div>

              {/* Lottie Animation */}
              {lottieAnimation && (
                <div className="flex justify-center mb-4">
                  <Lottie animationData={lottieAnimation} loop className="w-28 h-28" />
                </div>
              )}

              {/* Status Stepper */}
              {currentStatus !== "cancelled" && (
                <div className="flex justify-between items-center mb-5">
                  {statusSteps.map((step, index) => {
                    const currentIndex = statusSteps.findIndex(
                      (s) => s.name === currentStatus
                    );
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div
                        key={step.name}
                        className="flex-1 flex flex-col items-center relative"
                      >
                        <div className="flex items-center w-full">
                          {index !== 0 && (
                            <div
                              className={`flex-1 h-1 ${
                                index <= currentIndex ? "bg-green-600" : "bg-gray-300"
                              }`}
                            />
                          )}
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full z-10
                              ${
                                isCompleted
                                  ? "bg-green-600 text-white"
                                  : isCurrent
                                  ? "bg-green-300 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}
                          >
                            <span className="text-xs font-semibold">{index + 1}</span>
                          </div>
                          {index !== statusSteps.length - 1 && (
                            <div
                              className={`flex-1 h-1 ${
                                index < currentIndex ? "bg-green-600" : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium text-center mt-1 ${
                            isCompleted
                              ? "text-green-600"
                              : isCurrent
                              ? "text-green-800"
                              : "text-gray-500"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order Summary */}
              <div className="border rounded-lg p-3 mb-4">
                <h3 className="text-md font-semibold text-green-600 mb-2">
                  Order Summary
                </h3>
                <ul className="divide-y divide-gray-200 mb-3">
                  {selectedOrder.order_items.map((item) => (
                    <li
                      key={item.id}
                      className="py-1 flex justify-between text-xs items-center"
                    >
                      <span>
                        {item.product.name} {item.size && `(${item.size})`} × {item.quantity}
                      </span>
                      <span className="text-green-600">Rs. {item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {subTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rs. {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-green-600">Rs. {grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              {currentStatus === "pending" && (
                <div>
                  {!showCancelField ? (
                    <button
                      onClick={() => setShowCancelField(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition text-sm"
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Reason for cancellation"
                        className="w-full border rounded-lg p-2 text-sm"
                        rows={2}
                      />
                      <button
                        onClick={submitCancel}
                        disabled={cancelling}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition text-sm"
                      >
                        {cancelling ? "Cancelling..." : "Submit Cancellation"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
