import React, { useEffect, useMemo, useRef, useState } from "react";
import AirportSelect from "../../AirportSelect";
import { useFlightContext } from "../../../context/FlightContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import SeatAllocation from "../../SeatAllocation";
import UpdateFlightLayout from "./UpdateFlightLayout";
import AddFlightForm from "../AddFlightForm";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const FlightForm = () => {
  // State to handle form progress
  const [step, setStep] = useState(1);

  const {flightData}=useFlightContext()

  const [layout,setLayout]=useState([])

  console.log(flightData)
  const {id}=useParams()

  const [isSaved, setIsSaved] = useState({ step1: false, step2: false, step3: false,step4:false });
  const [cancellationFee, setCancellationFee] = useState({
    flightScheduleId:'',
    chargeRate: 0,
    platformFee: 0,
  });
  
 


 const [flightPricing,setFlightPricing]=useState(
  {
     basePrice: 0,
    seasonalMultiplier: 1,
    demandMultiplier: 1,
    discount: 0,
  }
 )


  const [fromLocation,setFromLocation]=useState(0)
  const [toLocation,setToLocation]=useState(0)
  const [error,setError]=useState('')
  const [flightScheduleId,setFlightScheduleId]=useState(0)
  const [openEditForm,setOpenEditForm]=useState(false)
  const [classPricing, setClassPricing] = useState({});
  const [showSuccess,setShowSuccess]=useState(false)
  const componentRef = useRef(null);

  const [classWithBasePrice,setClassWithBasePrice]=useState([]) 

    const [flightScheduleData,setFlightScheduleData]=useState(
    {
      departureAirportId: fromLocation,
      arrivalAirportId: toLocation,
      departureTime: new Date().toISOString(),
      arrivalTime: new Date().toISOString(),
      totalSeats:0
    }
  )


  useEffect(()=>
  {
    const fetchLayout=async()=>
    {
      const response=await axiosInstance.get(`/SeatLayout/${id}`);
      console.log(response.data)
      setLayout(response.data)
    }
   fetchLayout();
  },[id])

  const handleSeatPricingChange = (classType, seatType, value) => {
    setSeatPricing(prev => ({
      ...prev,
      [classType]: {
        ...prev[classType],
        [seatType]: value,
      },
    }));
  };



  console.log(classPricing)

  const generateClassWithBasePrice=(classPricing)=>
  {
    const result = [];

    // Iterate over the object keys
    for (const className in classPricing) {

      console.log(className)
        // Extract class object
        const classData = classPricing[className];

        const updatedClassName = className === 'Premium' ? 'Premium Economy' : className;
        
        // Create a new object with className and basePrice
        const classInfo = {
            className: updatedClassName,
            basePrice: parseInt(classData.basePrice)
        };
        console.log(classInfo)
        
        // Add the new object to the result array
        result.push(classInfo);
    }
     return result
  }

 const generateClassType=(classPricing)=>
 {
  const result = {};
// Iterate over the object keys
  for (const className in classPricing) {
    // Extract class data
    const classData = classPricing[className];

    // Create an array of prices (window, middle, aisle)
    const pricesArray = [
        parseInt(classData.window), // Window price
        parseInt(classData.middle), // Middle price
        parseInt(classData.aisle)   // Aisle price
    ];

    // Conditional check to rename 'Premium' to 'Premium Economy'
    const updatedClassName = className === 'Premium' ? 'Premium Economy' : className;

    // Assign pricesArray to a new property with the updated class name
    result[updatedClassName] = pricesArray;
    console.log(result[updatedClassName])
   }
  return result;
 }

 function getClassNames(pricingData) {
  return Object.keys(pricingData).map(className => {
      return className === "Premium" ? "Premium Economy" : className;
  });
}

  console.log(generateClassWithBasePrice(classPricing))
  console.log(generateClassType(classPricing))
  console.log(getClassNames(classPricing))



console.log(flightPricing)


  const handleNext = async () => {
    console.log("next is clicked")
    let apiResponse;
    try {
       console.log(isSaved)
        switch (step) {
            case 1:
                // Validate model A data
                  if(!isSaved.step1){

                    const ModifiedflightScheduleData = {
                      ...flightScheduleData, // Spread existing properties
                      arrivalTime: formatDateToUTC(flightScheduleData.arrivalTime), // Format arrival time
                      departureTime: formatDateToUTC(flightScheduleData.departureTime) // Format departure time
                  };
                  console.log(ModifiedflightScheduleData)
                    
                    apiResponse = await saveModel(`/Flight/addSchedule/${id}`, ModifiedflightScheduleData);
                    console.log(apiResponse);
                    setFlightScheduleId(parseInt(apiResponse.message))
                    setIsSaved((prev) => ({ ...prev, step1: true }));
                    setStep(2)
                    console.log("inside step 2")
                  }
                  else
                  {
                    setStep(2);
                  }
                 
                break;
            case 2:
                  if(!isSaved.step2){
                    console.log(flightPricing)
                     
                    apiResponse = await saveModel(`/Flight/add-pricing/${flightScheduleId}`, flightPricing); // Replace with your endpoint
                    console.log(apiResponse);
                    setIsSaved((prev) => ({ ...prev, step2: true }));
                    setStep(3)
                  }
                  else
                  {
                    setStep(3);
                  }
                
                break;
            case 3:
                // Validate model C data
                if(!isSaved.step3){
                   console.log("inside step3")
                    const classBasePrice=generateClassWithBasePrice(classPricing);
                    console.log(classBasePrice)
                    apiResponse = await saveModel(`/Flight/add-class-pricing/${flightScheduleId}`, classBasePrice); // Replace with your endpoint
                    console.log(apiResponse);

                   
                    const seatTypeValue=generateClassType(classPricing)
                    const seatTypePricingResponse=await saveModel(`/Flight/add-classType-pricing/${flightScheduleId}`,seatTypeValue)
                    console.log(seatTypePricingResponse)
                    // Optionally navigate to a summary or final step
                    const seatCreation=getClassNames(classPricing);
                    console.log(seatCreation)
                    const seatAdd=await saveModel(`/Flight/add-seat-pricing/${flightScheduleId}`,{classNames:seatCreation});
                    console.log(seatAdd)
                    setIsSaved((prev) => ({ ...prev, step3: true }));
                }
                setStep(4);
                break;

              case 4:
                   if(!isSaved.step4)
                   {
                     console.log("inside cancellation")
                     const cancellationFeeUpdated={...cancellationFee,flightScheduleId:flightScheduleId}
                     const cancellationFeeResponse=await saveModel(`/CancellationFee`,cancellationFeeUpdated);
                     console.log(cancellationFeeResponse)

                     const ApprovedToSchedule=await axiosInstance.put(`Flight/updateStatusReadyToSchedule/${flightScheduleId}`)
                     console.log(ApprovedToSchedule)
                   }

                   componentRef.current?.scrollIntoView({ behavior: 'smooth' });
                   setShowSuccess(true);
                   setTimeout(() => setShowSuccess(false), 3000);
               
                  break;
            default:
                break;
        }
    } catch (error) {
        console.error('Error during API call:', error);
        // Optionally handle the error, show a notification, etc.
    }
};


console.log(flightScheduleId)


function formatDateToUTC(dateString) {
  // Create a new Date object
  const date = new Date(dateString);

  // Get the UTC time
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  
  // Return the formatted string in the required format
  return utcDate.toISOString(); // This will give you the format "2024-10-03T11:19:55.525Z"
}

      


      const saveModel = async (url, payload) => {
        try {
            const response = await axiosInstance.post(url, payload);
            return response.data; // Return the response data for further use
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to handle it in the calling function
        }
    };
  


    
   
  const handlePrevious = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  // Example form data state
  
 

useEffect(()=>
{
  if(flightData && flightData.departureAirport && flightData.arrivalAirport)
  setFlightScheduleData((prev)=>({...prev,
    departureAirportId: flightData.departureAirport.airportId,
    arrivalAirportId: flightData.arrivalAirport.airportId,
    totalSeats: flightData.totalSeats
  }))
},[flightData])
 



const handleSubmit=(e)=>
{
  e.preventDefault();
  console.log("form submission")
}

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightScheduleData({
      ...flightScheduleData,
      [name]: value,
    });
  };

  const handlePriceChange=(e)=>
  {
    const { name, value } = e.target;
    setFlightPricing({
      ...flightPricing,
      [name]: parseInt(value),
    });
  }

  const handleClassPriceChange = (classType, field, value) => {
    setClassPricing(prev => ({
      ...prev,
      [classType]: {
        ...prev[classType],
        [field]: value,
      },
    }));
  };


  console.log(classPricing)





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

  };

  const handleBatchUpdatePrices = (seatPriceUpdates) => {
    // Here you would update the pricing data in your database or state
    console.log('Updated prices:', seatPriceUpdates);
  };


  const handleCancellationChange = (e) => {
    const { name, value } = e.target;
    setCancellationFee((prevState) => ({
      ...prevState,
      [name]: name === "chargeRate" || name === "platformFee" ? parseFloat(value) : value,
    }));
  };
  
  

  

  if(!flightData || !flightData.departureAirport || !flightData.arrivalAirport)
  {
  
    return <div>Loading...</div>
  } 


  return (

    
    <div ref={componentRef}>
      {showSuccess && (
      <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
        <div className="flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <p className='text-lg'>Flight Scheduled Successfully!</p>
        </div>
      </div>)}
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
          <span className={`w-1/4 ${step >= 4 ? step>=5 ? "text-green-500": "text-red-500" : "text-gray-500"} text-center font-bold`}>
            Step 3: Cancellation Fee Setup
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
                  value={flightScheduleData.departureTime}
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
                  value={flightScheduleData.arrivalTime}
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
                  value={flightPricing.basePrice}
                  onChange={handlePriceChange}
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
                  value={flightPricing.seasonalMultiplier}
                  onChange={handlePriceChange}
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
                  value={flightPricing.demandMultiplier}
                  onChange={handlePriceChange}
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
                  value={flightPricing.discount}
                  onChange={handlePriceChange}
                  className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Step 3: Class Level Pricing</h2>
            {/* <div className="p-2 bg-yellow-200 rounded-md flex items-center justify-between">
            <p className=""><span className="font-bold">Note: </span>If you want update the flight layout update before setting the price </p>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded mr-20"
              onClick={()=>setOpenEditForm(true)}
            >
              Update Layout
            </button>
             
            </div> */}
              

          <div className="p-4">
      {layout.map((flightClass,index) => (
        <div key={index} className="mb-6 border p-4 rounded shadow">
          <h2 className="text-lg font-bold">{flightClass.classType}</h2>

          {/* Input for Base Price */}
          <div className="mb-4">
            <label className="font-medium">Base Price</label>
            <input
              type="number"
              value={classPricing[flightClass.classType]?.basePrice || ''}
              onChange={(e) => handleClassPriceChange(flightClass.classType, 'basePrice', e.target.value)}
              className="border rounded p-2 w-full"
              placeholder={`Base Price for ${flightClass.classType}`}
            />
          </div>

          {/* Inputs for Seat Type Pricing */}
          <div className="grid grid-cols-3 gap-4">
            {['window', 'aisle', 'middle'].map(seatType => (
              <div key={seatType} className="flex flex-col">
                <label className="font-medium capitalize">{seatType} Price</label>
                <input
                  type="number"
                  value={classPricing[flightClass.classType]?.[seatType] || ''}
                  onChange={(e) => handleClassPriceChange(flightClass.classType, seatType, e.target.value)}
                  className="border rounded p-2"
                  placeholder={`Price for ${seatType}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
            
          </div>
        )}

{step === 4 && (
  <div>
    <h2 className="text-xl font-bold mb-4">Step 4: Cancellation Fee Setup</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Charge Rate */}
      <div>
        <label htmlFor="chargeRate" className="block text-lg font-semibold text-gray-700">
          Charge Rate:
        </label>
        <input
          type="number"
          id="chargeRate"
          name="chargeRate"
          value={cancellationFee.chargeRate}
          onChange={handleCancellationChange}
          className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
        />
      </div>

      {/* Platform Fee */}
      <div>
        <label htmlFor="platformFee" className="block text-lg font-semibold text-gray-700">
          Platform Fee:
        </label>
        <input
          type="number"
          id="platformFee"
          name="platformFee"
          value={cancellationFee.platformFee}
          onChange={handleCancellationChange}
          className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none"
        />
      </div>
    </div>
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
          {step ===4 && (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={handleNext}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center gap-20 mb-5">
        
     </div>
     {
        openEditForm && <UpdateFlightLayout onClose={() => setOpenEditForm(false)}
/>
        // <UpdateFlightLayout flightData={flightScheduleData} selectedClasses={selectedClasses} setSelectedClasses={setSelectedClasses} rowCount={rowCount} handleChangeRowCount={handleChangeRowCount} seatCount={seatCount} handleChangeSeatCount={handleChangeSeatCount} handleSubmit={handleSubmit}/>
     }
     
    
    </div>
  );
};

export default FlightForm;
