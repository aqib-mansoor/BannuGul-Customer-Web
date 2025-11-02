// src/api/urls.js

export const BASE_URL = "https://bannugul.me/admin";
export const IMAGE_BASE_URL = `${BASE_URL}/media/images/`;

const URLS = {
  // 🔐 Authentication
  LOGIN_EMAIL: "api/login",
  LOGIN_PHONE: "api/loginPhone",
  REGISTER: "api/register",
  FORGOT_PASSWORD: "api/forgotPassword",
  RESET_PASSWORD: "api/resetPassword",
  UPDATE_PROFILE: "api/updateProfile",

  // 🍔 Restaurants & Products
  SHOW_PRODUCT_BY_ID: "api/showProductById",
  SHOW_RESTAURANTS: "api/showRestaurants",
  SHOW_RESTAURANT_REVIEWS: "api/showRestaurantReviews",
  SHOW_RESTAURANT_CATEGORIES: "api/showRestaurantCategories",
  SEARCH_RESTAURANTS: "api/searchRestaurantsWithProducts",
  ADD_REVIEW: "api/addRestaurantReview", // ✅ fixed (removed /)

  // 🛒 Cart & Orders
  SHOW_CART_PRODUCTS: "api/showCartProducts",
  ADD_TO_CART: "api/addToCart",
  UPDATE_CART_ITEM: "api/updateCartItemQuantity",
  REMOVE_TO_CART: "api/removeToCart",
  EMPTY_CART: "api/emptyCart",
  ADD_ORDER: "api/addOrder",
  SHOW_ORDERS: "api/showOrders",
  SHOW_ORDER_DETAILS: "api/showOrderDetails",
  ORDER_CANCEL_USER: "api/orderCancelUser",

  // 📍 Addresses
  SHOW_ADDRESSES: "api/showAddresses",
  ADD_ADDRESS: "api/addAddress",
  SET_ACTIVE_ADDRESS: "api/setActiveAddress",

  // 💚 Favorites
  ADD_FAVORITE: "api/addFavorites",
  SHOW_FAVORITES: "api/showFavorites",

  // ⚙️ Settings & UI
  SHOW_SETTINGS: "api/showSettings",
  GET_SLIDERS: "api/getSliders",
  GET_CATEGORIES: "api/getCategories",

  // 📞 Contact
  CONTACT: "api/contactForm",
};

export function getSliderImageUrl(imageName) {
  return `${IMAGE_BASE_URL}sliders/${imageName}`;
}

export function getRestaurantImageUrl(imageName) {
  return `${IMAGE_BASE_URL}restaurants/${imageName}`;
}

export function getProductImageUrl(imageName) {
  return `${IMAGE_BASE_URL}products/${imageName}`;
}

export function getCategoryImageUrl(imageName) {
  return `${IMAGE_BASE_URL}categories/${imageName}`;
}

export function getUserImageUrl(imageName) {
  return `${IMAGE_BASE_URL}users/${imageName}`;
}

export default URLS;
