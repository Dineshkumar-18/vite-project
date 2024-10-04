import { useNavigate } from "react-router-dom";
import AirportSelect from "./AirportSelect";
import DateInput from "./DateInput";
import SearchButton from "./SearchButton";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import FlightSeatLayout from "./FlightSeatLayout";

const FlightSearchForm = ({setIsSearched}) => {


  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {tripType,setTripType,fromLocation,setFromLocation,toLocation,setToLocation,departureDate,setDepartureDate,returnDate,setReturnDate,Class,to,passengers}=useContext(AppContext)
  const [error, setError] = useState(false);


  const businessClassLayout = ['A', 'C', 'D', 'F']; // Business class row layout (4 seats in 6 columns)
  const economyClassLayout = ['A', 'B', 'C', 'D', 'E', 'F']; // Economy class row layout (all 6 seats)
  const premium=['A', 'B', 'C', 'D', 'E', 'F']
  

  const generateColumns = (totalColumns) => {
    const columns = [];
    for (let i = 0; i < totalColumns; i++) {
      columns.push(String.fromCharCode(65 + i));
    }
    return columns;
  };
  
  // Function to generate seats based on a class-specific layout
  const generateSeatRows = (rowLayout, totalRows, startingRow) => {
    const seatRows = [];
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      seatRows.push({
        row: startingRow + rowIndex, // Adjust the row number
        seats: rowLayout.map((seatColumn) => ({
          column: seatColumn,
          isReserved: false // You can add dynamic reserved logic later
        })),
      });
    }
    return seatRows;
  };


  // Full seat configuration based on business and economy class layouts
  const classConfigs = [
    {
      className: 'Business Class',
      startingRow: 1, // Start from row 1
      totalRows: 3, // Business class has 3 rows
      columns: generateColumns(6), // Total columns in layout
      seatRows: generateSeatRows(businessClassLayout, 3, 1), // 3 rows of business class starting from row 1
    },
    {
      className: 'Economy Class',
      startingRow: 4, // Economy starts from row 4
      totalRows: 10, // Economy class has 10 rows
      columns: generateColumns(6),
      seatRows: generateSeatRows(economyClassLayout, 10, 4), // 10 rows of economy class starting from row 4
    },
    {
      className: 'Premium Economy Class',
      startingRow: 14, // Economy starts from row 4
      totalRows: 2, // Economy class has 10 rows
      columns: generateColumns(6),
      seatRows: generateSeatRows(economyClassLayout, 10, 4),
    }
  ];

// Function to generate columns (A, B, C, ...)



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


  const handleSearch = async () => {
    if (!fromLocation || !toLocation || !departureDate) {
      setError(true);
      return;
    }
    setError(false);

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
       
        if (prev < 90) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 5);

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
      
        const response = await axios.post("https://localhost:7055/api/FlightSchedule/search-flights",payload)
        console.log(response.data)
        setIsSearched(true)
        setProgress(100);
        // Navigate to the results page and pass data as state
        navigate('/flights/results', { state: { flightData: response.data} });
        console.log("waiting time")
    
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
    finally
    {
      clearInterval(interval); 
      setLoading(false); 
    }
  };

    return (
      <div className="max-w-4xl mx-auto p-6 bg-secondary rounded-lg shadow-md relative min-h-screen flex flex-col">
        <div className="flex flex-col md:flex-row gap-6">
          {/* From Location */}
          <div className="w-full md:w-2/5">
            <AirportSelect
              placeholder="Where From?"
              Location={fromLocation}
              setLocation={setFromLocation}
              error={error}
              inputstyling={`p-2 rounded-md w-full outline-none ${error ? 'border-2 border-red-500' : 'border-2 border-customColor'}`}
              dropdownstyling="secondary" 
            />
          </div>
  
          {/* Swap Button */}
          <div className="w-full md:w-auto flex justify-center items-center">
            <button
              onClick={handleSwap}
              className={`rounded-full w-12 h-12 flex justify-center items-center ${error ? "bg-red-500 text-white border-2 border-white" : "hover:bg-customColor hover:text-secondary text-customColor border border-customColor"}`}
              aria-label="Swap locations"
              disabled={error}
            >
              <i className="fa-solid fa-repeat"></i>
            </button>
          </div>
  
          {/* To Location */}
          <div className="w-full md:w-2/5">
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
  
        <div className="flex flex-col md:flex-row gap-6 mt-6">

          <div className="w-full md:w-1/2">
            <DateInput
              label="Departure"
              value={departureDate}
              setValue={setDepartureDate}
              required={true}
            />
          </div>
  
          <div className="w-full md:w-1/2">
            <DateInput
              label="Return"
              value={returnDate}
              setValue={setReturnDate}
            />
          </div>
        </div>
  
        <div className="mt-6 flex justify-center">
          <SearchButton onClick={handleSearch} disabled={error} />
        </div>

        {loading && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

<main className="flex-grow">
        <div className="container mx-auto p-4">
          {/* Ambient content with background */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg p-8 shadow-lg mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to AeroFlex</h1>
            <p className="text-lg mb-4">
              Book your flight tickets with ease and enjoy exclusive offers for domestic and international destinations. Experience seamless and secure bookings at the best prices.
            </p>
            <p className="text-lg mb-4">
              With AeroFlex, you can choose from a variety of airlines and seating classes. Whether you're looking for economy, premium, or business class, we have you covered.
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Best price guarantee for all flights</li>
              <li className="mb-2">24/7 customer support for any queries</li>
              <li className="mb-2">Special offers and discounts for frequent flyers</li>
            </ul>
            <p className="text-lg mt-4 font-semibold">
              Start planning your trip with AeroFlex today and explore the world with ease!
            </p>
          </div>

          {/* Quotes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image 1 with Quote */}
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Travel"
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-white text-lg italic px-4 text-center">
                  "The world is a book, and those who do not travel read only one page."
                  <br /> — Saint Augustine
                </p>
              </div>
            </div>

            {/* Image 2 with Quote */}
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Adventure"
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-white text-lg italic px-4 text-center">
                  "Travel is the only thing you buy that makes you richer."
                  <br /> — Anonymous
                </p>
              </div>
            </div>

            {/* Image 3 with Quote */}
            <div className="relative">
              <img
                src=""
                alt="Journey"
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-white text-lg italic px-4 text-center">
                  "To travel is to live."
                  <br /> — Hans Christian Andersen
                </p>
              </div>
            </div>

            {/* Image 4 with Quote */}
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x400"
                alt="Explore"
                className="w-full h-60 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <p className="text-white text-lg italic px-4 text-center">
                  "Jobs fill your pockets, but adventures fill your soul."
                  <br /> — Jamie Lyn Beatty
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="p-6 bg-gray-100">
      {/* <h1 className="text-2xl font-bold mb-4">Flight Seat Layout</h1> */}
      {/* <FlightSeatLayout classConfigs={classConfigs} /> */}
    </div>

      </div>
    );
  };
  
export default FlightSearchForm