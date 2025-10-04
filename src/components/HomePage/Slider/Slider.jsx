import { useEffect, useState } from "react";
import { GET } from "../../../api/httpMethods";
import URLS  from "../../../api/urls";


export default function ImageSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch slider data from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await GET(URLS.GET_SLIDERS);
        console.log("Slider API response: ", res.data);

       setSlides(Array.isArray(res.data.records) ? res.data.records : []);

      } catch (err) {
        console.error("Error fetching slider data:", err);
      }
    };

    fetchSlides();
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null; // or loading state

  return (
    <section className="py-4 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 rounded-xl overflow-hidden h-40 sm:h-52 md:h-64 relative">
          <img
            src={`https://bannugul.enscyd.com/bannugul-v2/public/images/sliders/${slides[currentSlide].image}`}
            alt={slides[currentSlide].text || "slider"}
            className="w-full h-full object-cover transition-all duration-700"
          />
          {/* Overlay text */}
          {slides[currentSlide].text && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4 bg-black/20">
              <h2 className="text-lg sm:text-2xl font-bold drop-shadow-lg">
                {slides[currentSlide].text}
              </h2>
              {slides[currentSlide].value && (
                <p className="mt-2 text-sm sm:text-lg drop-shadow-md">
                  {slides[currentSlide].value}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
