import { useEffect, useState } from "react";
import {
  Clock,
  Tag,
  CircleCheck,
  CircleX,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GET } from "../../api/httpMethods";
import URLS, { getRestaurantImageUrl } from "../../api/urls";

export default function Hero({ restaurant }) {
  const [reviewsInfo, setReviewsInfo] = useState({
    average_rating: 0,
    total_reviews: 0,
  });
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!restaurant?.id) return;

    const fetchReviews = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANT_REVIEWS, {
          restaurant_id: restaurant.id,
        });
        if (!res.data.error && res.data.restaurant) {
          const reviewData = res.data.restaurant;
          setReviewsInfo({
            average_rating: reviewData.average_rating,
            total_reviews: reviewData.total_reviews,
          });
        }
      } catch (err) {
        console.error("Error fetching restaurant reviews:", err);
      }
    };

    fetchReviews();
  }, [restaurant]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 260);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Clean Hero Card */}
      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm p-2 transition z-20"
        >
          <ArrowLeft size={22} className="text-green-600" />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-stretch w-full h-auto md:h-[320px]">
          {/* Left Image */}
          <div className="md:w-[40%] w-full h-[220px] md:h-full">
            <img
              src={getRestaurantImageUrl(restaurant.thumb)}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-[60%] w-full flex flex-col justify-center px-6 py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
              {restaurant.name}
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              {restaurant.type}
            </p>
            <p className="text-gray-700 text-sm md:text-base mt-1">
              ⭐ {reviewsInfo.average_rating} ({reviewsInfo.total_reviews} reviews)
            </p>

            {/* Details Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Open/Closed Status */}
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs md:text-sm ${
                  restaurant.status === 1
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {restaurant.status === 1 ? (
                  <CircleCheck size={14} />
                ) : (
                  <CircleX size={14} />
                )}
                {restaurant.status === 1 ? "Open" : "Closed"}
              </span>

              {/* Delivery Time */}
              {restaurant.delivery_time && (
                <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <Clock size={14} /> {restaurant.delivery_time}
                </span>
              )}

              {/* Min Order */}
              {restaurant.minimum_order_price && (
                <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <Tag size={14} /> Min Order: Rs.{restaurant.minimum_order_price}
                </span>
              )}

              {/* Address */}
              {restaurant.address && (
                <span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  <MapPin size={14} /> {restaurant.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header (on Scroll) */}
      {isSticky && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 h-[65px]">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-full">
            <div className="flex items-center gap-3">
              <img
                src={getRestaurantImageUrl(restaurant.thumb)}
                alt={restaurant.name}
                className="w-10 h-10 rounded-md object-cover"
              />
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900">
                  {restaurant.name}
                </span>
                <span
                  className={`text-xs ${
                    restaurant.status === 1 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {restaurant.status === 1 ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              ⭐ {reviewsInfo.average_rating} ({reviewsInfo.total_reviews})
            </div>
          </div>
        </div>
      )}
    </>
  );
}
