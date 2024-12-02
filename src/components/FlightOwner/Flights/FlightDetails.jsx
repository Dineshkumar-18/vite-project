import React, { useEffect, useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaCalendarAlt, FaUserTie, FaDollarSign } from 'react-icons/fa'; // Import icons
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import SeatAllocation from '../../SeatAllocation';
import FlightScheduleTable from './FlightScheduleTable';

const FlightDetails = () => {
     
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


    useEffect(() => {

        const fetchFlightDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/Flight/flight/${id}`);
                const flightData = response.data;

                const departAirportResponse = await axiosInstance.get(`/Airports/${flightData.departureAirportId}`);
                const arrivalAirportResponse = await axiosInstance.get(`/Airports/${flightData.arrivalAirportId}`);
                const flightWithAirports = {
                    ...flightData,
                    departureAirport: departAirportResponse.data,
                    arrivalAirport: arrivalAirportResponse.data,
                };
                setFlight(flightWithAirports);
               
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
   
    console.log(flight)

    if (loading || !flight.departureAirport || !flight.arrivalAirport) { 
        return <div>Loading...</div>;  // Display loading message while fetching
    }

    return (
        <div>
        <div className="container mx-auto my-8 bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 text-center space-y-3">
            <h1 className="text-3xl font-bold">Flight Details</h1>
            <p className="text-lg font-bold">Flight Number: <span className='bg-red-600 p-2 rounded-lg'>{flight.flightNumber}</span></p>
            <p className="text-lg font-bold">Aircraft: <span className=' p-2 rounded-lg'>{flight.airCraftType}</span></p>
          </div>
    
          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Flight Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  <FaPlaneDeparture className="inline-block mr-2" /> Departure Information
                </h2>
                <p className="text-gray-600">
                  <span className="font-semibold">From:</span> {flight.departureAirport.city} ({flight.departureAirport.airportName})
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">IATA Code:</span> {flight.departureAirport.iataCode}
                </p>
              </div>
    
              {/* Arrival Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  <FaPlaneArrival className="inline-block mr-2" /> Arrival Information
                </h2>
                <p className="text-gray-600">
                  <span className="font-semibold">To:</span> {flight.arrivalAirport.city} ({flight.arrivalAirport.airportName})
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">IATA Code:</span> {flight.arrivalAirport.iataCode}
                </p>
              </div>
            </div>
    
            {/* Flight Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flight Seats and Layout */}
              <div className="space-y-4">
                <div className='flex gap-2'>
                 
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" width="30px" height="30px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" id="seat_x5F_class" version="1.1" xml:space="preserve"><path d="M355.604,312.941c2.415,0,4.373-1.959,4.373-4.375v-17.08c0-2.416-1.958-4.375-4.373-4.375h-43.736l11.973,25.83H355.604z"/><path d="M138.159,461.049c0,4.919,3.988,8.906,8.907,8.906H357.85c4.92,0,8.907-3.987,8.907-8.906v-14.945H138.159V461.049z"/><path d="M147.34,121.659l-13.479-0.049l32.257,83.041l10.591-3.958c5.783-2.161,8.719-8.601,6.557-14.384l-20.021-53.571  C160.763,126.096,154.429,121.684,147.34,121.659z"/><path d="M374.184,366.359c-1.084-6.89-6.309-12.395-13.132-13.839l-26.825-5.675c-5.186-1.097-9.551-4.574-11.779-9.385  l-10.309-22.259l-1.049-2.261l-11.973-25.83l-4.778-10.308c-4.811-10.047-14.958-16.464-26.12-16.464h-80.542  c-7.519,0-14.263-4.628-16.968-11.644l-14.56-37.766l-33.67-86.679c-2.702-4.527-7.605-7.397-13.002-7.397l-33.275,3.856  c-7.531,0-12.891,7.32-10.617,14.5l46.017,141.405c3.121,9.85,4.708,20.12,4.708,30.453v105.4c0,12.073,9.787,21.859,21.86,21.859  h-0.011v0.209h228.598v-0.209h2.82c8.034,0,14.169-7.175,12.921-15.112L374.184,366.359z"/><path d="M412.709,62.423c-35.895-29.134-88.77-26.764-121.973,5.403c-33.387,32.343-36.835,82.997-11.472,119.151l-10.259,34.611  c-0.763,2.572,1.738,4.91,4.253,3.977l33.844-12.56c36.499,22.105,84.696,16.467,114.998-15.942  C458.366,158.275,454.667,96.479,412.709,62.423z M363.922,103.157l38.786,4.253c1.726-0.08,3.424,0.442,4.807,1.475l4.753,3.551  c1.281,0.958,0.85,2.977-0.711,3.328l-32.169,1.512c-2.468,0.116-4.884-0.74-6.729-2.383l-9.997-8.904  C361.48,104.935,362.348,102.984,363.922,103.157z M416.471,153.134l-11.579,7.558c-7.087,4.626-16.292,4.409-23.151-0.547  l-30.059-21.717l-0.357,44.326c-0.016,1.918-2.273,2.936-3.721,1.676l-5.367-4.671c-1.562-1.36-2.604-3.219-2.947-5.261  l-8.639-51.264l-30.149-21.783c-0.762-0.551-1.426-1.241-1.918-2.042c-0.038-0.063-0.076-0.125-0.112-0.187  c-2.501-4.193-0.453-9.5,4.217-10.923c2.594-0.791,5.205-1.121,7.7-1.156c7.842-0.112,15.417,2.865,21.394,7.942l61.346,52.111  l13.238-2.525c3.455-0.66,7.004,0.545,9.344,3.173l1.275,1.431C418.029,150.448,417.785,152.275,416.471,153.134z"/></svg>
                <h2 className="text-xl font-semibold text-gray-800">
                 Flight Seats Information
                </h2>
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">Total Seats:</span> {flight.totalSeats}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Seat Layout:</span> {flight.totalSeatColumn} columns
                </p>
              </div>
    
              {/* Flight Type */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  <FaCalendarAlt className="inline-block mr-2" /> Flight Type
                </h2>
                <p className="text-gray-600">
                  {flight.flightType === 1 ? 'Domestic' : 'International'}
                </p>
              </div>
            </div>
    
            {/* Pricing Information */}
        
    
            {/* Flight Actions */}
            <div className="mt-6 text-center space-x-4">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300" onClick={()=>setLayoutOpen(prev=>!prev)}>
                View Seat Layout
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300" onClick={()=>{setLayoutOpen(prev=>!prev);navigate(`/flight-owner/flight/schedule/${id}`)}}>
                Schedule Flight
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300" onClick={()=>{setLayoutOpen(prev=>!prev);navigate(`/flight-owner/flight/schedule/${id}`)}}>
                Recent Flight Schedule Details
              </button>
            </div>

          </div>
        </div>
        {layoutOpen && 
            <SeatAllocation layout={seatLayoutInfo[0].layoutPattern} TotalColumns={seatLayoutInfo[0].totalColumns} setSeatCount={() => {}} disabledSeats={disabledSeats} setDisabledSeats={setDisabledSeats} classnames={classnames} rowCount={rowCount} role="flightOwner" isBookingStarted={false}/>
        }
        <FlightScheduleTable/>
        
        </div>
      );    
};

export default FlightDetails;
