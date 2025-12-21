import { useState, useRef } from 'react';
import './Carousel.css'

function Carousel({ children }) {
  const carouselRef = useRef(null);

  function handleScroll(direction) {
    const scrollAmount = direction === 'left' ? -200 : 200;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: scrollAmount });
    }
  }

  return (
    <>
      <div className='carouselContainer'>
        <button className='carouselLeftButton' onClick={() => handleScroll('left')}>
          &#8592;
        </button>
        <div className='carouselBody' ref={ carouselRef }>
          {children}
        </div>
        <button className='carouselRightButton' onClick={() => handleScroll('right')}>
          &#8594;
        </button>
      </div>
    </>
  )
}

export default Carousel