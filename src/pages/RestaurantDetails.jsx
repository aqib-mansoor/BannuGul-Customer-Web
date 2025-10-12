import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from "../components/RestaurantDetails/Hero";
import MenuCategories from "../components/RestaurantDetails/MenuCategories";
import Footer from "../components/Footer";
import { GET } from "../api/httpMethods";
import URLS from "../api/urls";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await GET(URLS.SHOW_RESTAURANTS);
        const found = res.data.records?.find(
          (rest) => String(rest.id) === String(id)
        );
        setRestaurant(found || null);
      } catch (err) {
        console.error(err);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  // Placeholder while loading or if restaurant not found yet
  if (loading || !restaurant) {
    return (
      <div className="bg-gray-50 min-h-screen px-6 md:px-16 lg:px-24 py-6 space-y-6">
        <RestaurantPlaceholder />
        <div className="space-y-4">
          <MenuCategoryPlaceholder />
          <MenuCategoryPlaceholder />
          <MenuCategoryPlaceholder />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 md:px-16 lg:px-24">
        <Hero restaurant={restaurant} />
        <MenuCategories restaurantId={restaurant.id} />
      </div>
      <Footer />
    </div>
  );
}

// Placeholder for Hero
function RestaurantPlaceholder() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-48 w-full mb-6"></div>
  );
}

// Placeholder for Menu Categories
function MenuCategoryPlaceholder() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
  );
}
