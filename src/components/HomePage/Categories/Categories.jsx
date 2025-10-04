import { useEffect, useState } from "react";
import { GET } from "../../../api/httpMethods";
import URLS  from "../../../api/urls";
import { API_IMAGE_URL } from "../../../api/axios";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="py-12 px-6 text-center bg-green-50">
        <p className="text-gray-600">Loading categories...</p>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="py-12 px-6 text-center bg-green-50">
        <p className="text-gray-600">No categories found.</p>
      </section>
    );
  }

  return (
    <section className="py-6 px-4 bg-green-50">
      <div className="max-w-6xl mx-auto overflow-hidden">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide py-2">
          {categories.map((cat) => {
            const imageUrl = `${API_IMAGE_URL}${cat.image}`;
            console.log("Image URL for:", cat.name, " => ", imageUrl);

            return (
              <div
                key={cat.id}
                className="flex-shrink-0 w-28 flex flex-col items-center cursor-pointer transition transform hover:scale-105"
              >
                {/* Circle image */}
                <div className="w-24 h-24 rounded-full border-2 border-green-600 overflow-hidden flex items-center justify-center bg-white shadow">
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="w-20 h-20 object-cover rounded-full"
                    onError={(e) => (e.target.src = "/fallback.png")}
                  />
                </div>
                {/* Category name */}
                <span className="mt-2 text-sm font-medium text-gray-800 text-center">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
