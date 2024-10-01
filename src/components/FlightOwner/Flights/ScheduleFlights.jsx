import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FlightInfo from './FlightInfo';
import StepForm from './StepForm';
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
