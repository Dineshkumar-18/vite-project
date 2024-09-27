import axios from 'axios';
import React, { useState, useEffect } from 'react';



const AirportSelect = ({placeholder,Location,setLocation,error}) => {
  const [options, setOptions] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [query, setQuery] = useState(Location || '');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  console.log(query)


  // Sample fetch function for demonstration
const fetchAirportOptions = async (query) => {
  let response;
  if (query) {
    const encodedQuery = encodeURIComponent(query);
    response = await axios.get(`https://localhost:7055/api/Airports/search?query=${encodedQuery}`);
  } else {
    response = await axios.get('https://localhost:7055/api/Airports');
  }
  return response.data;
};

useEffect(() => {
  setQuery(Location); // Update query state to reflect the new Location value
}, [Location]);


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

  const handleClick = (value) => {
    setLocation(value)
    setQuery(value); // Then update the input field with selected value
    setTimeout(() => setShowResults(false), 0);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        bg-secondary text-customColor border-customColor
        onChange={handleSearchChange}
        className={`text-customColor p-2 border-2 bg-secondary font-semibold rounded-md ${error?'border-2 border-red-500': 'border-customColor' } w-full outline-none`}
        placeholder={placeholder}
        onFocus={() => setShowResults(true)} // Show results when input is focused
      />
      {showResults && (
        <div className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto z-50">
          {loading ? (
            <div className="p-2 text-gray-600">Loading...</div>
          ) : (
            displayedOptions.map((option, index) => (
              <div key={index} className="p-2 bg-customColor text-white cursor-pointer hover:bg-blue-500" onClick={() => handleClick(option.airportName)}>
                {option.airportName}
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
