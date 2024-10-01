import axios from 'axios';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';



const AirportSelect = ({placeholder,setLocation,error,inputstyling,dropdownstyling,initialLocationId}) => {


  console.log(inputstyling,dropdownstyling)
  const [options, setOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  console.log(query)


  // Sample fetch function for demonstration
const fetchAirportOptions = async (query) => {
  let response;
  if (query) {
    const encodedQuery = encodeURIComponent(query);
    response = await axiosInstance.get(`/Airports/search?query=${encodedQuery}`);
  } else {
    response = await axiosInstance.get('/Airports');
  }
  return response.data;
};




  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await fetchAirportOptions(query);
        setOptions(data);
        setDisplayedOptions(data.slice(0, 8)); // Display only the first 8 options initially
      } catch (error) {
        console.error('Error fetching airport options:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query.length > 2 || query.length === 0) {
      fetchOptions();
      // setShowResults(true);
    }
  }, [query]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Optionally, update displayedOptions based on current options if query length is short
    if (newQuery.length <= 2) {
      setDisplayedOptions(options.slice(0, 8));
    }
  };

  const handleClick = (value,airportId) => {
    setLocation(airportId)
    setQuery(value); // Then update the input field with selected value
    setTimeout(() => setShowResults(false), 0);
  };


  useEffect(() => {
    if (initialLocationId) {
      const fetchInitialAirport = async () => {
        const response = await axiosInstance.get(`/Airports/${initialLocationId}`);
        const airportData = response.data;
        setQuery(`${airportData.airportName} - ${airportData.city}`);
        setLocation(initialLocationId);
        setDisplayedOptions([airportData]); // Update the displayed options
      };
      fetchInitialAirport();
    }
  }, [initialLocationId, setLocation]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        className={inputstyling}
        placeholder={placeholder}
        onFocus={() => setShowResults(true)} // Show results when input is focused
      />
      {showResults && (
        <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto z-50">
          {loading ? (
            <div className="p-2 text-gray-600">Loading...</div>
          ) : (
            displayedOptions.map((option, index) => (
              <div
  key={option.airportId}
  className={`p-2 cursor-pointer hover:bg-blue-500 group ${dropdownstyling}`} // Add group class to parent div
  onClick={() => handleClick(`${option.airportName} - ${option.city}`,option.airportId)}
>
  <span className="text-blue-600 font-semibold group-hover:bg-yellow-500 group-hover:text-white p-1 rounded">
    {option.iataCode}
  </span> {/* IATA code will change background and text color on hover */}
  &nbsp;
  {option.airportName} - {option.city}
</div>
            ))
          )} 
          {displayedOptions.length === 0 && !loading && (<div className="p-2 text-gray-600">No results found</div>
        )}
        </div>
      )}
    </div>
  );
};

export default AirportSelect;
