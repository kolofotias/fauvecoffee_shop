import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: '/placeholder.jpg',
      title: 'Specialty Coffee Roasted in Berlin',
      subtitle: 'Small-batch roasted coffee, carefully sourced and expertly prepared',
      action: { label: 'Shop Now', link: '/shop' }
    },
    {
      image: '/placeholder.jpg',
      title: 'Find Our Coffee Van',
      subtitle: 'Serving fresh coffee across Berlin daily',
      action: { label: 'Locations', link: '/van' }
    },
    {
      image: '/placeholder.jpg',
      title: 'Fresh Roasts Weekly',
      subtitle: 'Subscribe for regular deliveries of freshly roasted coffee',
      action: { label: 'Subscribe', link: '/subscribe' }
    }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen">
      {/* Slides */}
      <div className="relative h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-center">
              <div className="max-w-3xl px-4">
                <h1 className="text-5xl md:text-6xl font-light mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
                  {slide.subtitle}
                </p>
                <a
                  href={slide.action.link}
                  className="inline-block px-8 py-3 border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-wider uppercase animate-fade-in"
                >
                  {slide.action.label}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:opacity-70 transition-opacity"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;