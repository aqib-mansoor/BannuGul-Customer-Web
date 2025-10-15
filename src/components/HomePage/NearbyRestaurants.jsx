import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Tag,
  CircleCheck,
  CircleX,
  Heart,
  Flame,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GET, POST } from "../../api/httpMethods";
import URLS, { getRestaurantImageUrl } from "../../api/urls";

export default function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [ratings, setRatings] = useState({});
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANTS);
        const data = res.data?.records || [];
        setRestaurants(data);

        // Fetch ratings for each restaurant
        const ratingsData = {};
        await Promise.all(
          data.map(async (rest) => {
            try {
              const ratingRes = await GET(URLS.SHOW_RESTAURANT_REVIEWS, {
                restaurant_id: rest.id,
              });
              const restaurantInfo = ratingRes.data?.restaurant;
              ratingsData[rest.id] = restaurantInfo
                ? {
                    avgRating: parseFloat(restaurantInfo.average_rating) || 0,
                    totalReviews: restaurantInfo.total_reviews || 0,
                  }
                : { avgRating: 0, totalReviews: 0 };
            } catch {
              ratingsData[rest.id] = { avgRating: 0, totalReviews: 0 };
            }
          })
        );
        setRatings(ratingsData);
      } catch (err) {
        console.error("Error fetching nearby restaurants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // 💚 Toggle favorite with API call
  const toggleFavorite = async (id) => {
    const isLiked = !favorites[id]; // next state
    setFavorites((prev) => ({ ...prev, [id]: isLiked })); // Optimistic UI update

    try {
      await POST(URLS.ADD_FAVORITE, {
        restaurant_id: id,
        islike: isLiked ? "1" : "0",
      });
      console.log(
        `✅ ${isLiked ? "Added" : "Removed"} restaurant ${id} to favorites`
      );
    } catch (err) {
      console.error("❌ Error updating favorite:", err);
      // rollback if failed
      setFavorites((prev) => ({ ...prev, [id]: !isLiked }));
    }
  };

  const placeholderCount = 6;
  const renderItems = loading
    ? Array.from({ length: placeholderCount }).map((_, i) => ({
        placeholder: true,
        id: i,
      }))
    : restaurants.length
    ? restaurants
    : Array.from({ length: placeholderCount }).map((_, i) => ({
        placeholder: true,
        id: i,
      }));

  return (
    <section className="py-8 bg-gradient-to-br from-green-50 via-white to-green-100 animate-gradient">
      <div className="text-center max-w-3xl mx-auto mb-8 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Nearby Restaurants
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Discover great food from restaurants around you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {renderItems.map((rest) =>
            rest.placeholder ? (
              <PlaceholderCard key={rest.id} />
            ) : (
              <RestaurantCard
                key={rest.id}
                rest={rest}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                ratings={ratings}
                navigate={navigate}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function PlaceholderCard() {
  return (
    <div className="bg-gray-200 rounded-xl shadow-sm h-[300px] animate-pulse" />
  );
}

function RestaurantCard({ rest, favorites, toggleFavorite, ratings, navigate }) {
  const avgRating = parseFloat(ratings[rest.id]?.avgRating || 0);

  // 🏷️ Determine tag based on real data
  let tagLabel = null;
  let tagColor = "";

  if (avgRating >= 4.5) {
    tagLabel = (
      <>
        <Star size={12} /> Top Rated
      </>
    );
    tagColor = "bg-yellow-500";
  } else if (avgRating >= 4) {
    tagLabel = (
      <>
        <Flame size={12} /> Popular
      </>
    );
    tagColor = "bg-orange-500";
  } else if (rest.status === 1) {
    tagLabel = (
      <>
        <CircleCheck size={12} /> Open Now
      </>
    );
    tagColor = "bg-green-600";
  }

  return (
    <div
      className="group relative bg-white/90 rounded-xl overflow-hidden shadow-md hover:shadow-xl backdrop-blur-sm border border-gray-100 hover:border-green-200 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/restaurant/${rest.id}`)}
    >
      {/* 🔖 Tag */}
      {tagLabel && (
        <div
          className={`absolute top-3 left-3 ${tagColor} text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10`}
        >
          {tagLabel}
        </div>
      )}

      {/* ❤️ Favorite */}
      <button
        className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-md z-10 hover:scale-110 transition-transform"
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
      <div className="overflow-hidden h-40 sm:h-48">
        <img
          src={getRestaurantImageUrl(rest.thumb)}
          alt={rest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 🧾 Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {rest.name}
          </h3>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded-full">
            ⭐ {avgRating.toFixed(1)} ({ratings[rest.id]?.totalReviews || 0})
          </span>
        </div>

        {rest.description && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
            {rest.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mt-3">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
              rest.status === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {rest.status === 1 ? <CircleCheck size={12} /> : <CircleX size={12} />}
            {rest.status === 1 ? "Open" : "Closed"}
          </span>

          {rest.delivery_time && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
              <Clock size={12} /> {rest.delivery_time}
            </span>
          )}

          {rest.type && (
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
              <Tag size={12} /> {rest.type}
            </span>
          )}

          {rest.minimum_order_price && (
            <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
              <Tag size={12} /> Min Rs.{rest.minimum_order_price}
            </span>
          )}

          {rest.address && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs truncate max-w-[200px]">
              <MapPin size={12} /> {rest.address}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
