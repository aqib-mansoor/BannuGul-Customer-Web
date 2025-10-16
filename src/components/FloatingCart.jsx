// src/components/FloatingCart.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Percent,
  Edit,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { SettingsContext } from "../context/SettingsContext";
import deliveryBoyIcon from "../assets/delivery-boy.png";
import { motion, AnimatePresence } from "framer-motion";
import { AddressContext } from "../context/AddressContext";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import ExistingAddresses from "./Addresses/ExistingAddresses";
import AddAddressModal from "./Addresses/AddAddressModal";
import "../styles/scrollbar.css";
import Lottie from "lottie-react";
import { GET, POST, DELETE } from "../api/httpMethods";
import URLS from "../api/urls";
import { getProductImageUrl, getRestaurantImageUrl } from "../api/urls";
import checkedDone from "../assets/lottie/checked-done.json";


export default function FloatingCart() {
  const { cartItems, setCartItems } = useCart();
  const { settings } = useContext(SettingsContext);
  const { selectedAddress, setSelectedAddress } = useContext(AddressContext);
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [modalType, setModalType] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const DELIVERY_CHARGE = Number(settings?.delivery_charges || 0);
  //const TAX_PERCENTAGE = Number(settings?.tax_percentage || 0);
  const CURRENCY = settings?.currency || "Rs";
  const ESTIMATED_TIME = settings?.max_delivery_time || "30-40 min";

  const getAuthHeaders = () => {
    const userToken = JSON.parse(localStorage.getItem("user"))?.token;
    if (!userToken) throw new Error("No auth token");
    return { Authorization: `Bearer ${userToken}`, "Content-Type": "application/json" };
  };

  const setActiveAddressAPI = async (address) => {
    try {
      const headers = getAuthHeaders();
      await POST(URLS.SET_ACTIVE_ADDRESS, { id: address.id }, { headers });
      setSelectedAddress(address);
      localStorage.setItem("activeAddress", JSON.stringify(address));
    } catch (err) {
      console.error("Error setting active address:", err.response?.data || err.message);
    }
  };

  // Fetch cart items and addresses
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);

    const fetchCart = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await GET(URLS.SHOW_CART_PRODUCTS, { headers });
        if (!res.data.error) {
          const cartData = res.data.records || [];

          // ✅ include total_amount, total_items if needed
          setCartItems(cartData);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };



    const fetchAddresses = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await GET(URLS.SHOW_ADDRESSES, { headers });
        if (!res.data.error) {
          setSavedAddresses(res.data.records || []);
          if (!selectedAddress && res.data.records.length > 0) {
            const activeAddr = res.data.records.find(a => a.isActive === 1) || res.data.records[0];
            await setActiveAddressAPI(activeAddr);
          }
        }
      } catch (err) { console.error(err); }
    };

    fetchCart();
    fetchAddresses();
  }, [isOpen]);

  // Totals
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.quantity * (item?.product?.price || 0)),
    0
  );

  const discount = voucher ? 50 : 0;
  const total = subtotal + DELIVERY_CHARGE - discount;

  //const taxAmount = ((subtotal - discount + DELIVERY_CHARGE) * TAX_PERCENTAGE) / 100;
  // ✅ Increase quantity
  const handleIncrease = async (item) => {
    try {
      const headers = getAuthHeaders();
      const cartId = item.cart_id || item.id; // fallback if one is missing

      const body = { cart_id: cartId, quantity: item.quantity + 1 };
      await POST(URLS.UPDATE_CART_ITEM, body, { headers });

      setCartItems((prev) =>
        prev.map((i) =>
          i.cart_id === cartId || i.id === cartId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } catch (err) {
      console.error("❌ Error updating quantity:", err.response?.data || err.message);
    }
  };

  // ✅ Decrease quantity
  const handleDecrease = async (item) => {
    try {
      const headers = getAuthHeaders();
      const cartId = item.cart_id || item.id;
      const newQty = item.quantity - 1;

      if (newQty <= 0) return handleRemoveItem(cartId);

      const body = { cart_id: cartId, quantity: newQty };
      await POST(URLS.UPDATE_CART_ITEM, body, { headers });

      setCartItems((prev) =>
        prev.map((i) =>
          i.cart_id === cartId || i.id === cartId ? { ...i, quantity: newQty } : i
        )
      );
    } catch (err) {
      console.error("❌ Error decreasing quantity:", err.response?.data || err.message);
    }
  };


  const handleRemoveItem = async (cartId) => {
    try {
      const headers = getAuthHeaders();
      await DELETE(URLS.REMOVE_TO_CART, { data: { cart_id: cartId }, headers });
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));
    } catch (err) {
      console.error("Error removing item:", err.response?.data || err.message);
    }
  };





  const handleEmptyCart = async () => {
    try {
      const headers = getAuthHeaders();
      await DELETE(URLS.EMPTY_CART, { headers });
      setCartItems([]);
    } catch (err) { console.error(err); }
  };

  // ✅ Place Order API
  const handlePlaceOrder = async () => {
    try {
      const headers = getAuthHeaders();
      const loggedInUser = JSON.parse(localStorage.getItem("user")); // ✅ get user

      const restaurantId = cartItems[0]?.product?.restaurant_id;
      if (!restaurantId || !selectedAddress?.id) {
        alert("Missing restaurant or address");
        return;
      }

      const payload = {
        restaurant_id: restaurantId,
        address_id: selectedAddress.id,
        name: loggedInUser?.name || "",          // customer name
        mobile_number: loggedInUser?.phone || "", // customer phone
        address: selectedAddress.address || "",
        gps_address: selectedAddress.gps_address || "",
        location: selectedAddress.location || "",
        payment_method: "cash",
        special_instructions: specialInstructions || "",
      };

      const res = await POST(URLS.ADD_ORDER, payload, { headers });
      if (res.data) {
        setStep(3); // success step
        await handleEmptyCart();
      }
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err.message);
    }
  };

  const TotalsSummary = () => (
    <div className="border-t pt-3 space-y-2">
      <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{CURRENCY} {subtotal}</span></div>
      <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{CURRENCY} {DELIVERY_CHARGE}</span></div>
      {discount > 0 && <div className="flex justify-between text-gray-600"><span>Discount</span><span className="text-green-600">- {CURRENCY} {discount}</span></div>}
      {/*TAX_PERCENTAGE > 0 && <div className="flex justify-between text-gray-600"><span>Tax ({TAX_PERCENTAGE}%)</span><span>{CURRENCY} {taxAmount.toFixed(2)}</span></div>*/}
      <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-600">{CURRENCY} {total.toFixed(2)}</span></div>
    </div>
  );

  // helper: convert variations string (like "1,2,3,4") to human-friendly names
  const getVariationNames = (item) => {
    try {
      if (!item) return "No variations";
      // variations can be a comma-separated string like "1,2,3,4"
      const variationStr = item.variations || "";
      if (!variationStr) return "No variations";

      const selectedIds = variationStr
        .split(",")
        .map((v) => parseInt(v, 10))
        .filter(Boolean);

      const names = [];

      const groups = item?.product?.product_variation_groups || [];
      groups.forEach((group) => {
        (group.product_variations || []).forEach((variation) => {
          if (selectedIds.includes(variation.id)) {
            names.push(variation.name);
          }
        });
      });

      return names.length > 0 ? names.join(", ") : "No variations";
    } catch (err) {
      console.error("getVariationNames error:", err);
      return "No variations";
    }
  };


  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition"
      >
        <ShoppingCart size={24} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Side Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-xl 
  transform transition-transform duration-300 z-[9999] flex flex-col 
  ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex flex-col gap-2 p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              <ShoppingCart size={18} className="text-green-600" /> {step === 1 ? "Cart" : step === 2 ? "Checkout" : "Success"}
            </h2>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-gray-200"><X size={18} /></button>
          </div>

          {/* Restaurant & Max Delivery Box */}
          {cartItems.length > 0 && step === 1 && (
            <div className="flex items-center gap-3 bg-green-100 px-3 py-2 rounded-lg mt-2">
              <img src={deliveryBoyIcon} alt="Delivery Icon" className="w-14 h-14" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {cartItems[0]?.product?.restaurant?.name || "Restaurant Name"}
                </span>
                <span className="text-xs text-gray-700">
                  Max Delivery Time: {ESTIMATED_TIME}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4">
          {/* Step 1: Cart Items */}
          {step === 1 && (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart className="h-16 w-16 text-green-500 mb-3 opacity-80" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => (
                    <div
                      key={item.id || item.cart_id || item.product_id || Math.random()}
                      className="flex items-center justify-between p-3 mb-3 border rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      {/* Left side */}
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item?.product?.product_images?.length > 0
                              ? getProductImageUrl(item.product.product_images[0].image)
                              : "/placeholder.png"
                          }
                          alt={item?.product?.name || "Product"}
                          className="w-16 h-16 rounded-lg object-cover border"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />

                        <div>
                          <h4 className="font-semibold text-gray-800">{item?.product?.name || "Unnamed Product"}
                          </h4>
                          {getVariationNames(item) !== "No variations" && (
                            <p className="text-xs text-gray-500">
                              Variations: {getVariationNames(item)}
                            </p>
                          )}
                          <p className="text-sm text-gray-700">Rs {item?.product?.price}</p>
                        </div>
                      </div>

                      {/* Right side: quantity controls */}
                      <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="text-gray-700 font-medium">{item.quantity}</span>

                        <button
                          onClick={() => handleIncrease(item)}
                          className="p-1 hover:bg-gray-200 rounded-full"
                        >
                          <Plus size={14} />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </div>
                  ))}


                  <button
                    onClick={() => {
                      if (cartItems[0]?.product?.restaurant_id) {
                        navigate(`/restaurant/${cartItems[0].product.restaurant_id}`);
                        setIsOpen(false);
                      }
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2"
                  >
                    Add More Items
                  </button>
                  <TotalsSummary />
                </>
              )}
            </>
          )}

          {/* Step 2: Checkout */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                <div className="border border-green-300 rounded-lg px-3 py-2 bg-green-50 flex items-center justify-between">
                  <span>
                    {selectedAddress?.address
                      ? `${selectedAddress.title} - ${selectedAddress.address}`
                      : "No address selected"}
                  </span>

                  {/* Edit Address Icon */}
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => setModalType("existing")}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      title="Edit Address"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="relative">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Method</h3>
                <div className="border border-green-300 rounded-lg bg-green-50 p-3 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="accent-green-600 w-4 h-4"
                      defaultChecked
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Voucher Code */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter voucher code"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  className="flex-1 border border-green-300 rounded-lg px-3 py-2 text-sm outline-none bg-green-50"
                />
                <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1">
                  <Percent size={16} /> Apply
                </button>
              </div>

              {/* Special Instructions */}
              <div className="mt-2">
                <label className="block font-semibold text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Add any notes (e.g., extra spicy, no onions)..."
                  className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm outline-none bg-green-50"
                  rows={3}
                />
              </div>

              <TotalsSummary />

              {/* ExistingAddresses Modal */}
              <AnimatePresence>
                {modalType === "existing" && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-start justify-center z-50 p-4 md:p-6">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md md:max-w-lg h-auto max-h-[90%] overflow-y-auto">
                      <ExistingAddresses
                        onClose={() => setModalType(null)}
                        savedAddresses={savedAddresses}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                        setActiveAddress={setActiveAddressAPI}
                        onAddNewAddress={() => setModalType("add")}
                      />
                    </div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-start min-h-screen px-4 py-8 overflow-hidden">
              <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-md w-full text-center">

                {/* Success Animation */}
                <div className="flex justify-center mt-2">
                  <Lottie
                    animationData={checkedDone}
                    loop={false}
                    className="w-32 h-32 sm:w-40 sm:h-40"
                  />
                </div>

                {/* Title with Icon */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Order Placed Successfully
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Sit back and relax. Your food is being prepared and will arrive soon.
                </p>

                {/* Delivery Boy Illustration */}
                <div className="flex justify-center mt-6">
                  <img
                    src={deliveryBoyIcon}
                    alt="Delivery Icon"
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                  />
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/orders");
                    }}
                    className="w-full border border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
                  >
                    View My Orders
                  </button>

                </div>
              </div>
            </div>
          )}


        </div>

        {/* Footer Buttons */}
        {step === 1 && cartItems.length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleEmptyCart}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                title="Clear Cart"
              >
                <Trash2 size={20} strokeWidth={2.2} />
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 ml-3 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm"
              >
                Checkout
              </button>
            </div>

            {/* Small info line below */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              You can review your order details on the checkout page.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all duration-200 shadow-sm font-medium"
              >
                <ChevronUp size={18} className="text-gray-600" />
                Back
              </button>

              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Place Order
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Confirm your delivery details before placing the order.
            </p>
          </div>
        )}


        {step === 3 && (
          <div className="p-4 border-t bg-gray-50">
            <button onClick={() => setIsOpen(false)} className="w-full bg-green-600 text-white py-2 rounded-lg">Close</button>
          </div>
        )}
      </div>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-40"></div>}
    </>
  );
}
