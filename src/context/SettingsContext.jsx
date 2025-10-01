import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/showSettings");
        if (res && res.data && !res.data.error) {
          setSettings(res.data.records?.[0] || null); // safely take first record
        } else {
          console.warn("No valid data returned from /showSettings:", res);
        }
      } catch (err) {
        console.error("Error fetching app settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
