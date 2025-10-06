import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Tag,
  CircleCheck,
  CircleX,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GET } from "../../api/httpMethods";
import URLS from "../../api/urls";

export default function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [ratings, setRatings] = useState({});
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANTS);
        const data = res.data?.records || [];
        setRestaurants(data);

        const ratingsData = {};
        await Promise.all(
          data.map(async (rest) => {
            try {
              const ratingRes = await GET(URLS.SHOW_RESTAURANT_REVIEWS, { restaurant_id: rest.id });
              const restaurantInfo = ratingRes.data?.restaurant;
              ratingsData[rest.id] = restaurantInfo
                ? {
                    avgRating: restaurantInfo.average_rating,
                    totalReviews: restaurantInfo.total_reviews,
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
        setLoading(false); // stop loading after fetch attempt
      }
    };
    fetchRestaurants();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Placeholder count
  const placeholderCount = 6;

  // Render placeholders if loading, otherwise show restaurants
  const renderItems = loading
    ? Array.from({ length: placeholderCount }).map((_, index) => ({ placeholder: true, id: index }))
    : restaurants.length
    ? restaurants
    : Array.from({ length: placeholderCount }).map((_, index) => ({ placeholder: true, id: index })); // show placeholders if empty

  return (
    <section className="py-6 md:py-8 bg-green-50">
      <div className="text-center max-w-3xl mx-auto mb-6 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Nearby Restaurants
        </h2>
        <p className="text-gray-600 mt-2">
          Explore restaurants near you with quick delivery and great service.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

// Placeholder card matching actual card size
function PlaceholderCard() {
  return (
    <div className="relative flex flex-col bg-gray-200 rounded-lg shadow-sm h-[300px] animate-pulse overflow-hidden cursor-pointer">
      <div className="w-full h-32 sm:h-36 bg-gray-300" />
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>
        <div className="h-3 bg-gray-300 rounded w-full mt-2" />
        <div className="flex flex-wrap gap-1 mt-2">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
}

// Actual restaurant card (unchanged)
function RestaurantCard({ rest, favorites, toggleFavorite, ratings, navigate }) {
  return (
    <div
      className="relative flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/restaurant/${rest.id}`)}
    >
      <button
        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow z-10"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(rest.id);
        }}
      >
        <Heart
          className={`w-5 h-5 ${favorites[rest.id] ? "text-green-600" : "text-gray-400"}`}
          fill={favorites[rest.id] ? "currentColor" : "none"}
        />
      </button>

      <img
        src={`https://bannugul.enscyd.com/bannugul-v2/public/images/restaurants/${rest.thumb || "rest1.jpg"}`}
        alt={rest.name}
        className="w-full h-32 sm:h-36 object-cover"
      />

      <div className="p-3 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
            {rest.name}
          </h3>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded-full">
            ⭐ {ratings[rest.id]?.avgRating || "0.0"} ({ratings[rest.id]?.totalReviews || 0})
          </span>
        </div>

        {rest.description && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
            {rest.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mt-2">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${rest.status === 1
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
