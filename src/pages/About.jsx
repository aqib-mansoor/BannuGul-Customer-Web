// src/pages/About.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Truck, Coffee, Heart, Star } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-green-600 text-white py-20 px-6 md:px-10 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Bannu Gul Logo"
            className="w-32 h-32 mb-4 object-contain animate-bounce-slow"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BANNU GUL BP RESTAURANT
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Fresh, delicious meals delivered with love. Experience the perfect
            blend of tradition and modern flavors in every bite.
          </p>
        </div>
        {/* Animated Circles */}
        <span className="absolute top-0 left-10 w-24 h-24 bg-white opacity-10 rounded-full animate-ping-slow"></span>
        <span className="absolute bottom-10 right-10 w-36 h-36 bg-white opacity-10 rounded-full animate-ping-slow"></span>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-12 py-16 space-y-16 max-w-6xl mx-auto">
        {/* Our Story */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-500">
            <Heart size={48} className="text-green-600 mb-4 animate-pulse-slow" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-2">
              Bannu Gul BP (Beef Pulao) Restaurant is a Pakistani culinary brand
              renowned for bringing the traditional flavors of Bannu to the UAE,
              specializing in authentic beef pulao, BBQ, and classic Pakistani dishes.
            </p>
            <p className="text-gray-700">
              The restaurant emphasizes authenticity, using high-quality ingredients,
              traditional spices, and time-honored cooking techniques. Chefs blend flavors
              to evoke traditional Pakistani hospitality and memorable dining experiences.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-500">
            <Star size={48} className="text-green-600 mb-4 animate-pulse-slow" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">Origin & Concept</h2>
            <p className="text-gray-700 mb-2">
              Bannu Gul BP Restaurant began with a simple idea: to serve home-style Bannu Pulao,
              sizzling BBQ, aromatic Afghani Pulao, and traditional Karahi, reflecting the rich
              culinary heritage of Pakistan and the Bannu region specifically.
            </p>
            <p className="text-gray-700">
              Guests experience traditional flavors prepared with care and passion, preserving
              the authentic taste of Bannu dishes while blending modern presentation for a
              contemporary dining experience.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-500">
            <Truck size={48} className="text-green-600 mb-4 animate-bounce-slow" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">Signature Dishes</h2>
            <p className="text-gray-700 mb-2">
              Guests often highlight dishes such as grilled beef, beef pulao, and Nalli Kabab, praised for taste and authenticity.
            </p>
            <p className="text-gray-700">
              Every dish is crafted with fresh ingredients, aromatic spices, and a dedication to
              authentic Pakistani cooking traditions, providing a full sensory experience.
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-500">
            <Coffee size={48} className="text-green-600 mb-4 animate-bounce-slow" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">Culinary Highlights</h2>
            <p className="text-gray-700 mb-2">
              The restaurant is celebrated for its signature beef pulao, known for its flavor, texture, and rich spices.
            </p>
            <ul className="list-disc list-inside text-gray-700 text-left">
              <li>Juicy BBQ platters and mixed grills</li>
              <li>Afghani Pulao and Karahi dishes</li>
              <li>Chapli Kabab, a traditional delicacy from Bannu</li>
              <li>Sweet dishes and traditional beverages like Peshawari Qahwa</li>
            </ul>
          </div>
        </section>

        {/* Our Meals */}
        <section className="bg-white shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Our Meals</h2>
            <p className="text-gray-700 mb-4">
              From local favorites to international dishes, every meal is crafted
              with love and care. We source fresh ingredients daily, ensuring
              the perfect balance of flavors and nutrition in every plate.
            </p>
            <p className="text-gray-700 mb-4">
              Our chefs pay attention to detail, seasoning every dish precisely
              and cooking it to perfection. Meals are designed to satisfy both
              the eyes and the palate, offering a complete dining experience at home.
            </p>
            <ul className="flex flex-wrap gap-2">
              <li className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm animate-pulse-slow">
                Fresh Ingredients
              </li>
              <li className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm animate-pulse-slow">
                Authentic Flavors
              </li>
              <li className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm animate-pulse-slow">
                Healthy Choices
              </li>
              <li className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm animate-pulse-slow">
                Timely Delivery
              </li>
              <li className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm animate-pulse-slow">
                Perfect Presentation
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <img
              src="/BGP.jpg"
              alt="Our Meals"
              className="rounded-3xl object-cover w-full h-64 sm:h-80 md:h-96 shadow-lg"
            />
          </div>
        </section>

        {/* Mission & Values */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-2 duration-500">
            <Heart size={36} className="text-green-600 mb-4 animate-pulse-slow" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Our Mission</h3>
            <p className="text-gray-700">
              To serve high-quality meals that bring joy to our customers while
              maintaining sustainable and ethical practices in every step of our kitchen and delivery operations.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition transform hover:-translate-y-2 duration-500">
            <Star size={36} className="text-green-600 mb-4 animate-pulse-slow" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Our Values</h3>
            <p className="text-gray-700">
              Freshness, quality, and customer happiness are at the heart of
              everything we do. We value your trust and strive to exceed
              expectations every time, ensuring each meal is a memorable experience.
            </p>
          </div>
        </section>

        

        {/* Order & Tracking */}
        <section className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2 duration-500">
            <Truck size={36} className="text-green-600 mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-bold text-green-600 mb-2">Fast Delivery</h3>
            <p className="text-gray-700 text-sm">
              Track your order in real-time from the kitchen to your doorstep, ensuring
              freshness and timely delivery every time.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2 duration-500">
            <Coffee size={36} className="text-green-600 mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-bold text-green-600 mb-2">Fresh Meals</h3>
            <p className="text-gray-700 text-sm">
              Every dish is prepared fresh with quality ingredients, cooked to perfection,
              and served with care for an exceptional dining experience.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col items-center hover:shadow-2xl transition transform hover:-translate-y-2 duration-500">
            <Star size={36} className="text-green-600 mb-4 animate-bounce-slow" />
            <h3 className="text-xl font-bold text-green-600 mb-2">Customer Satisfaction</h3>
            <p className="text-gray-700 text-sm">
              Your happiness is our priority. We go the extra mile to ensure every
              order delights you with quality, taste, and presentation.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
