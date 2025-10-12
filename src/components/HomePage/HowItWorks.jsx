import { FaSearch, FaUtensils, FaMotorcycle, FaSmile } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: <FaSearch className="text-green-600 w-10 h-10" />,
      title: "Search for Food",
      description: "Enter your area or zip code to find restaurants near you.",
    },
    {
      id: 2,
      icon: <FaUtensils className="text-green-600 w-10 h-10" />,
      title: "Choose a Restaurant",
      description: "Browse featured restaurants and select your favorite dishes.",
    },
    {
      id: 3,
      icon: <FaMotorcycle className="text-green-600 w-10 h-10" />,
      title: "Fast Delivery",
      description: "Place your order and our delivery partner brings it to your door.",
    },
    {
      id: 4,
      icon: <FaSmile className="text-green-600 w-10 h-10" />,
      title: "Enjoy Your Meal",
      description: "Sit back and enjoy fresh, delicious food from your favorite restaurant.",
    },
  ];

  const [visibleSteps, setVisibleSteps] = useState([]);

  // Fade-in effect on mount
  useEffect(() => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step.id]);
      }, index * 300); // staggered delay
    });
  }, []);

  return (
    <section className="py-12 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center text-center p-6 rounded-lg shadow-lg transition-transform duration-500 transform 
              ${visibleSteps.includes(step.id) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"} 
              hover:scale-105 hover:shadow-2xl bg-white`}
            >
              <div className="mb-4 animate-bounce">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
