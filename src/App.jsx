import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // Import the CSS file

const images = [
  "https://auscryptocon.com/wp-content/uploads/2025/05/Frame-325.png",
  "https://auscryptocon.com/wp-content/uploads/2025/05/Frame-334.png",
  "https://auscryptocon.com/wp-content/uploads/2025/05/Frame-336.png",
  "https://auscryptocon.com/wp-content/uploads/2025/05/Frame-337-1.png",
  "https://wpstaq-ap-southeast-2-media.s3.amazonaws.com/auscryptocon/wp-content/uploads/media/2025/05/Frame-338-1.png",
  "https://auscryptocon.com/wp-content/uploads/media/2025/05/Frame-339-1.png",
  "https://wpstaq-ap-southeast-2-media.s3.amazonaws.com/auscryptocon/wp-content/uploads/media/2025/05/Frame-342.png",
  "https://wpstaq-ap-southeast-2-media.s3.amazonaws.com/auscryptocon/wp-content/uploads/media/2025/05/Frame-341.png",
  "https://auscryptocon.com/wp-content/uploads/media/2025/05/Frame-343.png",
  "https://wpstaq-ap-southeast-2-media.s3.amazonaws.com/auscryptocon/wp-content/uploads/media/2025/05/Frame-340.png"
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
        <button onClick={prevCard}>
          Previous
        </button>
        <button onClick={nextCard}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;