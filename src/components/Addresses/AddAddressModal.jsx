import { useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { X } from "lucide-react";
import L from "leaflet";
import { POST } from "../../api/httpMethods";
import URLS from "../../api/urls";


const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function AddAddressModal({ onClose, reloadAddresses, setSelectedAddress }) {
  const [location, setLocation] = useState({ lat: 33.6844, lng: 73.0479 });
  const [title, setTitle] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [pinnedAddress, setPinnedAddress] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleSaveAddress = async () => {
    if (!title || !houseAddress) {
      alert("Please enter Title and House Address before saving!");
      return;
    }

    try {
      const res = await POST(URLS.ADD_ADDRESS, {
        address: houseAddress,
        title: title,
        location: `${location.lat},${location.lng}`,
        gps_address: pinnedAddress || `${location.lat}° N, ${location.lng}° E`,
        city: "Islamabad",
      });


      console.log("Address added:", res.data);

      if (reloadAddresses) await reloadAddresses();

      if (res.data.records && res.data.records.length > 0) {
        const newAddress = res.data.records[res.data.records.length - 1];
        setSelectedAddress(newAddress); // full object, not just id
        localStorage.setItem("activeAddress", JSON.stringify(newAddress));

      }

      setTitle("");
      setHouseAddress("");
      setPinnedAddress("");
      setShowMap(false);
      onClose();
    } catch (err) {
      console.error("Error adding address:", err.response?.data || err.message);
      alert("Failed to add address. Make sure you are logged in.");
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
      >
        <X size={22} />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Add New Address
      </h2>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Title e.g. Home, Work"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-black border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="House Address"
          value={houseAddress}
          onChange={(e) => setHouseAddress(e.target.value)}
          className="w-full text-black border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Pinned Location (click to show map)"
          value={pinnedAddress}
          readOnly
          onFocus={() => setShowMap(true)}
          className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
        />
        {showMap && (
          <div className="mt-2 h-64 rounded-lg overflow-hidden">
            <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.lat, location.lng]} icon={customIcon} />
              <LocationSelector
                onSelect={(latlng) => {
                  setLocation(latlng);
                  setPinnedAddress(`Lat: ${latlng.lat.toFixed(5)}, Lng: ${latlng.lng.toFixed(5)}`);
                }}
              />
            </MapContainer>
          </div>
        )}
        <button
          onClick={handleSaveAddress}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Save Address
        </button>
      </div>
    </motion.div>
  );
}
