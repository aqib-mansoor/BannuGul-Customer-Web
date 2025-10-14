import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function VariationModal({ isOpen, onClose, product = {}, onSelect }) {
  const groups = product?.product_variation_groups || [];
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (isOpen) setSelected({});
  }, [isOpen]);

  const handleSelect = (group, variation) => {
    const max = group.selection || 1;
    setSelected((prev) => {
      const current = prev[group.id] || [];
      const exists = current.find((v) => v.id === variation.id);

      if (exists) {
        return { ...prev, [group.id]: current.filter((v) => v.id !== variation.id) };
      } else {
        if (current.length >= max) {
          return { ...prev, [group.id]: max === 1 ? [variation] : current };
        }
        return { ...prev, [group.id]: [...current, variation] };
      }
    });
  };

  const handleConfirm = () => {
    const allSelected = Object.values(selected).flat();
    if (allSelected.length === 0) return;
    onSelect(allSelected);
    onClose();
  };

  const allRequiredSelected = groups
    .filter((g) => g.required === 1)
    .every((g) => selected[g.id] && selected[g.id].length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
        >
          {/* Container */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
                {product?.name || "Choose Variations"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-6 max-h-[70vh] sm:max-h-[75vh]">
              {groups.length > 0 ? (
                groups.map((group) => {
                  const selectedCount = selected[group.id]?.length || 0;
                  const max = group.selection || 1;
                  return (
                    <div
                      key={group.id}
                      className="border border-gray-100 rounded-xl bg-gray-50/40 p-3 sm:p-4 shadow-sm"
                    >
                      {/* Group Header */}
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                          {group.title || group.name}
                          {group.required ? (
                            <span className="text-red-500 ml-1 text-xs">(Required)</span>
                          ) : (
                            <span className="text-gray-400 ml-1 text-xs">(Optional)</span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {selectedCount}/{max}
                        </span>
                      </div>

                      {/* Variations */}
                      <div className="grid grid-cols-1 gap-2">
                        {group.product_variations.map((v) => {
                          const isSelected = selected[group.id]?.some((sv) => sv.id === v.id);
                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={v.id}
                              onClick={() => handleSelect(group, v)}
                              className={`w-full flex justify-between items-center border rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200 ${
                                isSelected
                                  ? "border-green-500 bg-green-50 shadow-md"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                              }`}
                            >
                              <div className="text-left flex items-center gap-2">
                                {isSelected && (
                                  <Check
                                    size={16}
                                    className="text-green-600 shrink-0"
                                  />
                                )}
                                <p className="text-gray-900 font-medium text-sm sm:text-base">
                                  {v.name}
                                </p>
                              </div>
                              <span
                                className={`font-semibold text-sm sm:text-base ${
                                  isSelected ? "text-green-600" : "text-gray-600"
                                }`}
                              >
                                Rs {v.price}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 text-sm py-8 italic">
                  No variations available
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-white sticky bottom-0 p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between sm:items-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                disabled={!allRequiredSelected}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {allRequiredSelected
                  ? `Add (${Object.values(selected).flat().length}) to Cart`
                  : "Select Required Options"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
