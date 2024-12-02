import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import FlightInfo from './FlightInfo';
import FlightForm from './FlightForm';
import AddFlightForm from '../AddFlightForm';

const ScheduleFlights = () => {
  
  const location = useLocation();
  const { isNewSchedule = true, flightScheduleId = 0 } = location.state || {};

  return (
    
    <div>
       <FlightInfo/>
       <FlightForm isNewSchedule={isNewSchedule} fsId={flightScheduleId}/>
    </div>
  )
}

export default ScheduleFlights
