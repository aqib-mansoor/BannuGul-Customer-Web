import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import api from "../../../api/axios"; // adjust path as needed
import { Heart } from "lucide-react"; // ✅ favorite icon

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState({}); // ✅ track favorites
  const navigate = useNavigate(); // ✅ init navigate

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/api/showRestaurants");
        console.log("Restaurants API response:", res.data);

        setRestaurants(Array.isArray(res.data.records) ? res.data.records : []);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };

    fetchRestaurants();
  }, []);

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!restaurants.length) return null; // or loading state

  return (
    <section className="py-6 md:py-8 bg-green-50">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Featured Restaurants
        </h2>
        <p className="text-gray-600 mt-2">
          Discover the most popular and highly-rated restaurants near you.
        </p>
      </div>

      {/* Restaurants */}
      <div className="max-w-6xl mx-auto px-4">
        {/* ✅ Mobile (horizontal scroll) */}
        <div className="flex gap-4 overflow-x-auto sm:hidden scrollbar-hide">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="relative flex-shrink-0 w-56 rounded-lg shadow hover:shadow-lg cursor-pointer bg-white"
              onClick={() => navigate(`/restaurant/${rest.id}`)}
            >
              {/* Favorite Icon */}
              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigation
                  toggleFavorite(rest.id);
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites[rest.id] ? "text-green-600" : "text-gray-400"
                  }`}
                  fill={favorites[rest.id] ? "currentColor" : "none"}
                />
              </button>

              <img
                src={
                  rest.image
                    ? `https://bannugul.enscyd.com/bannugul-v2/public/images/restaurants/${rest.image}`
                    : "/placeholder.png"
                }
                alt={rest.name}
                className="w-full h-36 object-cover rounded-t-lg"
              />
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-800">{rest.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {rest.description || "Delicious meals and great service."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="relative rounded-lg shadow hover:shadow-lg cursor-pointer bg-white"
              onClick={() => navigate(`/restaurant/${rest.id}`)}
            >
              {/* Favorite Icon */}
              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(rest.id);
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites[rest.id] ? "text-green-600" : "text-gray-400"
                  }`}
                  fill={favorites[rest.id] ? "currentColor" : "none"}
                />
              </button>

              <img
                src={
                  rest.image
                    ? `https://bannugul.enscyd.com/bannugul-v2/public/images/restaurants/${rest.image}`
                    : "/placeholder.png"
                }
                alt={rest.name}
                className="w-full h-36 object-cover rounded-t-lg"
              />
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-800">{rest.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {rest.description || "Delicious meals and great service."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
