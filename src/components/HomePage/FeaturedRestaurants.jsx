import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { GET, POST } from "../../api/httpMethods";
import URLS, { getRestaurantImageUrl } from "../../api/urls";

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANTS);
        if (res?.data?.records) {
          setRestaurants(res.data.records);
          // Preload favorites if they exist
          const favs = {};
          res.data.records.forEach((r) => {
            favs[r.id] = r.is_favorite === 1; // if your API provides this flag
          });
          setFavorites(favs);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // ✅ Toggle favorite (add/remove)
  const toggleFavorite = async (id) => {
    if (!user) {
      alert("Please log in to manage favorites.");
      return;
    }

    const isLiked = !favorites[id]; // toggle state
    setFavorites((prev) => ({ ...prev, [id]: isLiked })); // Optimistic UI

    try {
      await POST(
        URLS.ADD_FAVORITE,
        {
          restaurant_id: id,
          islike: isLiked ? "1" : "0",
        },
        { Authorization: `Bearer ${user.token}` }
      );
    } catch (err) {
      console.error("Error updating favorite:", err);
      // Rollback UI if failed
      setFavorites((prev) => ({ ...prev, [id]: !isLiked }));
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const placeholderCount = 6;
  const renderItems = loading
    ? Array.from({ length: placeholderCount }).map((_, index) => ({
        placeholder: true,
        id: index,
      }))
    : restaurants.length
    ? restaurants
    : Array.from({ length: placeholderCount }).map((_, index) => ({
        placeholder: true,
        id: index,
      }));

  return (
    <section className="py-6 md:py-8 bg-gradient-to-br from-green-50 to-green-100 animate-gradient">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Featured Restaurants
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Discover the most popular and highly-rated restaurants near you.
        </p>
      </div>

      {/* Carousel */}
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Mobile scroll */}
        <div className="flex gap-3 overflow-x-auto sm:hidden scrollbar-hide">
          {renderItems.map((rest) =>
            rest.placeholder ? (
              <PlaceholderCard key={rest.id} />
            ) : (
              <RestaurantCard
                key={rest.id}
                rest={rest}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                navigate={navigate}
              />
            )
          )}
        </div>

        {/* Desktop scroll */}
        <div className="hidden sm:block relative">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-500/90 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-4"
          >
            {renderItems.map((rest) =>
              rest.placeholder ? (
                <PlaceholderCard key={rest.id} />
              ) : (
                <RestaurantCard
                  key={rest.id}
                  rest={rest}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  navigate={navigate}
                />
              )
            )}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-500/90 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

// 🩶 Placeholder card
function PlaceholderCard() {
  return (
    <div className="relative w-52 rounded-lg shadow bg-gray-200 animate-pulse h-52 flex-shrink-0 cursor-pointer">
      <div className="w-full h-28 rounded-t-lg bg-gray-300" />
      <div className="p-2 flex flex-col justify-between h-24">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-full" />
      </div>
    </div>
  );
}

// 🍽️ Restaurant card
function RestaurantCard({ rest, favorites, toggleFavorite, navigate }) {
  return (
    <div
      className="relative w-52 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 backdrop-blur-sm flex-shrink-0 flex flex-col"
      onClick={() => navigate(`/restaurant/${rest.id}`)}
    >
      {/* ❤️ Favorite */}
      <button
        className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow z-10 hover:scale-110 transition-transform"
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

      {/* 🖼️ Image */}
      <div className="overflow-hidden h-28 rounded-t-xl">
        <img
          src={getRestaurantImageUrl(rest.thumb)}
          alt={rest.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 📋 Info */}
      <div className="p-2 flex flex-col text-center">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {rest.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-snug">
          {rest.description || "Delicious meals and great service."}
        </p>
      </div>
    </div>
  );
}