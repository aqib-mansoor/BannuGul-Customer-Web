import { useEffect, useState } from "react";
import { X, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import URLS, { getRestaurantImageUrl } from "../api/urls";
import { GET, POST, getAuthHeaders } from "../api/httpMethods";

export default function FavoritesModal({ isOpen, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchFavorites();
  }, [isOpen]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await GET(URLS.SHOW_FAVORITES, {}, { headers: getAuthHeaders() });
      if (Array.isArray(res.data?.records)) {
        const favs = res.data.records.map((f) => ({
          id: f.id,
          restaurant: f.restaurant,
        }));
        setFavorites(favs);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Toggle favourite (add/remove)
  const toggleFavorite = async (restaurantId, isLiked) => {
    setUpdating(restaurantId);

    // Optimistic UI update
    setFavorites((prev) =>
      isLiked
        ? prev.filter((f) => f.restaurant.id !== restaurantId)
        : [
            ...prev,
            {
              id: Math.random(),
              restaurant: { id: restaurantId, name: "Updating...", thumb: "" },
            },
          ]
    );

    try {
      await POST(
        URLS.ADD_FAVORITE,
        { restaurant_id: restaurantId, islike: isLiked ? "0" : "1" },
        { headers: getAuthHeaders() }
      );

      await fetchFavorites();

      // ✅ Notify other components to refresh favorites
      window.dispatchEvent(new Event("favoriteUpdated"));
    } catch (err) {
      console.error("❌ Error updating favorite:", err);
      fetchFavorites();
    } finally {
      setUpdating(null);
    }
  };

  // ✅ When modal closes, trigger re-fetch for other components
  const handleClose = () => {
    window.dispatchEvent(new Event("favoriteUpdated"));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-500">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-white" fill="white" />
            Favourite Restaurants
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 bg-gradient-to-br from-green-50 via-white to-green-100">
          {loading ? (
            <p className="text-center text-gray-500 py-10 animate-pulse">
              Loading favourites...
            </p>
          ) : favorites.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 font-medium">
                You haven’t added any favourites yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => {
                const rest = fav.restaurant;
                const isLiked = true;
                const isUpdating = updating === rest.id;

                return (
                  <div
                    key={rest.id}
                    className="group relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/restaurant/${rest.id}`)}
                    >
                      <img
                        src={
                          rest.thumb
                            ? getRestaurantImageUrl(rest.thumb)
                            : "/placeholder_restaurant.png"
                        }
                        alt={rest.name}
                        className="w-full h-36 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* ❤️ Favorite Heart */}
                    <button
                      disabled={isUpdating}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(rest.id, isLiked);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow hover:scale-110 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isLiked ? "text-green-600" : "text-gray-400"
                        }`}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Info */}
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => navigate(`/restaurant/${rest.id}`)}
                    >
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {rest.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {rest.address || "No address available"}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        ⏱ {rest.delivery_time || "N/A"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 py-3 flex justify-center bg-white">
          <button
            onClick={handleClose}
            className="px-8 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-medium shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
