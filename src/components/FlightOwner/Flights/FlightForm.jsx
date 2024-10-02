import React, { useEffect, useState } from "react";
import AirportSelect from "../../AirportSelect";
import { useFlightContext } from "../../../context/FlightContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import SeatAllocation from "../../SeatAllocation";

const FlightForm = () => {
  // State to handle form progress
  const [step, setStep] = useState(1);

  const {flightData}=useFlightContext()

  console.log(flightData)
  const {id}=useParams()
  

  const handleNext = () => setStep((prevStep) => Math.min(prevStep + 1, 4));
  const handlePrevious = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  // Example form data state
  const [formData, setFormData] = useState({
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
    arrivalTime: "",
    basePrice: "",
    seasonalMultiplier: "",
    demandMultiplier: "",
    discount: "",
    classPricing: [],
  });
 const [fromLocation,setFromLocation]=useState(0)
 const [toLocation,setToLocation]=useState(0)
 const [error,setError]=useState('')

 const [disabledSeats,setDisabledSeats]=useState(new Set())
 const [loading,setLoading]=useState(false)
 const [seatLayoutInfo,setSeatLayoutInfo]=useState([])
 const [classnames, setClassnames] = useState([]);
 const [rowCount, setRowCount] = useState({
     'economy-row-count': 0,
     'business-row-count': 0,
     'first-row-count': 0,
     'premium-row-count': 0,
 });


 
 useEffect(() => {

  const fetchFlightDetails = async () => {
      setLoading(true);
      try {
         
          const seatLayoutResponse=await axiosInstance.get(`/SeatLayout/${id}`)
          console.log(seatLayoutResponse.data)
          setSeatLayoutInfo(seatLayoutResponse.data)

          const unavailableSeatResponse=await axiosInstance.get(`UnavailableSeat/${id}`)
          console.log(unavailableSeatResponse.data)
          const data=unavailableSeatResponse.data;
          const seatNumbers = data.map(seat => seat.seatNumber);
          setDisabledSeats(new Set(seatNumbers));
          

      } catch (error) {
          console.error("Error fetching flight details", error);
      }
      setLoading(false);  // Set loading to false after fetching
  };
fetchFlightDetails();
}, [id]);


useEffect(() => {
  if (seatLayoutInfo.length > 0) {
      const updatedRowCount = {
          'economy-row-count': 0,
          'business-row-count': 0,
          'first-row-count': 0,
          'premium-row-count': 0,
      };
      const classNamesSet = new Set();

      seatLayoutInfo.forEach(seatLayout => {
          const classType = seatLayout.classType.toLowerCase(); // Convert to lower case for consistency

          // Add class type to the set for unique values
          classNamesSet.add(classType);

          // Increment the corresponding row count
          if (classType === 'economy') {
              updatedRowCount['economy-row-count'] += seatLayout.rowCount;
              classNamesSet.add('economy');
          } else if (classType === 'business') {
              updatedRowCount['business-row-count'] += seatLayout.rowCount;
              classNamesSet.add('business');
          } else if (classType === 'first') {
              updatedRowCount['first-row-count'] += seatLayout.rowCount;
              classNamesSet.add('first');
          } else if (classType === 'premium') {
              updatedRowCount['premium-row-count'] += seatLayout.rowCount;
              classNamesSet.add('premium');
          }
      });

      const orderedClassNames = ['first', 'business', 'premium', 'economy'].filter(name => classNamesSet.has(name));

      // Update state with the final values
      setRowCount(updatedRowCount);
      setClassnames(orderedClassNames);
  }
}, [seatLayoutInfo]);


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const pricing = {
    economy: {
      window: 100,
      aisle: 120,
      middle: 90,
    },
    business: {
      window: 200,
      aisle: 220,
      middle: 180,
    },
    first: {
      window: 100,
      aisle: 120,
      middle: 90,
    },
    premium: {
      window: 200,
      aisle: 220,
      middle: 180,
    }
    // Add more classes as needed
  };


  if(!flightData || !flightData.departureAirport || !flightData.arrivalAirport)
  {
    return <div>Loading...</div>
  }


  return (

    <div>
    <div className="container mx-auto p-6 space-y-6">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex justify-between mb-2">
          <span className={`w-1/4 ${step >= 1 ? step>=2 ? "text-green-500": "text-red-500" : "text-gray-500"} text-center font-bold`}>
            Step 1: Schedule
          </span>
          <span className={`w-1/4 ${step >= 2 ? step>=3 ? "text-green-500": "text-red-500" : "text-gray-500"} text-center font-bold`}>
            Step 2: Flight Pricing
          </span>
          <span className={`w-1/4 ${step >= 3 ? step>=4 ? "text-green-500": "text-red-500" : "text-gray-500"} text-center font-bold`}>
            Step 3: Class Pricing
          </span>
          <span className={`w-1/4 ${step >= 4 ? "text-yellow-500" : "text-gray-500"} text-center`}>
            Step 4: Review
          </span>
        </div>
        <div className="w-full bg-gray-200 h-1 rounded-full">
          <div
            className={`bg-green-500 h-1 rounded-full transition-all duration-300`}
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 1: Schedule Flight</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure and Arrival Airports */}

              <div className='p-4 rounded-lg shadow-sm'>
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2">  
                Departure Location
              </label>
              <AirportSelect placeholder={"Departure"} Location={fromLocation} setLocation={setFromLocation} initialLocationId={flightData.departureAirport.airportId} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
              dropdownstyling="bg-white hover:text-white"/>

            </div>
              <div className='p-4 rounded-lg shadow-sm'>
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2">  
                Arrival Location
              </label>
              <AirportSelect placeholder={"Departure"} Location={toLocation} setLocation={setToLocation} initialLocationId={flightData.arrivalAirport.airportId} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
              dropdownstyling="bg-white hover:text-white"/>

            </div>
              {/* Departure and Arrival Time */}
              <div className='p-4 rounded-lg shadow-sm'>
                <label htmlFor="departureTime" className="block text-lg font-semibold text-gray-700 mb-2">
                  Departure Time:
                </label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  required
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
              <div className='p-4 rounded-lg shadow-sm'>
                <label htmlFor="arrivalTime" className="block text-lg font-semibold text-gray-700 mb-2">
                  Arrival Time:
                </label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  required
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 2: Flight Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="basePrice" className="block text-lg font-semibold text-gray-700">
                  Base Price:
                </label>
                <input
                  type="number"
                  id="basePrice"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="seasonalMultiplier" className="block text-lg font-semibold text-gray-700">
                  Seasonal Multiplier:
                </label>
                <input
                  type="number"
                  id="seasonalMultiplier"
                  name="seasonalMultiplier"
                  value={formData.seasonalMultiplier}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="demandMultiplier" className="block text-lg font-semibold text-gray-700">
                  Demand Multiplier:
                </label>
                <input
                  type="number"
                  id="demandMultiplier"
                  name="demandMultiplier"
                  value={formData.demandMultiplier}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="discount" className="block text-lg font-semibold text-gray-700">
                  Discount:
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 3: Class Level Pricing</h2>
            <div>
              {/* Class-level Pricing */}
              {/* Example of adding multiple class pricing */}
              {formData.classPricing.map((classItem, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-lg font-semibold text-gray-700">
                    {classItem.className} - Total Seats: {classItem.totalSeats}
                  </label>
                  <input
                    type="number"
                    value={classItem.basePrice}
                    onChange={(e) =>
                      handleInputChange({
                        target: {
                          name: `classPricing[${index}].basePrice`,
                          value: e.target.value,
                        },
                      })
                    }
                    className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                    placeholder="Base Price"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 4: Review and Submit</h2>
            {/* Review Data */}
            <pre className="p-4 bg-gray-100 rounded-lg">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
            >
              Previous
            </button>
          )}
          {step < 4 && (
            <button
              onClick={handleNext}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          )}
          {step === 4 && (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
     <div className="font-bold text-2xl text-center mb-4">Flight Schedule Pricing Setup</div>
     <SeatAllocation layout={seatLayoutInfo[0].layoutPattern} TotalColumns={seatLayoutInfo[0].totalColumns} setSeatCount={() => {}} disabledSeats={disabledSeats} setDisabledSeats={setDisabledSeats} classnames={classnames} rowCount={rowCount} role="flightOwner" isBookingStarted={false} isPriceSetup={true} pricing={pricing}/>
    </div>
  );
};

export default FlightForm;
