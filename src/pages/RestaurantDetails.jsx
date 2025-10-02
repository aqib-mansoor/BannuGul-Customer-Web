import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from "../components/RestaurantDetails/Hero";
import MenuCategories from "../components/RestaurantDetails/MenuCategories";
import Footer from "../components/Footer"
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

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!restaurant) return <p className="p-6 text-center">No restaurant found</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero restaurant={restaurant} />
      <MenuCategories restaurantId={restaurant.id} />
      <Footer />
    </div>
  );
}
