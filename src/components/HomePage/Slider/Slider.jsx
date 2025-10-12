import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GET } from "../../../api/httpMethods";
import URLS, { getSliderImageUrl } from "../../../api/urls";

export default function ImageSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Fetch slider data
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await GET(URLS.GET_SLIDERS);
        setSlides(Array.isArray(res.data.records) ? res.data.records : []);
      } catch (err) {
        console.error("Error fetching slider data:", err);
      }
    };
    fetchSlides();
  }, []);

  // ✅ Auto slide every 4 seconds
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <section className="relative bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
          {/* ✅ Slider Images */}
          {slides.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={slides[currentSlide].id || currentSlide}
                src={getSliderImageUrl(slides[currentSlide].image)}
                alt="Slider"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => (e.target.src = "/default-slider.jpg")}
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" />
          )}

          {/* ✅ Dots Navigation */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "bg-green-500 w-4"
                      : "bg-white/70 hover:bg-green-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
