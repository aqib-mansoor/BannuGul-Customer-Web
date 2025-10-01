// src/components/ExistingAddresses.jsx
import { motion } from "framer-motion";
import { X, Check, Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { useState } from "react";

export default function ExistingAddresses({
  onClose,
  savedAddresses,
  selectedAddress,
  setSelectedAddress,
  setActiveAddress,
  onAddNewAddress,
  onDeleteSuccess,
}) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success"); // success / error
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Show temporary alert
  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirmDeleteId) {
      // First click asks for confirmation
      setConfirmDeleteId(id);
      return;
    }

    try {
      const response = await api.delete("/api/removeAddress", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        data: { id },
      });

      if (!response.data.error) {
        showAlert("Address deleted successfully", "success");
        setConfirmDeleteId(null);

        if (typeof onDeleteSuccess === "function") {
          onDeleteSuccess(id);
        }
      } else {
        showAlert(response.data.error_msg || "Failed to delete address", "error");
      }
    } catch (err) {
      console.error("❌ Error deleting address:", err.response?.data || err.message);
      showAlert("Failed to delete address. Try again later.", "error");
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative"
    >
      {/* Alert */}
      {alertMessage && (
        <div
          className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg font-semibold text-white ${
            alertType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alertMessage}
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
      >
        <X size={22} />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Select Address
      </h2>

      {/* Address list */}
      <div className="max-h-96 overflow-y-auto no-scrollbar space-y-3">
        {savedAddresses.length > 0 ? (
          savedAddresses.map((addr) => {
            const isSelected = selectedAddress?.id === addr.id;
            return (
              <div
                key={addr.id}
                className={`flex items-start justify-between gap-3 p-4 rounded-xl border transition
                  ${
                    isSelected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:bg-green-100"
                  }`}
              >
                <label className="flex-1 flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="modalAddress"
                    checked={isSelected}
                    onChange={async () => {
                      await setActiveAddress(addr);
                      setSelectedAddress(addr);
                      onClose();
                    }}
                    className="accent-green-600 w-4 h-4 mt-1"
                  />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                      {addr.title}
                      {isSelected && <Check className="w-4 h-4 text-green-600" />}
                    </span>
                    <span className="text-sm text-gray-600">{addr.address}</span>
                  </div>
                </label>

                {/* Trash icon for delete */}
<button
  onClick={(e) => {
    e.stopPropagation(); // ✅ prevent radio selection
    handleDelete(addr.id);
  }}
  className="text-gray-400 hover:text-red-600 transition"
>
  <Trash2 size={20} />
</button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No saved addresses</p>
        )}
      </div>

      {/* Add new address button */}
      <button
        onClick={() => {
          onClose();
          if (typeof onAddNewAddress === "function") onAddNewAddress();
        }}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
      >
        <Plus className="w-5 h-5" />
        Add New Address
      </button>
    </motion.div>
  );
}
