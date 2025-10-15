// src/context/FavoritesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { GET, POST } from "../api/httpMethods";
import URLS from "../api/urls";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all favorites from backend
  const fetchFavorites = async () => {
    try {
      const res = await GET(URLS.SHOW_FAVORITES);
      const records = res.data?.records || [];
      const favMap = {};
      records.forEach((f) => {
        if (f.restaurant?.id) favMap[f.restaurant.id] = true;
      });
      setFavorites(favMap);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Toggle favorite and sync with backend
  const toggleFavorite = async (id) => {
    const isLiked = !favorites[id];
    setFavorites((prev) => ({ ...prev, [id]: isLiked }));

    try {
      await POST(URLS.ADD_FAVORITE, {
        restaurant_id: id,
        islike: isLiked ? "1" : "0",
      });
      await fetchFavorites();
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, fetchFavorites, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
