import Navbar from "../components/Navbar";
import Hero from "../components/HomePage/Hero";
import Categories from "../components/HomePage/Categories/Categories";
import Slider from "../components/HomePage/Slider/Slider";
import FeaturedRestaurants from "../components/HomePage/FeaturedRestaurants/FeaturedRestaurants";
import Search from "../components/HomePage/Search"

import { Sliders } from "lucide-react";
import NearbyRestaurants from "../components/HomePage/NearbyRestaurants";
import HowItWorks from "../components/HomePage/HowItWorks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      <Hero />
      <Search />
      <Categories />
      <Slider/>
      <FeaturedRestaurants/>
      <NearbyRestaurants/>
      <HowItWorks/>
      <Footer/>
    </div>
  );
}
