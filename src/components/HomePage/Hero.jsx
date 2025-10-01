// src/components/Hero.jsx
import { useState, useEffect, useContext } from "react";
import { MapPin } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import AddAddressModal from "../Addresses/AddAddressModal";
import ExistingAddresses from "../Addresses/ExistingAddresses";
import { AddressContext } from "../../context/AddressContext";

export default function Hero() {
  const [modalType, setModalType] = useState(null); // "add" or "existing"
  const { selectedAddress, setSelectedAddress } = useContext(AddressContext);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Load saved addresses from API
  const loadSavedAddresses = async () => {
    try {
      const res = await api.get("/api/showAddresses");
      if (!res.data.error) {
        setSavedAddresses(res.data.records || []);
        if (res.data.records.length > 0 && !selectedAddress) {
          const activeAddr =
            res.data.records.find((addr) => addr.isActive === 1) ||
            res.data.records[0];
          setSelectedAddress(activeAddr);
        }
      }
    } catch (err) {
      console.error("Error loading addresses:", err.message);
    }
  };

  // Set active address on backend
  const setActiveAddress = async (address) => {
    if (!address) return;
    try {
      await api.post("/api/setActiveAddress", { id: address.id });
      setSelectedAddress(address);
    } catch (err) {
      console.error("Error setting active address:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  return (
    <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex flex-col justify-center items-center text-center text-white overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/video-1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 md:px-10 max-w-3xl w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg text-center">
          Savor the Taste of Fresh & Delicious Meals
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-green-100 text-center">
          Order from top restaurants near you and enjoy piping-hot dishes delivered straight
          to your door in minutes!
        </p>

        {/* Address input + Add Address button */}
        <div className="mt-6 flex flex-nowrap items-center justify-center w-full gap-3">
          {/* Address input */}
          <div className="relative flex-1 min-w-0">
            <div
              className="relative cursor-pointer"
              onClick={() => setModalType("existing")}
            >
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 w-5 h-5" />
              <input
                type="text"
                readOnly
                placeholder="Enter your address here"
                value={selectedAddress?.address || ""}
                className="w-full pl-10 pr-3 py-3 text-black rounded-lg border border-gray-300 focus:outline-none shadow-sm cursor-pointer truncate"
              />
            </div>
          </div>

          {/* Add Address button */}
          <button
            onClick={() => setModalType("add")}
            className="flex-shrink-0 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition whitespace-nowrap"
          >
            Add Address
          </button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalType === "add" && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <AddAddressModal
              onClose={() => setModalType(null)}
              reloadAddresses={loadSavedAddresses}
              setSelectedAddress={setSelectedAddress}
            />
          </div>
        )}
        {modalType === "existing" && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <ExistingAddresses
              onClose={() => setModalType(null)}
              savedAddresses={savedAddresses}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              setActiveAddress={setActiveAddress}
              onAddNewAddress={() => setModalType("add")}
            />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
