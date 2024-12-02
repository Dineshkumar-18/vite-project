import React, { useContext, useEffect, useMemo, useState } from 'react'
import FlightSchedule from '../components/FlightSchedule'
import FlightDetailView from '../components/FlightDetailView'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FlightInfo from '../components/FlightInfo'
import ContinueButton from '../components/ContinueButton'
import { DiVim } from 'react-icons/di'
import SliderComponent from '../components/SliderComponent'
import SeatAllocation from '../components/SeatAllocation'
import axiosInstance from '../utils/axiosInstance'
import UserSeatLayout from '../components/UserSeatLayout'
import { AppContext } from '../context/AppContext'
import { AuthContext } from '../context/AuthContext'
import AuthContainer from '../components/AuthContainer'

const Booking = () => {
    const location =useLocation()
    const flightDetails=location.state?.bookingDetails
    const userInputData=location.state?.userInputData
    const {isLoggedIn}=useContext(AuthContext)

    const {passengers}=useContext(AppContext)
    
    const {id}=useParams()
    const [flight, setFlight] = useState({});
    const [loading,setLoading]=useState(false)
    const [layoutOpen,setLayoutOpen]=useState(false)
    const [seatLayoutInfo,setSeatLayoutInfo]=useState([])
    const [disabledSeats,setDisabledSeats]=useState(new Set())
    const [classnames, setClassnames] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState(new Set());
    const [totalPrice, setTotalPrice] = useState(0);
    const [rowCount, setRowCount] = useState({
        'economy-row-count': 0,
        'business-row-count': 0,
        'first-row-count': 0,
        'premium-row-count': 0,
    });
    const [startingRowNumber, setStartingRowNumber] = useState(1);
    const [seats, setSeats] = useState([]);
    const navigate=useNavigate()

    const [click,setClick]=useState(false)
    const [seatAllocations, setSeatAllocations] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [authType, setAuthType] = useState('login'); // Default to login
    const [pendingSubmission, setPendingSubmission] = useState(false);



    console.log(passengers)

    const totalSeatsAllowed = useMemo(() => {
        return passengers.adults + passengers.children;
    }, [passengers]);

    const handlePassengerInputChange = (seatNumber, field, value) => {

      const updatedValue = field === 'passengerType' ? parseInt(value, 10) : value;
      setSeatAllocations(prevState => ({
          ...prevState,
          [seatNumber]: {
              ...prevState[seatNumber],
              [field]: updatedValue,
          },
      }));
  };

  const handleDateChange = (seatNumber, date) => {
    setSeatAllocations(prevState => ({  
        ...prevState,
        [seatNumber]: {
            ...prevState[seatNumber],
            dateOfBirth: date, // Store date as "YYYY-MM-DD"
        },
    }));
};

 console.log(isLoggedIn)
 console.log(seatAllocations)


const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isLoggedIn) {
    setAuthType('login');  // Set default to login
    setIsOpen(true); 
    setPendingSubmission(true);
    return;      // Open the AuthContainer modal
  }

  const bookingData = { seatAllocations };
  console.log(bookingData)

  // API Call
            try {
                const response = await axiosInstance.post(`/Booking/createbooking/${id}`, bookingData);

                console.log(response.data)

                // Navigate to payment page on successful booking
                navigate('/payment', {
                    state: { bookingId: parseInt(response.data.message), price: totalPrice }
                });
            // Adjust the path as necessary

            } catch (error) {
                console.error('Error:', error);
            }

          console.log('Form submitted successfully after login!');
};



   useEffect(()=>
  {
     const flightDetail=async()=>
     {
      setLoading(true);
      try{
      const flightResponse=await axiosInstance.get(`/Fetch/${id}`)
      console.log(flightResponse.data.flightId)
      const flightId=flightResponse.data.flightId;

      const response = await axiosInstance.get(`/Flight/flight/${flightId}`);
      const flightData = response.data;

      const departAirportResponse = await axiosInstance.get(`/Airports/${flightData.departureAirportId}`);
      const arrivalAirportResponse = await axiosInstance.get(`/Airports/${flightData.arrivalAirportId}`);
      const flightWithAirports = {
          ...flightData,
          departureAirport: departAirportResponse.data,
          arrivalAirport: arrivalAirportResponse.data,
      };
      setFlight(flightWithAirports);
     
      const seatLayoutResponse=await axiosInstance.get(`/SeatLayout/${flightId}`)
      console.log(seatLayoutResponse.data)
      setSeatLayoutInfo(seatLayoutResponse.data)

      const seatsResponse=await axiosInstance.get(`Fetch/seats/${id}`);
      console.log(seatsResponse.data)
      setSeats(seatsResponse.data)

      const unavailableSeatResponse=await axiosInstance.get(`UnavailableSeat/${flightId}`)
      console.log(unavailableSeatResponse.data)
      const data=unavailableSeatResponse.data;
      const seatNumbers = data.map(seat => seat.seatNumber);
      setDisabledSeats(new Set(seatNumbers));
      setLoading(false); 
      }
      catch(error)
      {
        console.log(error)
        if (error.response && error.response.status === 404) {
          // Handle 404 error specifically
          console.error('Seats not found for this flight. Error:', error);
          setDisabledSeats(new Set()); // If no seats are found, set an empty set
        } else {
          // Handle other errors (network issues, etc.)
          console.error('An error occurred while fetching seat data:', error);
        }
        setLoading(false); 
      }
     }
     flightDetail();

  },[id])

  console.log(seats)

  console.log(flightDetails)


  const handleSeatSelect = (seatIdentifier, seatPrice) => {
    console.log(`Seat selected: ${seatIdentifier}, Price: ${seatPrice}`);

    setSelectedSeats(prevSelectedSeats => {
        const updatedSeats = new Set(prevSelectedSeats);
        let newTotalPrice = totalPrice; // Store the current total price

        // If seat is already selected, unselect it
        if (updatedSeats.has(seatIdentifier)) {
            updatedSeats.delete(seatIdentifier); // Unselect the seat
            newTotalPrice -= seatPrice; // Decrement the total price
        } else {
            // Check if we are exceeding the seat selection limit
            if (updatedSeats.size >= totalSeatsAllowed) {
                alert(`You can only select up to ${totalSeatsAllowed} seats.`);
                return prevSelectedSeats; // Prevent state update
            }

            // Select the seat and update the price
            updatedSeats.add(seatIdentifier); // Select the seat
            newTotalPrice += seatPrice; // Increment the total price
        }

        // Update the total price state
        setTotalPrice(newTotalPrice);
        return updatedSeats; // Return the updated Set
    });
};

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
        
        const userClass = userInputData.class.toLowerCase();
          
        console.log(orderedClassNames,userClass)

        let calculatedStartingRowNumber = 1;

        for (const className of orderedClassNames) {
            const rowCountKey = `${className}-row-count`;
            console.log(rowCountKey);
            console.log(className, userClass);

            // Add row count of the class only if it's before the userClass
            if (className !== userClass) {
                calculatedStartingRowNumber += updatedRowCount[rowCountKey];
                console.log(calculatedStartingRowNumber);
            } else {
                // Stop the loop when we reach the userClass
                break;
            }
        }

        console.log(`Starting row number for ${userClass}: ${startingRowNumber}`);
        
        console.log(updatedRowCount)
