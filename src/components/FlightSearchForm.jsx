import { useNavigate } from "react-router-dom";
import AirportSelect from "./AirportSelect";
import DateInput from "./DateInput";
import SearchButton from "./SearchButton";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import FlightSeatLayout from "./FlightSeatLayout";
import FlightContent from "./FlightContent";
import Carousel from "./Carousel";

const FlightSearchForm = ({setIsSearched}) => {


  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {tripType,setTripType,fromLocation,setFromLocation,toLocation,setToLocation,departureDate,setDepartureDate,returnDate,setReturnDate,Class,to,passengers}=useContext(AppContext)
  const [error, setError] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
 

  const carouselItems = useMemo(() => [
    {
      imgSrc: '/offer.jpeg',
      bgColor: '#003366',
      altText: '50% Off',
      text: 'Limited Time Offer! Book Now and Get 50% Off on Your Next Flight!'
    },
    {
      imgSrc: '/flight-price.jpeg',
      bgColor: '#FFD700',
      altText: 'Travel Now',
      text: 'Unbeatable Prices! Book Your Flight Today and Save Big!'
    },
    {
      imgSrc: '/flight.jpeg ',
      bgColor: '#32CD32',
      altText: 'Special Offer',
      text: 'Exclusive Deal! Book a Round-Trip Flight and Get a Free Upgrade to Business Class!'
    }
  ], []);  // Empty array ensures the items are only created once

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [carouselItems.length]); // Empty dependency array
  

  // Handle dot navigation
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };



  console.log(passengers)




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

  // if (fromLocation === toLocation && fromLocation !== "") {
  //   setError(true)
  // }

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
        navigate('/flights/results', { state: { flightData: response.data,userInputData:payload} });
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
      <>
<div className="relative flex items-center justify-between">
      {/* Left Carousel */}
<div className="hidden lg:block w-1/5">
  <Carousel items={carouselItems} currentIndex={currentIndex} goToSlide={goToSlide} />
</div>
      {/* Main Search Component */}
      <div className="max-w-4xl mx-auto p-6 bg-secondary rounded-lg shadow-md relative flex flex-col w-full lg:w-3/5">
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
  </div>

      {/* Right Carousel */}
<div className="hidden lg:block w-1/5">
  <Carousel items={carouselItems} currentIndex={currentIndex} goToSlide={goToSlide} />
</div>
    </div>

      <FlightContent/>
      </>
    );
  };
  
export default FlightSearchForm