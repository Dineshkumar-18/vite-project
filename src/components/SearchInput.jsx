import React, { useState, useEffect, useContext } from "react";
import AirportSelect from "./AirportSelect";
import FlightSearchForm from "./FlightSearchForm";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const SearchInput = () => {

  const {tripType,setTripType,fromLocation,setFromLocation,toLocation,setToLocation,departureDate,setDepartureDate,returnDate,setReturnDate,Class,passengers}=useContext(AppContext)

  const navigate=useNavigate()
  const [error,setError]=useState("")
  useEffect(() => {
    console.log(tripType);
    
    if(returnDate) {

      setTripType("Round-trip");
    }
  }, [returnDate]);


  useEffect(()=>{
    if(tripType==="Oneway-trip" && returnDate)
    {
       setReturnDate("")
    }
  },[tripType])

  if (fromLocation === toLocation && fromLocation !== "") {
     setError(true)
  }

  // Handle swap of from and to locations
  const handleSwap = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Handle form submission
  const handleSearch = async() => {
    
    if (!fromLocation || !toLocation || !departureDate || (tripType === "round-trip" && !returnDate)) {
      alert("Please fill in all the required fields.");
      return;
    }
    console.log("Searching flights from", fromLocation, "to", toLocation, "on", departureDate);
    if (tripType === "round-trip") {
      console.log("Returning on", returnDate);
    }

    if (!fromLocation || !toLocation || !departureDate) {
      setError(true);
      return;
    }
    setError(false);
    try {

      const payload = {
        departureAirport: fromLocation,
        arrivalAirport: toLocation,
        departureDate: departureDate,
        returnDate: returnDate || null, // Use null if returnDate is falsy
        class: Class,
        totalPassengers: passengers.adults + passengers.children // Ensure correct property name
      };

      console.log(payload)

      const response = await axiosInstance.post("/FlightSchedule/search-flights",payload)
      console.log(response.data)
      // Navigate to the results page and pass data as state
      navigate('/flights/results', { state: { flightData: response.data} });
    } catch (error) {
      console.error('Error fetching flights:', error);
    }

  };

  console.log(`p-2 rounded-md w-full outline-none ${error ? 'border-2 border-red-500' : 'border-2 border-customColor'}`)


  return (  

    
   <div className="flex flex-wrap md:flex-nowrap items-center justify-between bg-secondary p-4 rounded-t-lg shadow-md gap-3">
      {/* From Location, Swap Button, and To Location */}
      <div className="flex flex-wrap items-center gap-10 w-full md:w-3/5">
        {/* From Location */}
        <div className="w-2/5">
          <AirportSelect
            placeholder="Where From?"
            Location={fromLocation}
            setLocation={setFromLocation}
            error={error}
            inputstyling={`p-2 rounded-md w-full outline-none ${error ? 'border-2 border-red-500' : 'border-2 border-customColor'}`}
            dropdownstyling="bg-secondary"          
          />
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className={`rounded-full w-12 h-12 flex justify-center items-center ${error ? "bg-red-500 text-white border-2 border-white" : "hover:bg-customColor hover:text-secondary text-customColor border border-customColor"}`}
          aria-label="Swap locations"
          disabled={error}
        >
          <i className="fa-solid fa-repeat"></i>
        </button>

        {/* To Location */}
        <div className="w-2/5">
          <AirportSelect
            placeholder="Where To?"
            Location={toLocation}
            setLocation={setToLocation}
            error={error}
            inputstyling={`p-2 rounded-md w-full outline-none ${error ? 'border-2 border-red-500' : 'border-2 border-customColor'}`}
            dropdownstyling="bg-secondary" 
          />
        </div>
      </div>

      {/* Departure Date */}
      <div className="w-full md:w-1/5">
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="w-full border-2 rounded-md p-2 bg-secondary text-customColor border-customColor outline-none appearance-none font-bold"
          required
        />
      </div>

      <div className={`w-full md:w-1/5`}>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full border-2 rounded-md p-2 bg-secondary text-customColor border-customColor outline-none font-bold"
        />
      </div>

      {/* Search Button */}
      <div className="w-full md:w-1/5 flex justify-center">
        <button
          onClick={handleSearch}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-800"
        >
          Search Flights
        </button>
      </div>
    </div>
    )
};

export default SearchInput;
