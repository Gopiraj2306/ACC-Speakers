import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // Import the CSS file
import LeftArrow from './assets/left-arrow.svg';
import RightArrow from './assets/right-arrow.svg';
import Img1 from './assets/img1.png';
import Img2 from './assets/img2.png';
import Img3 from './assets/img3.png';
import Img4 from './assets/img4.png';
import Img5 from './assets/img5.png';
import Img6 from './assets/img6.png';
import Img7 from './assets/img7.png';
import Img8 from './assets/img8.png';
import Img9 from './assets/img9.png';
import Img10 from './assets/img10.png';

const images = [
  Img1,
  Img2,
  Img3,
  Img4,
  Img5,
  Img6,
  Img7,
  Img8,
  Img9,
  Img10
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const cardsRef = useRef([]);
  const autoScrollIntervalRef = useRef(null);

  // Helper function to get computed style property as a number
  const getStyleNumericValue = (element, prop) => {
    return parseFloat(getComputedStyle(element).getPropertyValue(prop));
  };

  const showCard = useCallback((index) => {
    setCurrentIndex(index);

    if (carouselRef.current && cardsRef.current[index]) {
      const activeCardElement = cardsRef.current[index];
      const cardWidthActive = getStyleNumericValue(activeCardElement, 'width');
      const cardWidthShrink = getStyleNumericValue(cardsRef.current[0], 'width'); // Assuming first card is representative of shrunk width
      const gap = getStyleNumericValue(carouselRef.current, 'gap');
      const carouselPaddingLeft = getStyleNumericValue(carouselRef.current, 'padding-left');

      // Calculate the total width of all cards before the active one, plus their gaps
      let leadingCardsWidth = 0;
      for (let i = 0; i < index; i++) {
        leadingCardsWidth += cardWidthShrink + gap;
      }

      // Desired position of the active card's LEFT edge relative to carousel's visible area
      // Adjust this offset (e.g., 50px) to control how much space is to the left of the active card
    const desiredLeftOffset = 10; // You can adjust this value (e.g., 20px, 50px)

      // Calculate the scroll position needed to place the active card's left edge
      // at `desiredLeftOffset` from the carousel's visible left edge.
      const scrollPosition = leadingCardsWidth - desiredLeftOffset - carouselPaddingLeft;

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextCard = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollIntervalRef.current = setInterval(nextCard, 3000);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollIntervalRef.current);
  };

  // Initial setup and auto-scroll on component mount
  useEffect(() => {
    startAutoScroll();
    const handleResize = () => {
      setTimeout(() => {
        showCard(currentIndex);
      }, 100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      stopAutoScroll();
      window.removeEventListener('resize', handleResize);
    };
  }, [showCard, currentIndex]);

  // Effect to handle scrolling when currentIndex changes
  useEffect(() => {
    showCard(currentIndex);
  }, [currentIndex, showCard]);

  return (
    <div className="container">
      <div className="card-carousel" ref={carouselRef}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`card ${currentIndex === index ? 'active' : ''}`}
            ref={(el) => (cardsRef.current[index] = el)}
            onMouseEnter={() => {
              if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
                stopAutoScroll();
                showCard(index);
              }
            }}
            onMouseLeave={() => {
              if (!('ontouchstart' in window || navigator.maxTouchPoints)) {
                startAutoScroll();
              }
            }}
            onClick={() => showCard(index)}
          >
            <div className="card-content">
              <img src={src} alt={`Speaker ${index + 1}`} />
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Buttons */}
            <div className="carousel-navigation">
            <button className="nav-button" onClick={prevCard}>
              <img src={LeftArrow} alt="Previous" />
            </button>


            <button className="nav-button" onClick={nextCard}>
              <img src={RightArrow} alt="Next" />
            </button>
          </div>

                      </div>
  );
}

export default App;