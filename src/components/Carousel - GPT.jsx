import React, { useState, useRef } from 'react';
import './Carousel.css'; 

const CarouselGPT = ({ children }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carouselRef = useRef(null);

  const handleScroll = (direction) => {
    const scrollAmount = direction === 'left' ? -200 : 200;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollUpdate = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const maxScrollPosition = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

      setIsAtStart(scrollPosition <= 0);
      setIsAtEnd(scrollPosition >= maxScrollPosition);
    }
  };

  React.useEffect(() => {
    handleScrollUpdate();
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('scroll', handleScrollUpdate);
    }
    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('scroll', handleScrollUpdate);
      }
    };
  }, []);

  return (
    <div className='carousel-container'>
      {!isAtStart && (
        <button className='carousel-arrow left' onClick={() => handleScroll('left')}>
          &#8592;
        </button>
      )}
      <div className='carousel' ref={carouselRef}>
        {children}
      </div>
      {!isAtEnd && (
        <button className='carousel-arrow right' onClick={() => handleScroll('right')}>
          &#8594;
        </button>
      )}
    </div>
  );
};

export default CarouselGPT;