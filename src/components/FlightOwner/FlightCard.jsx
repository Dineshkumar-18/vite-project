import React from 'react';

const FlightCard = ({ imageSrc, description }) => {
  return (
    <div className="bg-blue-900 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 -z-40">
      <img src={imageSrc} alt="Flight" className="mx-auto mb-4 w-1/2" />
      <p className="text-white font-bold text-left">{description}</p>
    </div>
  );
};

export default FlightCard;
