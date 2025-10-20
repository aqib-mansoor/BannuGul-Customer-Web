// src/components/RestaurantDetails/Reviews.jsx
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { GET } from "../../api/httpMethods";
import URLS from "../../api/urls";

export default function Reviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    const fetchReviews = async () => {
      try {
        const res = await GET(
          `${URLS.SHOW_RESTAURANT_REVIEWS}?restaurant_id=${restaurantId}`
        );
        if (res?.data && !res.data.error) {
          setReviews(res.data.records || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [restaurantId]);

  // Desktop drag-to-scroll
  useEffect(() => {
    const slider = document.getElementById("reviews-slider");
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDown = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const mouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };
    const mouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };
    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, [reviews]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        What your fellow diners say
      </h3>

      <div
        id="reviews-slider"
        className="flex gap-4 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 md:w-72 h-32 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))
          : reviews.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 md:w-72 h-32 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-medium text-sm"
              >
                No review yet
              </div>
            ))
          : reviews.map((r) => (
              <div
                key={r.id}
                className="flex-shrink-0 w-64 md:w-72 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {r.user?.name || "Anonymous"}
                  </h4>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={`${
                          s <= r.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{r.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
