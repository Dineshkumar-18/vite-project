import React, { useContext, useState } from 'react'
import PassengerSelector from './PassengerSelector'
import SearchInput from './SearchInput'
import FlightSearchForm from './FlightSearchForm'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const SearchFlights = () => {

  const location=useLocation()
  const {tripType,setTripType,passengers,setPassengers,Class,setClass}=useContext(AppContext)
  const [isSearched,setIsSearched]=useState(false)
  
  console.log(passengers)


  return (
    <div>
        <div className='flex gap-4 pb-3'>
            <div>
                <select name="triptype" id="triptype" className='text-white p-2 bg-customColor border rounded-md border-white' value={tripType} onChange={(e)=>setTripType(e.target.value)}>
                    <option value="Oneway-trip">Oneway-trip</option>
                    <option value="Round-trip">Round-trip</option>
                </select>
            </div>
            <div>
                <select name="classtype" id="classtype" className='text-white p-2 bg-customColor border rounded-md border-white' value={Class} onChange={(e)=>setClass(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                </select>
            </div>
            <PassengerSelector/>
        </div>
        {location.pathname !== '/flights/results' && (<div >
          <FlightSearchForm setIsSearched={setIsSearched}/>
         </div>)}
    </div>
  )
}

export default SearchFlights