// Ensure the class from userInputData is added to the orderedClassNames list
   const finalClassNames = orderedClassNames.includes(userClass)
  ? [userClass]  // Only include the userInputData.class
  : [];   
        // Update state with the final values
        setRowCount(updatedRowCount);
        setClassnames(finalClassNames);
        setStartingRowNumber(calculatedStartingRowNumber);
    }
}, [seatLayoutInfo]);

const seatArray = Array.from(selectedSeats);


if (loading || !flight.departureAirport || !flight.arrivalAirport) { 
  return <div>Loading...</div>;  // Display loading message while fetching
}


    function formatDuration(duration) {

        const [hoursStr, minutesStr, secondsStr] = duration.split(':');
        
        // Convert to integers
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        
        // Format the output
        let formatted = '';
        if (hours > 0) {
          formatted += `${hours}h `;
        }
        if (minutes > 0 || hours === 0) { 
          formatted += `${minutes}m`;
        }
        
        return formatted.trim();
      }
      
      function formatDate(inputDate) {
        
        const date = new Date(inputDate);
      
        const options = {
          weekday: 'short',
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        };
      
        // Format the date
        return date.toLocaleDateString('en-GB', options); 
      }

      console.log(startingRowNumber)

      const handleLoginSuccess = async() => {
        // If there's a pending form submission, continue it
        if (pendingSubmission) {
          
            const bookingData = { seatAllocations };
            console.log(bookingData)

  // API Call
            try {
                const response = await axiosInstance.post(`/Booking/createbooking/${id}`, bookingData);

                console.log(response.data)

                // Navigate to payment page on successful booking
                navigate('/payment', {
                    state: { bookingId: parseInt(response.data.message), price: totalPrice }
                });
            // Adjust the path as necessary

            } catch (error) {
                console.error('Error:', error);
            }

          console.log('Form submitted successfully after login!');
          setPendingSubmission(false);  // Reset pending submission
        }
      };
  return (
        
   <div>
    <AuthContainer
    isOpen={isOpen} 
    onClose={() => setIsOpen(false)} 
    authType={authType} 
    onSwitchAuth={(type) => setAuthType(type)} 
    onLoginSuccess={handleLoginSuccess} 
/>

    <div className='grid grid-cols-5 gap-4'>
       <div className='col-span-4'>
         <div>
          <div className='flex gap-3 text-secondary text-2xl items-center'>
              <div className='w-8 h-8 bg-secondary flex justify-center items-center rounded-full text-customColor font-bold'>1</div>
              <h1 className='font-semibold'>Review your itinerary</h1>
          </div>
          {!click &&
          ( <div>
          <FlightDetailView flightDetails={flightDetails} formatDate={formatDate} formatDuration={formatDuration}/>
          <FlightInfo flightDetails={flightDetails}/>
        
          </div>)
           }
          </div>
 <div className='mt-5'>
    <div className='flex  gap-3 text-secondary text-2xl items-center mb-3'>
      <div className='w-8 h-8 bg-secondary flex justify-center items-center rounded-full text-customColor font-bold'>2</div>
      <h1 className='font-semibold'>Seat Selection</h1>
      <div>
      <p>Seats remaining: {totalSeatsAllowed - selectedSeats.size}</p>
      <p>Selected seats: {Array.from(selectedSeats).join(', ')}</p>
      </div>
  </div>
  
  <UserSeatLayout layout={seatLayoutInfo[0].layoutPattern} TotalColumns={seatLayoutInfo[0].totalColumns} setSeatCount={() => {}} disabledSeats={disabledSeats} setDisabledSeats={setDisabledSeats} classnames={classnames} rowCount={rowCount} role="user" isBookingStarted={false} seatPrice={seats} onSeatSelect={handleSeatSelect} markedSeats={selectedSeats}
    startRow={startingRowNumber}/>
    
{seatArray.length > 0 &&
  <form onSubmit={handleSubmit} className="container my-3 mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
    {/* Dynamically render input fields based on selected seats */}
    {seatArray.map((seatNumber) => (
        <div key={seatNumber} className="mb-6">
            <h4 className="text-lg font-bold mb-2">Passenger Details for Seat {seatNumber}</h4>
            <div>
            <label className="block mt-2 font-semibold">
                First Name:
            </label>
            <input 
                    type="text" 
                    name='firstname'
                    onChange={(e) => handlePassengerInputChange(seatNumber, 'firstname', e.target.value)} 
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={seatAllocations[seatNumber]?.firstname || ""}
                    required
                />
            </div>
            <div>
            <label className="block mt-2 font-semibold">
                Last Name:
            </label>
            <input 
                    type="text" 
                    name='lastname'
                    onChange={(e) => handlePassengerInputChange(seatNumber, 'lastname', e.target.value)} 
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={seatAllocations[seatNumber]?.lastname || ""}
                    required
                />
            </div>
            
            <div>

            
            <label className="block mt-2 font-semibold">
                Gender:
            </label>
            <select
                    onChange={(e) => handlePassengerInputChange(seatNumber, 'gender', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={seatAllocations[seatNumber]?.gender}
                    name='gender'
                    required
                >
                    <option disabled selected value="">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                </select>
                </div>
            <div>
            <label className="block mt-2 font-semibold">
                Date of Birth:
                
            </label>
            <input 
                    type="date" 
                    name='dateOfBirth'
                    onChange={(e) => handlePassengerInputChange(seatNumber, 'dateOfBirth', e.target.value)} 
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={seatAllocations[seatNumber]?.dateOfBirth || ""}
                    required
                />
            </div>
            
            <div>

            
            <label className="block mt-2 font-semibold">
                Passenger Type:
                
            </label>
            <select
                    onChange={(e) => handlePassengerInputChange(seatNumber, 'passengerType', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={seatAllocations[seatNumber]?.passengerType}
                    name='passengerType'
                    required
                >
                    <option disabled selected value="">Choose Passenger Type</option>
                    <option value="3">Adult</option>
                    <option value="2">Child</option>
                    <option value="1">Infant</option>
                </select>
            </div>
        </div>
    ))}

    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
        Submit Booking
    </button>
</form>}

  
  
  </div>
  


       </div>
        <div className='bg-secondary rounded-lg p-4 h-max space-y-3'>
         <h1 className='text-xl font-bold'>Pricings</h1>
         <div className='flex justify-between'>
         <h1 className='text-lg font-semibold'>Total Price</h1>
         <h1 className='text-lg font-bold'>₹{totalPrice}</h1>
         </div>
         {/* <div className='flex justify-between'>
         <h1 className='text-lg font-semibold'>Tax Price</h1>
         <h1 className='text-lg font-bold'></h1>
         </div> */}
        </div>
    </div>
    </div>
  )
}

export default Booking
