// src/pages/Search.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { GET } from "../../api/httpMethods";
import URLS, { getRestaurantImageUrl, getProductImageUrl } from "../../api/urls"; // ✅ import helpers

export default function Search() {
  const navigate = useNavigate();

  const suggestions = [
    "Search restaurants",
    "Try Pizza, Burgers, Sushi",
    "Find top-rated restaurants nearby",
    "Search for desserts, drinks",
  ];

  const [displayText, setDisplayText] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularRestaurants = ["Pizza Place", "Burger House", "Sushi Corner"];
  const popularProducts = ["Burger", "Pizza", "Fries", "Coke"];

  // Typing animation
  useEffect(() => {
    const currentSuggestion = suggestions[suggestionIndex];
    if (charIndex < currentSuggestion.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentSuggestion[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex(0);
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, suggestionIndex, suggestions]);

  // Fetch search results
  const fetchResults = async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await GET(URLS.SEARCH_RESTAURANTS, { title: searchTerm });
      const data = res?.records || res?.data?.records || [];
      setResults(data);
    } catch (err) {
      console.error("Error searching restaurants:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchResults(query), 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSuggestionClick = (text) => setQuery(text);

  const handleRestaurantClick = (id) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    navigate(`/restaurant/${id}`);
  };

  // ✅ Image handling using your backend structure
  const getImageForRestaurant = (restaurant) => {
    if (restaurant?.thumb) {
      return getRestaurantImageUrl(restaurant.thumb);
    }

    const firstImage = restaurant?.products?.[0]?.product_images?.[0]?.image;
    if (firstImage) {
      return getProductImageUrl(firstImage);
    }

    return "/default-restaurant.jpg";
  };

  return (
    <section className="py-6 bg-green-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
        <div
          className="flex-1 flex items-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <span className="px-4 text-green-600">
            <FiSearch size={22} />
          </span>
          <input
            type="text"
            placeholder={displayText || "Search restaurants, cuisines..."}
            className="flex-1 py-3 pr-4 text-gray-800 focus:outline-none bg-transparent placeholder-gray-400 cursor-pointer"
            readOnly
          />
        </div>
      </div>

      {/* ✅ Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4">
            <motion.div
              className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Search</h2>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                      setResults([]);
                    }}
                    className="text-gray-600 hover:text-red-500 transition"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-green-600 p-3 bg-white rounded-l-full shadow-md">
                    <FiSearch size={22} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search restaurants, products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-3 rounded-r-full shadow-md focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Results */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                {!query && (
                  <div className="mb-6">
                    <h3 className="text-gray-700 font-semibold mb-2">Popular Restaurants:</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {popularRestaurants.map((item, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="bg-green-50 px-3 py-1 rounded-full shadow hover:bg-green-100 transition text-sm"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          {item}
                        </motion.button>
                      ))}
                    </div>

                    <h3 className="text-gray-700 font-semibold mb-2">Popular Products:</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularProducts.map((item, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="bg-green-50 px-3 py-1 rounded-full shadow hover:bg-green-100 transition text-sm"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          {item}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && <p className="text-gray-600 mb-4 animate-pulse">Searching...</p>}

                {results.length === 0 && !loading && query && (
                  <p className="text-gray-500 mb-4">No results found for "{query}"</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {results.map((rest) => (
                    <motion.div
                      key={rest.id}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-3 cursor-pointer border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                      onClick={() => handleRestaurantClick(rest.id)}
                    >
                      <img
                        src={getImageForRestaurant(rest)}
                        alt={rest.name}
                        className="w-full h-40 object-cover rounded-md bg-gray-100"
                        onError={(e) => (e.target.src = "/default-restaurant.jpg")}
                      />

                      <h3 className="text-base font-semibold mt-2 truncate">{rest.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{rest.description}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{rest.address}</p>

                      {rest.products?.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-xs font-medium mb-1">Products:</h4>
                          <ul className="list-disc list-inside text-[11px] text-gray-700">
                            {rest.products.map((prod) => (
                              <motion.li key={prod.id} whileHover={{ scale: 1.05 }} className="mb-0.5">
                                {prod.name} - Rs.{prod.price} ({prod.size})
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
