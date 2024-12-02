import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import FlightDetailView from './FlightDetailView';

const FlightSchedule = ({flightDetails,userInputData}) => {

  const {Class}=useContext(AppContext)
  const [toggle, setToggle] = useState(false);
  const navigate=useNavigate()


  const handleBooking=()=>
  {
    navigate(`/flights/booking/${flightDetails.flightScheduleId}`, { state: { bookingDetails: flightDetails,userInputData:userInputData } });
  }


  function formatDuration(duration) {

    const [hoursStr, minutesStr, secondsStr] = duration.split(':');
    
    // Convert to integers
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Format the output
    let formatted = '';
    if (hours > 0) {
      formatted += `${hours}h `;
    }
    if (minutes > 0 || hours === 0) { 
      formatted += `${minutes}m`;
    }
    
    return formatted.trim();
  }
  
  function formatDate(inputDate) {
    
    const date = new Date(inputDate);
  
    const options = {
      weekday: 'short',
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
  
    // Format the date
    return date.toLocaleDateString('en-GB', options); 
  }
  
  console.log(flightDetails)

  return (
    <div className="flex flex-col bg-secondary shadow-lg rounded-lg mb-4 p-4">
      {/* Main Flight Info */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center w-1/6">
          <img
            src={flightDetails.airlineImagePath} // Image source for airline logo
            alt="Airline Logo"
            className="w-16 h-12 mr-2"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">{flightDetails.airlineName}</h1>
            <h2 className="text-sm text-gray-500">{flightDetails.flightNumber}</h2>
          </div>
        </div>
          <div className='flex flex-col w-1/6'>
            <h1 className="text-lg text-gray-800">{flightDetails.
departureTime.substring(0,5)
}</h1>
            <h2 className="text-sm text-gray-500">{flightDetails.departureAirportIataCode}</h2>
          </div>
          <div className='w-1/6'>
            <h1 className="text-sm text-gray-500">{formatDuration(flightDetails.duration)}</h1>
          </div>
          <div className='w-1/6'>
            <h1 className="text-lg text-gray-800">{flightDetails.arrivalTime.substring(0,5)}</h1>
            <h2 className="text-sm text-gray-500">{flightDetails.arrivalAirportIataCode}</h2>
          </div>
          <div className='w-1/6'>
            <h1 className="text-lg text-black font-semibold">₹{flightDetails.flightPricings
}</h1>
          </div>
        <div className='w-1/6'>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg" onClick={handleBooking}>Book</button>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="text-left">
        <button
          className="text-blue-500 text-sm underline"
          onClick={() => setToggle(!toggle)}
        >
          {`${toggle ? 'Hide details' : 'Flight details'}`}
        </button>
      </div>
      {/* Flight Details (Conditional Render) */}
      {toggle && (
        <FlightDetailView flightDetails={
          flightDetails} formatDate={formatDate} formatDuration={formatDuration}/>
      )}
    </div>
  );
};

export default FlightSchedule;
