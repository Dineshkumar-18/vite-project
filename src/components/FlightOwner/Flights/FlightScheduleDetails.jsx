import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../../utils/axiosInstance';
import { FaClock, FaHourglassHalf, FaInfoCircle, FaMapMarkerAlt, FaPlane, FaUsers } from 'react-icons/fa';
import PassengerDetailsModal from './PassengerDetailsModal';
import { getStatusStyles } from '../../statusStyles';
import { capitalizeOnlyFirstLetter } from '../../capitalizeOnlyFirstLetter';
import FlightStatusChanger from './FlightStatusChanger';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import BookingInsights from './BookingInsights';
import CancellationDetailModal from './CancellationDetaillModal';

const FlightScheduleDetails = () => {
    const { flightScheduleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [schedule, setSchedule] = useState(location.state?.flightSchedule); // Access the passed object

 
    const [bookings, setBookings] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [isPassengerModalOpen, setPassengerModalOpen] = useState(false);
    const [isCancellationModelOpen,setIsCancellationModelOpen]=useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading,setLoading]=useState(false)


    const [insights,setInsights]=useState({
        totalBookings:bookings.length,
        totalRevenue:0,
        cancellation:0,
        cancelltionAmount:0,
        refundProcessed:0,
        refundPending:0,
        taxAmount:0,
        platformCommision:0,
    })

    useEffect(() => {
        
        const fetchBookings = async () => {
            const response = await axiosInstance.get(`/Booking?flightScheduleId=${flightScheduleId}`);
            console.log(response.data)
            setBookings(response.data);
        };

        // fetchSchedule();
        fetchBookings();
    }, [flightScheduleId]);

    const fetchFlightSchedule = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/FlightSchedule/fs-info/${schedule.flightId}`);

            console.log(response.data)

            const foundSchedule = response.data.find(item => item.flightScheduleId == flightScheduleId);
           
            console.log(foundSchedule)
            if (foundSchedule) {
                setSchedule(foundSchedule);
                console.log("Updated schedule:", foundSchedule);
            } 
        } catch (error) {
            console.error("Error fetching flight schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!schedule) {
            fetchFlightSchedule();
        }
    }, []);

    

    const handleChangeStatus = async (newStatus) => {
        // Add logic here to update the status in the database or backend as needed
        console.log("Status changed to:", newStatus.toUpperCase());
        try{
        const response=await axiosInstance.put(`/FlightSchedule/ChangeStatus/${flightScheduleId}`,{ newStatus: newStatus.toUpperCase() },
        { headers: { 'Content-Type': 'application/json' } })

        console.log(response.data)
            await fetchFlightSchedule();
            const retrievedMofifiedData=await axiosInstance.get(`/Booking?flightScheduleId=${flightScheduleId}`);
            console.log(retrievedMofifiedData.data)
            setBookings(retrievedMofifiedData.data);

          window.scrollTo({
            top: 0,
            behavior: 'smooth' // This enables smooth scrolling
        });
    
            setTimeout(() => {
            setShowSuccess(true);
            // Hide the message after 3 seconds
            setTimeout(() => {
              setShowSuccess(false);
            }, 3000);
          }, 500);
        
        }catch(error)
        {
            console.log(error)
        }
    };

    const handleSchedule=()=>
    {
        navigate(`/flight-owner/flight/schedule/${schedule.flightId}`,{
            state: { isNewSchedule: false, flightScheduleId: flightScheduleId },
          })
    }

    const findCancelledCount = (passengers) => {
        return passengers.filter(passenger => passenger.passengerStatus === "CANCELLED").length;
    };
    

    if(!schedule) return <p>Loading...</p>;

    console.log(schedule)

    return (
        <div className="max-w-7xl mx-auto p-6">
     {showSuccess && (
        <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className='text-lg'>Flight Status has been updated successfully!</p>
          </div>
        </div>
      )}
            <h2 className="text-3xl font-bold text-center mb-8">Flight Schedule Details</h2>

{/* Flight Schedule Information */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-gray-50 p-6 rounded-lg shadow-md">

    {/* Flight Information */}
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Flight Information</h3>
        
        {/* Flight Number */}
        <DetailItem
            icon={<FaPlane className="text-blue-500" />} 
            label="Flight Number" 
            value={schedule.flightNumber} 
            isEditing={false} 
        />
        
        {/* Departure */}
        <DetailItem
            icon={<FaMapMarkerAlt className="text-blue-500" />} 
            label="Departure" 
            value={`${schedule.departureAirport} (${schedule.departureAirportIataCode}), ${schedule.departureCity}`} 
            isEditing={false} 
        />
        
        {/* Arrival */}
        <DetailItem 
            icon={<FaMapMarkerAlt className="text-blue-500" />} 
            label="Arrival" 
            value={`${schedule.arrivalAirport} (${schedule.arrivalAirportIataCode}), ${schedule.arrivalCity}`} 
            isEditing={false} 
        />
    </div>

    {/* Departure and Arrival Times */}
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Times & Status</h3>
        
        {/* Departure Time */}
        <DetailItem 
            icon={<FaClock className="text-blue-500" />} 
            label="Departure Time" 
            value={new Date(schedule.departureDateTime).toLocaleString()} 
            isEditing={false} 
        />
        
        {/* Arrival Time */}
        <DetailItem 
            icon={<FaClock className="text-blue-500" />} 
            label="Arrival Time" 
            value={new Date(schedule.arrivalDateTime).toLocaleString()} 
            isEditing={false} 
        />
        
        {/* Duration */}
        <DetailItem 
            icon={<FaHourglassHalf className="text-blue-500" />} 
            label="Duration" 
            value={schedule.duration} 
            isEditing={false} 
        />

        <div className='space-y-4'>
        
        {/* Flight Status */}
        <DetailItem 
            icon={<FaInfoCircle className="text-blue-500" />} 
            label="Status" 
            value={<span className={`${getStatusColor(schedule.flightStatus)} font-bold`}>{schedule.flightStatus}</span>} 
            isEditing={false} 
        />
        {schedule.flightStatus==='SCHEDULING_PROCESS' ? (
            <div className='flex flex-col gap-2'>
            <div className='text-red-500 font-semibold'>Note: This flight is still in the scheduling </div>
            <button className='bg-green-600 px-2 py-3 text-white rounded-lg hover:bg-green-500 font-semibold' 
            onClick={handleSchedule}
            >Continue Scheduling</button>
            </div>)
         :
        (<div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
           <FlightStatusChanger schedule={schedule} onChangeStatus={handleChangeStatus} />
       </div>)}
       </div>
    </div>

    {/* Seats and Edit Section */}
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Seats</h3>
        
        {/* Total Seats */}
        <DetailItem 
            icon={<FaUsers className="text-blue-500" />} 
            label="Total Seats" 
            value={schedule.totalSeatsCount} 
            isEditing={false} 
        />
        
        {/* Available Seats */}

        <DetailItem 
            icon={<FaUsers className="text-blue-500" />} 
            label="Available Seats" 
            value={schedule.availableSeatsCount} 
            isEditing={false} 
        />
        
        {/* Edit Button */}
        {/* {isEditable ? (
            <button
                onClick={() => navigate(`/flightschedule/edit/${schedule.flightScheduleId}`)}
                className="w-full sm:w-auto mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
            >
                Edit Flight Details
            </button>
        ) : (
            <p className="text-sm text-red-500 mt-4">Editing disabled as some seats have been booked.</p>
        )} */}
    </div>
</div>

            {/* Booking Insights */}
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl  font-semibold mb-4 text-gray-800">Booking Insights</h3>
                   
                   <BookingInsights booking={bookings}/>

                <table className="min-w-full text-left text-gray-700">
                    <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
                        <tr>
                            <th className="py-3 px-4">Booking ID</th>
                            <th className="py-3 px-4">Booked User Name</th>
                            <th className="py-3 px-4">Booking Date</th>
                            <th className="py-3 px-4">Total Passengers Booked</th>
                            <th className="py-3 px-4">Total Passengers Cancelled</th>
                            <th className="py-3 px-4">Total Price (₹)</th>
                            <th className="py-3 px-4">Tax Amount (₹)</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Detailed View</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (

                
                            <tr key={index} className="border-b hover:bg-gray-50">
                               
                                <td className="py-3 px-4">{booking.bookingId}</td>
                                <td className="py-3 px-4">{`${booking.user.firstName}  ${booking.user.lastName}`}</td>
                                <td className="py-3 px-4">{new Date(booking.bookingDate).toLocaleString()}</td>
                                <td className="py-3 px-4">{booking.passengers.length}</td>
                                <td className="py-3 px-4">{findCancelledCount(booking.passengers)}</td>

                                <td className="py-3 px-4 text-end">{booking.totalAmount}</td>
                                <td className="py-3 px-4 text-end">{booking.taxAmount}</td>
                                <td className="py-3 px-4 text-center">
                            
              <span
                className={`inline-block text-center px-3 py-1 rounded-full font-semibold ${getStatusStyles(booking.bookingStatus).textColor} ${getStatusStyles(booking.bookingStatus).bgColor} whitespace-normal`}
                style={{
                    wordWrap: 'break-word', // This ensures long words will break and wrap within the span
                    maxWidth: '200px', // You can adjust this based on your design to prevent text overflow
                  }}
              >
                {capitalizeOnlyFirstLetter(booking.bookingStatus.replace('_', ' '))}
              </span>
            </td>
                        <td className="py-3 px-4 flex gap-2 items-center">
                <button 
                    className="py-2 px-2 bg-pink-600 rounded-lg text-white font-semibold hover:bg-pink-500" 
                    onClick={() => {
                        setPassengerModalOpen(true);
                        setSelectedBooking(booking);
                    }}
                >
                    Passenger Details
                </button>
                <button 
                    className="py-2 px-2 bg-green-700 rounded-lg text-white font-semibold hover:bg-green-500"
                >
                    Payment Details
                </button>
                {(booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "PARTIALLY_CANCELLED") ? (
                    <button 
                        className="py-2 px-2 bg-red-700 rounded-lg text-white font-semibold hover:bg-red-500"
                        onClick={() => {
                            setIsCancellationModelOpen(true);
                            setSelectedBooking(booking);
                        }}
                    >
                        Cancellation Details
                    </button>
                ) : (
                    // Placeholder to maintain consistent alignment
                    <div className="py-2 px-2 invisible"></div>
                )}
            </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedBooking && (
    <PassengerDetailsModal
        isOpen={isPassengerModalOpen}
        onClose={() => setPassengerModalOpen(false)}
        booking={selectedBooking}
    />
)}

{selectedBooking && (
    <CancellationDetailModal
        isOpen={isCancellationModelOpen}
        onClose={() => setIsCancellationModelOpen(false)}
        booking={selectedBooking}
    />
)}


          

        </div>
    );
};

// Helper function for color coding the flight status
const getStatusColor = (status) => {
    switch (status) {
        case 'SCHEDULING_PROCESS': return 'text-yellow-500 ';
        case 'SCHEDULED': return 'text-green-500';
        case 'ONTIME': return 'text-blue-500';
        case 'DELAYED': return 'text-orange-500';
        case 'CANCELLED': return 'text-red-500';
        case 'BOARDING': return 'text-purple-500';
        case 'GATE_CLOSED': return 'text-gray-500';
        case 'DEPARTED': return 'text-teal-500';
        case 'IN_AIR': return 'text-indigo-500';
        case 'LANDED': return 'text-green-700';
        case 'ARRIVED': return 'text-green-600';
        case 'DIVERTED': return 'text-pink-500';
        default: return 'text-gray-500';
    }
};


const DetailItem = ({ icon, label, value, isEditing, onChange, name }) => (
    <div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
        {icon}
        <div className="space-y-3 text-lg">
            <h3 className="font-semibold text-gray-700">{label}</h3>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="border px-3 py-2 outline-none rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
            ) : (
                <p>{value}</p>
            )}
        </div>
    </div>
);


export default FlightScheduleDetails;
