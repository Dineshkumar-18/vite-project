import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ScrollableDateRange = () => {
  const scrollContainerRef = useRef(null);

  const [dates, setDates] = useState([]);

  useEffect(() => {
    const generateDates = () => {
      const tempDates = [];
      for (let i = 0; i <= 30; i++) {
        const date = dayjs().add(i, 'day').format('YYYY-MM-DD');
        const price = (Math.random() * 100 + 50).toFixed(2); // Generate a random price between $50 and $150
        tempDates.push({ date, price });
      }
      setDates(tempDates); // Update state with the generated dates
    };
  
    generateDates();
  }, []);

console.log(dates)

 


  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <button
        onClick={() => scroll('left')}
        className="absolute top-1/2 -left-1 transform -translate-y-1/2 bg-blue-800 text-secondary rounded-full p-2 hover:bg-blue-700 z-10"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute top-1/2 -right-1 transform -translate-y-1/2 bg-blue-800 text-white rounded-full p-2 hover:bg-blue-700 z-10"
      >
        <FaChevronRight />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto whitespace-nowrap scrollbar-hidden bg-secondary p-2  border border-gray-300"
      >
        {dates.map((date, index) => (
          <div
            key={index}
            className="flex-none w-48 p-4 mx-2 border rounded-md bg-gray-300 text-blue-900 flex-shrink-0 text-center"
          >
            <div className="text-lg font-bold">{date.date}</div>
            <div className="text-md text-green-800">{date.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableDateRange;
