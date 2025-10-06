import { useEffect, useState } from "react";
import { GET } from "../../../api/httpMethods";
import URLS from "../../../api/urls";
import { API_IMAGE_URL } from "../../../api/axios";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Number of placeholders to show while loading or if API returns few categories
  const placeholderCount = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await GET(URLS.GET_CATEGORIES);
        console.log("API raw response:", res.data);
        setCategories(Array.isArray(res.data.records) ? res.data.records : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Determine what to render: placeholders or actual categories
  const renderItems = loading
    ? Array.from({ length: placeholderCount }).map((_, index) => ({ placeholder: true, id: index }))
    : [...categories, ...Array(Math.max(0, placeholderCount - categories.length)).fill(null).map((_, i) => ({ placeholder: true, id: i + categories.length }))];

  return (
    <section className="py-6 px-4 bg-green-50">
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2">
          {renderItems.map((item) =>
            item.placeholder ? (
              <div
                key={item.id}
                className="flex-shrink-0 w-28 flex flex-col items-center animate-pulse"
              >
                <div className="w-24 h-24 rounded-full border-2 border-green-600 overflow-hidden flex items-center justify-center bg-gray-300 shadow" />
                <span className="mt-2 h-4 w-16 bg-gray-300 rounded" />
              </div>
            ) : (
              <div
                key={item.id}
                className="flex-shrink-0 w-28 flex flex-col items-center cursor-pointer transition transform hover:scale-105"
              >
                <div className="w-24 h-24 rounded-full border-2 border-green-600 overflow-hidden flex items-center justify-center bg-white shadow">
                  <img
                    src={`${API_IMAGE_URL}${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-full"
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-800 text-center">
                  {item.name}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
