import React, { useState } from 'react';
import FlightSchedule from './FlightSchedule';

const FlightTable = ({ flightData}) => {
  const [sortConfig, setSortConfig] = useState({ column: null, direction: null });

  const handleSort = (column) => {
    setSortConfig(prev => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
        };
      } else {
        return {
          column,
          direction: 'ascending'
        };
      }
    });
    // Add your sorting logic here
    console.log(column + " filtered");
  };

  return (
    <div className="bg-secondary p-4 shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Flight Schedules</h1>
      
      {/* Header */}
      <div className="flex bg-blue-100 text-blue-900 font-semibold p-4">
        <div className="w-1/6 flex items-center">
          <span>Airlines</span>
        </div>
        <div className="w-1/6 flex items-center cursor-pointer" onClick={() => handleSort('departure')}>
          <span>Departure</span>
          {sortConfig.column === 'departure' && (
            <button className="ml-2">
              <i className={`fa-solid fa-arrow-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>
        <div className="w-1/6 flex items-center cursor-pointer" onClick={() => handleSort('duration')}>
          <span>Duration</span>
          {sortConfig.column === 'duration' && (
            <button className="ml-2">
              <i className={`fa-solid fa-arrow-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>
        <div className="w-1/6 flex items-center cursor-pointer" onClick={() => handleSort('arrival')}>
          <span>Arrival</span>
          {sortConfig.column === 'arrival' && (
            <button className="ml-2">
              <i className={`fa-solid fa-arrow-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>
        <div className="w-1/6 flex items-center cursor-pointer" onClick={() => handleSort('price')}>
          <span>Price</span>
          {sortConfig.column === 'price' && (
            <button className="ml-2">
              <i className={`fa-solid fa-arrow-${sortConfig.direction === 'ascending' ? 'up' : 'down'}`}></i>
            </button>
          )}
        </div>
      </div>

      {/* Flight Rows */}
      {flightData.outboundFlights.map((flight, index) => (
        <FlightSchedule key={flight.flightScheduleId} flightDetails={flight}/>
      ))}
    </div>
  );
};

export default FlightTable;
