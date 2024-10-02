import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FlightInfo from './FlightInfo';
import FlightForm from './FlightForm';
import AddFlightForm from '../AddFlightForm';

const ScheduleFlights = () => {
    
  
    
  return (
    
    <div>
       <FlightInfo/>
       <FlightForm/>
    </div>
  )
}

export default ScheduleFlights
