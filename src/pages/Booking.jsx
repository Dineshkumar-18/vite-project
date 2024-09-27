import React, { useState } from 'react'
import FlightSchedule from '../components/FlightSchedule'
import FlightDetailView from '../components/FlightDetailView'
import { useLocation } from 'react-router-dom'
import FlightInfo from '../components/FlightInfo'
import ContinueButton from '../components/ContinueButton'
import { DiVim } from 'react-icons/di'
import SliderComponent from '../components/SliderComponent'
import SeatAllocation from '../components/SeatAllocation'

const Booking = () => {
    const location =useLocation()
    const flightDetails=location.state?.bookingDetails

    const [click,setClick]=useState(false)

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

  return (
    <div className='grid grid-cols-5 gap-4'>
       <div className='col-span-4'>
         <div>
          <div className='flex gap-3 text-secondary text-2xl items-center'>
              <div className='w-8 h-8 bg-secondary flex justify-center items-center rounded-full text-customColor font-bold'>1</div>
              <h1 className='font-semibold'>Review your itinerary</h1>
          </div>
          {!click &&
          ( <div>
          <FlightDetailView flightDetails={flightDetails} formatDate={formatDate} formatDuration={formatDuration}/>
          <FlightInfo flightDetails={flightDetails}/>
          <ContinueButton setClick={setClick}/>
          </div>)
           }
          </div>
 <div className='mt-5'>
    <div className='flex gap-3 text-secondary text-2xl items-center mb-3'>
      <div className='w-8 h-8 bg-secondary flex justify-center items-center rounded-full text-customColor font-bold'>2</div>
      <h1 className='font-semibold'>Seat Selection</h1>
  </div>
  <SeatAllocation/>
  <ContinueButton setClick={setClick}/>
  </div>

       </div>
        <div className='bg-secondary rounded-lg p-3 h-[300px]'>
         <h1 className='text-xl font-bold'>Pricings</h1>
         <h1 className='text-lg'>Total Price ₹7000</h1>
         <h1 className='text-lg'>Tax Price ₹2000</h1>
         <h1 className='text-lg'>Base Price ₹5000</h1>
        </div>

    </div>
  )
}

export default Booking
