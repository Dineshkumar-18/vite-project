import React, { useEffect, useState } from 'react'
import FlightSchedule from '../components/FlightSchedule'
import FlightDetailView from '../components/FlightDetailView'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FlightInfo from '../components/FlightInfo'
import ContinueButton from '../components/ContinueButton'
import { DiVim } from 'react-icons/di'
import SliderComponent from '../components/SliderComponent'
import SeatAllocation from '../components/SeatAllocation'
import axiosInstance from '../utils/axiosInstance'

const Booking = () => {
    const location =useLocation()
    const flightDetails=location.state?.bookingDetails
    const {id}=useParams()
    const [flight, setFlight] = useState({});
    const [loading,setLoading]=useState(false)
    const [layoutOpen,setLayoutOpen]=useState(false)
    const [seatLayoutInfo,setSeatLayoutInfo]=useState([])
    const [disabledSeats,setDisabledSeats]=useState(new Set())
    const [classnames, setClassnames] = useState([]);
    const [rowCount, setRowCount] = useState({
        'economy-row-count': 0,
        'business-row-count': 0,
        'first-row-count': 0,
        'premium-row-count': 0,
    });
    const navigate=useNavigate()

    const [click,setClick]=useState(false)


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
        // Update state with the final values
        setRowCount(updatedRowCount);
        setClassnames(orderedClassNames);
    }
}, [seatLayoutInfo]);


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
  return (
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
          <ContinueButton setClick={setClick}/>
          </div>)
           }
          </div>
 <div className='mt-5'>
    <div className='flex gap-3 text-secondary text-2xl items-center mb-3'>
      <div className='w-8 h-8 bg-secondary flex justify-center items-center rounded-full text-customColor font-bold'>2</div>
      <h1 className='font-semibold'>Seat Selection</h1>
  </div>
  <SeatAllocation layout={seatLayoutInfo[0].layoutPattern} TotalColumns={seatLayoutInfo[0].totalColumns} setSeatCount={() => {}} disabledSeats={disabledSeats} setDisabledSeats={setDisabledSeats} classnames={classnames} rowCount={rowCount} role="user" isBookingStarted={false}/>
  <ContinueButton setClick={setClick}/>
  </div>
       </div>
        <div className='bg-secondary rounded-lg p-4 h-max'>
         <h1 className='text-xl font-bold'>Pricings</h1>
         <div>
         <h1 className='text-lg'>Total Price</h1>
         <h1 className='text-lg'>₹7000</h1>
         </div>
         <h1 className='text-lg'>Total Price ₹7000</h1>
         <h1 className='text-lg'>Tax Price ₹2000</h1>
        </div>
    </div>
  )
}

export default Booking
