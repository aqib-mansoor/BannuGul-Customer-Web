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
import { GET, POST } from "../../api/httpMethods";
import URLS, { getProductImageUrl } from "../../api/urls";
import VariationModal from "../RestaurantDetails/VariationsModal";

export default function MenuCategories({ restaurantId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryRefs = useRef({});
  const { cartItems = [], setCartItems } = useCart();

  // Modal state
  const [isVariationModalOpen, setVariationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🟢 Fetch restaurant categories
  useEffect(() => {
    if (!restaurantId) return;

    const fetchCategories = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANT_CATEGORIES, {
          restaurant_id: restaurantId,
        });

        if (!res.data.error && res.data.records) {
          setCategories(res.data.records);
          if (res.data.records.length > 0)
            setActiveCategory(res.data.records[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurantId]);

  const scrollToCategory = (id) => {
    const ref = categoryRefs.current[id];
    if (ref?.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(id);
    }
  };

  // 🟢 Icon mapper
  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("pizza")) return <Pizza size={14} />;
    if (lower.includes("burger")) return <Beef size={14} />;
    if (lower.includes("drink") || lower.includes("beverage"))
      return <Coffee size={14} />;
    if (lower.includes("sandwich")) return <Sandwich size={14} />;
    if (lower.includes("salad")) return <Salad size={14} />;
    if (lower.includes("dessert") || lower.includes("ice"))
      return <IceCream size={14} />;
    if (lower.includes("chicken")) return <Drumstick size={14} />;
    return <Utensils size={14} />;
  };

  const filterProducts = (products) =>
    !searchQuery.trim()
      ? products
      : products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // 🟢 Get quantity for any product (with or without variations)
  const getCartQuantity = (productId, variationIds = []) => {
    if (!cartItems.length) return 0;
    const variationKey =
      variationIds && variationIds.length > 0
        ? `${productId}-${variationIds.sort().join(",")}`
        : `${productId}`;
    const item = cartItems.find((i) => i.key === variationKey);
    return item ? item.quantity : 0;
  };

  const getAuthHeaders = () => {
    const userToken = JSON.parse(localStorage.getItem("user"))?.token;
    if (!userToken) throw new Error("No auth token found");
    return {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    };
  };

  // 🟢 Open Variation Modal
  const openVariationModal = (product) => {
    const groups = product.product_variation_groups || [];
    const hasVariations = groups.length > 0;
    if (hasVariations) {
      setSelectedProduct(product);
      setVariationModalOpen(true);
    } else {
      handleAdd(product); // directly add if no variations
    }
  };

  // 🟢 Handle variation selection (multi-group)
  const handleVariationSelect = async (selectedVariations) => {
    try {
      const headers = getAuthHeaders();
      const product = selectedProduct;
      if (!product) return;

      const variationIds = selectedVariations.map((v) => v.id);
      const variationKey = `${product.id}-${variationIds.sort().join(",")}`;

      const existingItem = cartItems.find((i) => i.key === variationKey);

      const payload = {
        product_id: product.id,
        variations: variationIds.join(","),
        quantity: existingItem ? existingItem.quantity + 1 : 1,
      };

      const res = await POST(URLS.ADD_TO_CART, payload, { headers });

      if (!res.data.error) {
        if (existingItem) {
          setCartItems((prev) =>
            prev.map((i) =>
              i.key === variationKey ? { ...i, quantity: i.quantity + 1 } : i
            )
          );
        } else {
          const newItem = {
            key: variationKey,
            product_id: product.id,
            variation_ids: variationIds,
            name: `${product.name} (${selectedVariations
              .map((v) => v.name)
              .join(", ")})`,
            quantity: 1,
            price:
              product.price +
              selectedVariations.reduce(
                (sum, v) => sum + (v.price || 0),
                0
              ),
          };
          setCartItems((prev) => [...prev, newItem]);
        }
      }
    } catch (err) {
      console.error("Error adding variation to cart:", err);
    } finally {
      setVariationModalOpen(false);
    }
  };

  // 🟢 Add simple product (no variations)
  const handleAdd = async (product) => {
    try {
      const headers = getAuthHeaders();
      const existingItem = cartItems.find(
        (i) => i.product_id === product.id && !i.variation_ids
      );

      const payload = {
        product_id: product.id,
        variations: "",
        quantity: existingItem ? existingItem.quantity + 1 : 1,
      };

      const res = await POST(URLS.ADD_TO_CART, payload, { headers });

      if (!res.data.error) {
        if (existingItem) {
          setCartItems((prev) =>
            prev.map((i) =>
              i.product_id === product.id && !i.variation_ids
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          );
        } else {
          const newItem = {
            product_id: product.id,
            key: `${product.id}`,
            quantity: 1,
            name: product.name,
            price: product.price,
          };
          setCartItems((prev) => [...prev, newItem]);
        }
      }
    } catch (err) {
      console.error("Cart add error:", err);
    }
  };

  const handleAddClick = (product) => {
    const groups = product.product_variation_groups || [];
    const hasVariations = groups.length > 0;
    if (hasVariations) openVariationModal(product);
    else handleAdd(product);
  };

  // 🟢 Check if product already has a variation item in cart
  const hasProductInCart = (productId) => {
    return cartItems.some((i) => i.product_id === productId);
  };

  // 🟢 UI
  if (loading || categories.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow-sm animate-pulse h-40"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0">
      {/* 🟢 Category Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 bg-gray-50 border-b gap-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1 text-xs md:text-sm font-medium rounded-full transition-all ${
                activeCategory === cat.id
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100"
              }`}
            >
              {getIcon(cat.name)}
              <span className="truncate max-w-[80px] text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-green-50 rounded-full px-3 py-1 w-full md:w-72 border border-green-300">
          <Search size={14} className="text-green-500" />
          <input
            type="text"
            placeholder="Search item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-xs md:text-sm px-2 w-full text-green-700 placeholder-green-400"
          />
        </div>
      </div>

      {/* 🟢 Menu Grid */}
      <div className="p-3 md:p-6">
        {categories.map((category) => {
          const filteredProducts = filterProducts(category.products || []);
          if (filteredProducts.length === 0) return null;

          return (
            <div
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="mb-10 scroll-mt-[100px]"
            >
              <h2 className="text-base md:text-lg font-bold mb-4 text-gray-800 pl-1 md:pl-2">
                {category.name}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => {
                  const hasInCart = hasProductInCart(product.id);
                  const quantity = getCartQuantity(product.id);

                  return (
                    <div
                      key={product.id}
                      className="border rounded-xl p-3 shadow-sm hover:shadow-md bg-white flex flex-col transition-all"
                    >
                      <img
                        src={getProductImageUrl(
                          product.product_images[0]?.image
                        )}
                        alt={product.name}
                        className="w-full h-32 md:h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {product.product_description}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-green-600 font-bold text-sm">
                          Rs. {product.price}
                        </span>

                        {hasInCart ? (
                          <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full">
                            <button
                              className="p-1 hover:bg-green-200 rounded-full transition"
                              disabled
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-green-600 font-medium text-xs">
                              {quantity || 1}
                            </span>
                            <button
                              onClick={() => handleAddClick(product)}
                              className="p-1 hover:bg-green-200 rounded-full transition"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddClick(product)}
                            className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-full text-xs hover:bg-green-700 transition"
                          >
                            <ShoppingCart size={12} /> Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟢 Variation Modal */}
      <VariationModal
        isOpen={isVariationModalOpen}
        onClose={() => setVariationModalOpen(false)}
        product={selectedProduct || {}}
        onSelect={handleVariationSelect}
      />
    </div>
  );
}
