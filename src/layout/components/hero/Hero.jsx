import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import './Hero.css'
import heroSection1 from '../../../assets/images/heroSectionImage1.png'
import heroSection2 from '../../../assets/images/heroSectionImage2.png'

const slides = [
  {
    id: 1,
    // image:
    //   'https://images.unsplash.com/photo-1736374143053-cb070a404533?q=80&w=1800&auto=format&fit=crop',
     image:  heroSection1,
    eyebrow: 'THE SABR EDIT',
    title: 'Elegance in Every Drape',
    description:
      'Discover sarees that bring timeless Indian craftsmanship into your everyday style.',
    button: 'SHOP COLLECTION',
  },
  {
    id: 2,
    image: heroSection2,
    eyebrow: 'NEW COLLECTION',
    title: 'Grace Meets Tradition',
    description:
      'Thoughtfully selected sarees for celebrations, moments and everything in between.',
    button: 'EXPLORE COLLECTION',
  },
  {
    id: 3,
    image: heroSection1,
    eyebrow: 'THE SABR COLLECTION',
    title: 'A Story in Every Thread',
    description:
      'Heritage, colour and craftsmanship woven together for the modern woman.',
    button: 'SHOP NOW',
  },
  {
    id: 4,
    image: heroSection2,
    eyebrow: 'SIGNATURE COLLECTION',
    title: 'Timeless. Elegant. Yours.',
    description:
      'A considered collection of beautiful sarees made to stay with you.',
    button: 'VIEW COLLECTION',
  },
]

const Hero = ({ handleNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  const previousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    )
  }

  const goToSlide = (index) => {
    setActiveSlide(index)
  }

  const handleShopClick = () => {
    if (handleNavigate) {
      handleNavigate('/shop')
    }
  }

  return (
    <section className="hero-slider">
      {/* Slides */}
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${
              index === activeSlide ? 'active' : ''
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-slide-image"
            />

            {/* Soft cream overlay */}
            <div className="hero-slide-overlay" />

            <div className="hero-content-container">
              <div className="hero-content">
                <p className="hero-eyebrow">
                  {slide.eyebrow}
                </p>

                <h1>{slide.title}</h1>

                <p className="hero-description">
                  {slide.description}
                </p>

                <button
                  type="button"
                  className="hero-cta"
                  onClick={handleShopClick}
                >
                  <span>{slide.button}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous */}
      <button
        type="button"
        className="hero-arrow hero-arrow-left"
        onClick={previousSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft size={23} />
      </button>

      {/* Next */}
      <button
        type="button"
        className="hero-arrow hero-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight size={23} />
      </button>

      {/* Bottom dots */}
      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`hero-dot ${
              index === activeSlide ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      {/* <div className="hero-slide-counter">
        <span>
          {String(activeSlide + 1).padStart(2, '0')}
        </span>

        <span className="counter-line" />

        <span>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div> */}
    </section>
  )
}

export default Hero