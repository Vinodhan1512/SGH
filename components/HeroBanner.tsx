'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'Exquisite 22ct Gold Collection',
      subtitle: 'Timeless Elegance & Traditional Craftsmanship',
      offerBadge: 'Up to 30% OFF on Making Charges',
      cta: 'Explore Collection',
      ctaLink: '/gold',
      background: 'linear-gradient(135deg, #854d0e 0%, #a16207 50%, #854d0e 100%)',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400&q=80',
    },
    {
      id: 2,
      title: 'Brilliant Diamond Jewellery',
      subtitle: 'Sparkle with Confidence & Grace',
      offerBadge: '0% Making Charges on Diamond Sets',
      cta: 'Shop Diamonds',
      ctaLink: '/diamond',
      background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0c4a6e 100%)',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80',
    },
    {
      id: 3,
      title: 'Bridal Jewellery Collection',
      subtitle: 'Make Your Special Day Unforgettable',
      offerBadge: 'Exclusive Bridal Sets Available',
      cta: 'View Bridal Collection',
      ctaLink: '/wedding',
      background: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 50%, #7e22ce 100%)',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[550px] md:h-[650px] lg:h-[750px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{ background: slide.background }}
        >
          {/* Background Image with Enhanced Overlay */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: 'brightness(0.85) contrast(1.1)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full section-container flex items-center">
            <div className="max-w-3xl text-white animate-fade-in">
              {/* Offer Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 backdrop-blur-sm rounded-full shadow-2xl border-2 border-yellow-300 animate-pulse">
                <HiSparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-base md:text-lg font-extrabold tracking-wide text-white drop-shadow-lg">
                  {slide.offerBadge}
                </span>
                <HiSparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-3xl text-yellow-100 mb-10 font-semibold drop-shadow-lg">
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <a
                href={slide.ctaLink}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-gray-900 text-lg md:text-xl font-extrabold rounded-full hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-500 transition-all shadow-2xl hover:shadow-yellow-500/50 hover:scale-110 border-4 border-yellow-300 group"
              >
                <span>{slide.cta}</span>
                <span className="inline-block group-hover:translate-x-2 transition-transform text-2xl">
                  →
                </span>
              </a>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <span className="text-yellow-300 text-xl">✓</span>
                  <span className="text-sm font-bold">BIS Hallmarked</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <span className="text-yellow-300 text-xl">✓</span>
                  <span className="text-sm font-bold">22ct Certified Gold</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <span className="text-yellow-300 text-xl">✓</span>
                  <span className="text-sm font-bold">Lifetime Exchange</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-yellow-500/30 backdrop-blur-md rounded-full hover:bg-yellow-500/50 transition-all shadow-2xl border-2 border-white/30 hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-7 h-7 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-yellow-500/30 backdrop-blur-md rounded-full hover:bg-yellow-500/50 transition-all shadow-2xl border-2 border-white/30 hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-7 h-7 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all shadow-lg ${
              index === currentSlide
                ? 'w-16 bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white'
                : 'w-3 bg-white/60 hover:bg-white/80 border border-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner
