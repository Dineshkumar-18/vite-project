import { useState } from "react";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import axiosInstance from '../utils/axiosInstance';
import PassengerCard from "./PassengerCard";
import TicketGenerator from "./TicketGenerator";
import { useNavigate } from "react-router-dom";

const TripBlock = ({ trip }) => {
  const navigation=useNavigate()
  const [showPassengers, setShowPassengers] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [ticketData, setTicketData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancellationSuccess,setCancellationSuccess]=useState(false)

  const togglePassenger = (id) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCancel = async () => {
    if (!selectedPassengers.length) {
      alert("Please select at least one passenger to cancel.");
      return;
    }

    try {
      setIsProcessing(true);

      const response = await axiosInstance.post(
        `/Cancellation/CancelFlight/${trip.flightScheduleInfo?.flightScheduleId}`,
        {
          passengers: selectedPassengers,
          cancellationReason: "No reason - testing purpose",
        }
      );

      setTicketData(response.data.model); // ✅ trigger TicketGenerator
    } catch (err) {
      console.error(err);
      alert("Cancellation failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleTicketGenerated = () => {
    // Called after TicketGenerator finishes
    alert("Cancelled successfully. Refund will be processed.");
    setShowCancelModal(false);
    setTicketData(null);
    setSelectedPassengers([]);
    setIsProcessing(false);
    navigation("/user-details?tab=Trips")
  };

  // Render TicketGenerator while processing ticket generation
  if (ticketData) {
    return (
      <TicketGenerator
        ticket={ticketData}
        status="CANCELLED"
        onComplete={handleTicketGenerated}
      />
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 relative">
      {/* Airline Name */}
      <div className="text-3xl font-extrabold text-blue-700 mb-6">
        {trip.flightScheduleInfo?.airlineName}
      </div>

      {/* Route Info */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <FaPlaneDeparture className="text-blue-600 text-xl" />
            <span className="text-lg font-semibold">
              {trip.flightScheduleInfo?.departureAirport} - {trip.flightScheduleInfo?.departureCity}
            </span>
          </div>
          <div className="text-md font-medium text-gray-700 mt-1">
            {trip.flightScheduleInfo?.departureDate} • {trip.flightScheduleInfo?.departureTime}
          </div>
        </div>
        <div className="flex-grow mx-6 relative flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 10" className="w-full h-4 text-blue-500">
            <line x1="0" y1="5" x2="190" y2="5" stroke="currentColor" strokeWidth="3" />
            <polygon points="190,0 200,5 190,10" fill="currentColor" />
          </svg>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 justify-end">
            <span className="text-lg font-semibold">
              {trip.flightScheduleInfo?.arrivalAirport} - {trip.flightScheduleInfo?.arrivalCity}
            </span>
            <FaPlaneArrival className="text-green-600 text-xl" />
          </div>
          <div className="text-md font-medium text-gray-700 mt-1">
            {trip.flightScheduleInfo.arrivalDate} • {trip.flightScheduleInfo.arrivalTime}
          </div>
        </div>
      </div>

      {/* Flight Info */}
      <div className="grid grid-cols-3 gap-6 mb-6 text-md text-gray-800">
        <div>Flight: <span className="font-bold">{trip.flightScheduleInfo?.flightNumber}</span></div>
        <div>Total Price: <span className="font-bold text-lg text-green-600">₹{trip.totalAmount}</span></div>
        <div>Status:{" "}
          <span className={`font-bold ${trip.bookingStatus === ("CANCELLED" || "PARTIALLY_CANCELLED") ? "text-red-600" : "text-green-600"}`}>
            {trip.bookingStatus}
          </span>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex items-center justify-between border-t border-gray-300 pt-4">
        <button
          className="text-blue-700 font-semibold hover:underline text-md"
          onClick={() => setShowPassengers(!showPassengers)}
        >
          {showPassengers ? "Hide Passenger Details" : "Show Passenger Details"}
        </button>

        {trip.bookingStatus === ("CONFIRMED" || "PARTIALLY_CANCELLED") && (
          <button
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 shadow"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Trip
          </button>
        )}
      </div>

      {/* Passenger Details */}
      {showPassengers && <PassengerCard passengers={trip.passengers} />}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-[420px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Passengers</h2>

            {trip.passengers
              .filter(p => p.passengerStatus !== 'CANCELLED')
              .map((p) => (
                <div key={p.passengerId} className="flex justify-between items-center mb-3 bg-gray-100 p-3 rounded-lg">
                  <div>
                    <div className="font-medium">{p.firstname} {p.lastname}</div>
                    <div className="text-sm text-gray-600">Seat: {p.seatInfo.seatNumber}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPassengers.includes(p.passengerId)}
                    onChange={() => togglePassenger(p.passengerId)}
                    className="w-5 h-5 accent-red-500"
                  />
                </div>
              ))}

            <div className="flex justify-end space-x-3 mt-5">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
                onClick={handleCancel}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripBlock;
