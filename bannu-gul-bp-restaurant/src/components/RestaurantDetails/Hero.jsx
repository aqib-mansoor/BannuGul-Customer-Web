// src/components/RestaurantDetails/Hero.jsx
import { useEffect, useState } from "react";
import { Clock, Tag, CircleCheck, CircleX, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Hero({ restaurant }) {
  const [reviewsInfo, setReviewsInfo] = useState({ average_rating: 0, total_reviews: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!restaurant?.id) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get("/api/showRestaurantReviews", {
          params: { restaurant_id: restaurant.id },
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
        setReviewsInfo({ average_rating: 0, total_reviews: 0 });
      }
    };

    fetchReviews();
  }, [restaurant]);

  return (
    <div className="sticky top-0 z-40 w-full h-[50vh] md:h-[45vh] overflow-hidden shadow-md">
      {/* Background Image */}
      <img
        src={
          restaurant.image
            ? `https://bannugul.enscyd.com/bannugul-v2/public/images/restaurants/${restaurant.image}`
            : "/placeholder.png"
        }
        alt={restaurant.name}
        className="w-full h-full object-cover"
      />

      {/* Top Bar with Back */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 z-50">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-md p-2 transition"
        >
          <ArrowLeft size={22} className="text-green-600 cursor-pointer" />
        </button>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 text-white z-40">
        <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-sm md:text-base mt-1">{restaurant.type}</p>
        <p className="text-xs md:text-sm mt-1">
          ⭐ {reviewsInfo.average_rating} ({reviewsInfo.total_reviews} reviews)
        </p>

        <div className="flex flex-wrap gap-2 mt-2 text-xs md:text-sm items-center">
          {/* Status */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
              restaurant.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {restaurant.status === 1 ? <CircleCheck size={12} /> : <CircleX size={12} />}
            {restaurant.status === 1 ? "Open" : "Closed"}
          </span>

          {/* Delivery Time */}
          {restaurant.delivery_time && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              <Clock size={12} /> {restaurant.delivery_time}
            </span>
          )}

          {/* Minimum Order */}
          {restaurant.minimum_order_price && (
            <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              <Tag size={12} /> Min Order: Rs.{restaurant.minimum_order_price}
            </span>
          )}

          {/* Address */}
          {restaurant.address && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
              <MapPin size={12} /> {restaurant.address}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
