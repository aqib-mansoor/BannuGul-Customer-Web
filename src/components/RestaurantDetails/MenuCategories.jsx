// src/components/RestaurantDetails/MenuCategories.jsx
import { useEffect, useState, useRef } from "react";
import {
  Utensils,
  Coffee,
  Pizza,
  Beef,
  Sandwich,
  Salad,
  IceCream,
  Drumstick,
  Search,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { API_IMAGE_URL } from "../../api/axios";
import { GET, POST } from "../../api/httpMethods";
import URLS from "../../api/urls";

export default function MenuCategories({ restaurantId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState("");

  const categoryRefs = useRef({});
  const { cartItems = [], setCartItems } = useCart();

  useEffect(() => {
    if (!restaurantId) return;

    const fetchCategories = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANT_CATEGORIES, { restaurant_id: restaurantId });
        if (!res.data.error && res.data.records) {
          setCategories(res.data.records);
          if (res.data.records.length > 0) setActiveCategory(res.data.records[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load menu categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const scrollToCategory = (id) => {
    const ref = categoryRefs.current[id];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(id);
    }
  };

  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("pizza")) return <Pizza size={16} />;
    if (lower.includes("burger")) return <Beef size={16} />;
    if (lower.includes("drink") || lower.includes("beverage")) return <Coffee size={16} />;
    if (lower.includes("sandwich")) return <Sandwich size={16} />;
    if (lower.includes("salad")) return <Salad size={16} />;
    if (lower.includes("dessert") || lower.includes("ice")) return <IceCream size={16} />;
    if (lower.includes("chicken")) return <Drumstick size={16} />;
    return <Utensils size={16} />;
  };

  const filterProducts = (products) => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCartQuantity = (productId) => {
    const item = cartItems.find((i) => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  const getAuthHeaders = () => {
    const userToken = JSON.parse(localStorage.getItem("user"))?.token;
    if (!userToken) {
      alert("Please login first.");
      throw new Error("No auth token");
    }
    return {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    };
  };

  // ✅ Add or increase quantity
  const handleAdd = async (product) => {
    setError("");
    try {
      const headers = getAuthHeaders();
      const existingItem = cartItems.find((i) => i.product_id === product.id);

      if (!existingItem) {
        // Add new item
        const res = await POST(
          URLS.ADD_TO_CART,
          {
            restaurant_id: restaurantId,
            product_id: product.id,
            quantity: 1,
            special_instructions: "",
            addons: [],
          },
          { headers }
        );

        if (!res.data.error) {
          const newItem = {
            product_id: product.id,
            quantity: 1,
            name: product.name,
            price: product.price,
          };
          setCartItems([...cartItems, newItem]);
        } else {
          setError(res.data.message || "Failed to add item to cart.");
        }
      } else {
        // Increase quantity
        const res = await POST(
          URLS.UPDATE_CART_ITEM,
          {
            product_id: existingItem.product_id,
            quantity: existingItem.quantity + 1,
          },
          { headers }
        );

        if (!res.data.error) {
          setCartItems(
            cartItems.map((i) =>
              i.product_id === existingItem.product_id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          );
        } else {
          setError(res.data.message || "Failed to update cart item.");
        }
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    }
  };

  // ✅ Decrease quantity (no removeToCart API)
  const handleRemove = async (product) => {
    setError("");
    try {
      const headers = getAuthHeaders();
      const existingItem = cartItems.find((i) => i.product_id === product.id);
      if (!existingItem) return;

      const newQuantity = existingItem.quantity - 1;

      if (newQuantity >= 1) {
        const res = await POST(
          URLS.UPDATE_CART_ITEM,
          { product_id: existingItem.product_id, quantity: newQuantity },
          { headers }
        );
        if (!res.data.error) {
          setCartItems(
            cartItems.map((i) =>
              i.product_id === existingItem.product_id ? { ...i, quantity: newQuantity } : i
            )
          );
        } else {
          setError(res.data.message || "Failed to update cart item.");
        }
      }
      // ⚠️ If newQuantity < 1 → we just stop at 1 (no remove API called)
    } catch (err) {
      console.error("Update cart error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading menu...</p>;

  return (
    <div>
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      {/* Tabs + Search */}
      <div className="sticky top-[50vh] md:top-[45vh] z-30 bg-white border-b shadow-md">
        <div className="flex flex-nowrap items-center gap-2 px-2 py-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full transition-all duration-200
                ${activeCategory === cat.id
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:scale-105"
                }`}
            >
              {getIcon(cat.name)}
              <span className="truncate max-w-[70px]">{cat.name}</span>
            </button>
          ))}

          <div className="hidden md:flex items-center bg-green-50 rounded-full px-2 py-1 ml-auto w-full md:w-auto border border-green-300">
            <Search size={16} className="text-green-500" />
            <input
              type="text"
              placeholder="Search item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 w-full text-green-700 placeholder-green-400"
            />
          </div>
        </div>
      </div>

      {/* Categories + Products */}
      <div className="p-2 md:p-6">
        {categories.map((category) => {
          const filteredProducts = filterProducts(category.products || []);
          if (filteredProducts.length === 0) return null;

          return (
            <div
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="mb-8 scroll-mt-[50vh] md:scroll-mt-[45vh]"
            >
              <h2 className="text-lg md:text-xl font-bold mb-3">{category.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {filteredProducts.map((product) => {
                  const quantity = getCartQuantity(product.id);
                  return (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 md:p-4 shadow-sm hover:shadow-lg transition flex gap-3 md:gap-4 items-center"
                    >
                      <img
                        src={`${API_IMAGE_URL}products/${product.image}`}
                        alt={product.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                      />

                      <div className="flex flex-col flex-1">
                        <h3 className="text-sm md:text-base font-semibold">{product.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                          {product.product_description}
                        </p>
                        {product.size && (
                          <p className="text-xs md:text-sm text-gray-600 mt-1">Size: {product.size}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="text-green-600 font-bold text-sm md:text-base">Rs. {product.price}</span>
                            {product.original_price > product.price && (
                              <span className="line-through text-gray-400 text-xs md:text-sm ml-2">
                                Rs. {product.original_price}
                              </span>
                            )}
                          </div>

                          {/* Quantity Selector */}
                          {quantity === 0 ? (
                            <button
                              onClick={() => handleAdd(product)}
                              className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs md:text-sm hover:bg-green-700 transition"
                            >
                              <ShoppingCart size={14} /> Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 md:gap-2 bg-green-100 px-2 py-1 rounded-full">
                              <button
                                onClick={() => handleRemove(product)}
                                className="p-1 md:p-1.5 hover:bg-green-200 rounded-full transition"
                                disabled={quantity <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-green-600 font-medium text-sm md:text-base">{quantity}</span>
                              <button
                                onClick={() => handleAdd(product)}
                                className="p-1 md:p-1.5 hover:bg-green-200 rounded-full transition"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
