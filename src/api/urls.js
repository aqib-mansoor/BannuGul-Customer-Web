// src/api/urls.js


export const BASE_URL = "https://bannugul.enscyd.com/bannugul-v2/app";
export const IMAGE_BASE_URL = `${BASE_URL}/media/images/`;


const URLS = {

    LOGIN_EMAIL: "api/login",
    LOGIN_PHONE: "api/loginPhone",
    REGISTER: "api/register",
    UPDATE_PROFILE: "/api/updateProfile",
    SHOW_PRODUCT_BY_ID: "/api/showProductById",
    SHOW_RESTAURANTS: "/api/showRestaurants",
    SHOW_ORDERS: "/api/showOrders",
    SHOW_ORDER_DETAILS: "/api/showOrderDetails",
    SHOW_SETTINGS: "/api/showSettings",
    SHOW_CART_PRODUCTS: "/api/showCartProducts",
    SHOW_ADDRESSES: "/api/showAddresses",
    SET_ACTIVE_ADDRESS: "/api/setActiveAddress",
    UPDATE_CART_ITEM: "/api/updateCartItemQuantity",
    REMOVE_TO_CART: "/api/removeToCart",
    EMPTY_CART: "/api/emptyCart",
    ADD_ORDER: "/api/addOrder",
    SHOW_RESTAURANT_REVIEWS: "/api/showRestaurantReviews",
    SHOW_RESTAURANT_CATEGORIES: "/api/showRestaurantCategories",
    ADD_TO_CART: "/api/addToCart",
    ORDER_CANCEL_USER: "/api/orderCancelUser",
    SEARCH_RESTAURANTS: "/api/searchRestaurantsWithProducts",
    GET_SLIDERS: "/api/getSliders",
    GET_CATEGORIES: "/api/getCategories",
    ADD_ADDRESS: "/api/addAddress",


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
