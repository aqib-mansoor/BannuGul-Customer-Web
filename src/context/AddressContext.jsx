import { createContext, useState, useEffect } from "react";
import { GET, POST } from "../api/httpMethods";
import  URLS  from "../api/urls";


export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const loadSavedAddresses = async () => {
    try {
      const res = await GET(URLS.SHOW_ADDRESSES);
      if (res && res.data && !res.data.error) {
        setSavedAddresses(res.data.records || []);
        const activeAddr =
          res.data.records.find((a) => a.isActive === 1) ||
          res.data.records[0];
        setSelectedAddress(activeAddr || null);
      } else {
        console.warn("No valid data returned from /showAddresses:", res);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  return (
    <AddressContext.Provider
      value={{
        savedAddresses,
        selectedAddress,
        setSelectedAddress,
        loadSavedAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
