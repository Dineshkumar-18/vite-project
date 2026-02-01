import React from "react";

const BookingConfirmationEmail = () => {
  // ✅ Mock data (simulating your TicketDto list)
  const ticketDetails = [
    {
      BookingId: 987654,
      CustomerName: "John Doe",
      AirlineName: "IndiGo Airlines",
      AirlineLogo:
        "https://upload.wikimedia.org/wikipedia/commons/1/1f/IndiGo_Logo.svg",
      FlightNumber: "6E 278",
      From: "Chennai (MAA)",
      To: "Mumbai (BOM)",
      DepartureAirport: "Chennai International Airport",
      ArrivalAirport: "Chhatrapati Shivaji Maharaj International Airport",
      DepartureDate: "2025-10-20",
      DepartureTime: "06:30 AM",
      ArrivalDate: "2025-10-20",
      ArrivalTime: "08:45 AM",
      PassengerName: "John Doe",
      ClassName: "Economy",
      SeatNumber: "12A",
      TicketPrice: 5499.0,
    },
    {
      BookingId: 987654,
      CustomerName: "John Doe",
      AirlineName: "IndiGo Airlines",
      AirlineLogo:
        "https://upload.wikimedia.org/wikipedia/commons/1/1f/IndiGo_Logo.svg",
      FlightNumber: "6E 278",
      From: "Chennai (MAA)",
      To: "Mumbai (BOM)",
      DepartureAirport: "Chennai International Airport",
      ArrivalAirport: "Chhatrapati Shivaji Maharaj International Airport",
      DepartureDate: "2025-10-20",
      DepartureTime: "06:30 AM",
      ArrivalDate: "2025-10-20",
      ArrivalTime: "08:45 AM",
      PassengerName: "Jane Doe",
      ClassName: "Economy",
      SeatNumber: "12B",
      TicketPrice: 5499.0,
    },
  ];

  const aeroflexLogo =
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Airplane_icon.svg";

  const totalPrice = ticketDetails.reduce(
    (sum, t) => sum + t.TicketPrice,
    0
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-3xl w-full overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-center py-6 px-4">
          <div className="flex justify-center items-center space-x-4 mb-3">
            <img
              src={aeroflexLogo}
              alt="AeroFlex"
              className="h-10 w-10 bg-white rounded-full p-1"
            />
            <img
              src={ticketDetails[0].AirlineLogo}
              alt={ticketDetails[0].AirlineName}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            AeroFlex Booking Confirmation
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Booking ID: <strong>{ticketDetails[0].BookingId}</strong>
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Greeting */}
          <p className="text-lg mb-2">
            Dear <strong>{ticketDetails[0].CustomerName}</strong>,
          </p>
          <p className="text-gray-700 mb-6">
            Thank you for choosing <strong>AeroFlex</strong>! Your booking is
            confirmed. Below are your e-ticket details.
          </p>

          {/* Flight Info Card */}
          <div className="border rounded-xl p-5 shadow-sm bg-blue-50 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
              ✈️ Flight Details
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-gray-700">
              <div>
                <strong>Airline:</strong> {ticketDetails[0].AirlineName}
              </div>
              <div>
                <strong>Flight No:</strong> {ticketDetails[0].FlightNumber}
              </div>
              <div>
                <strong>From:</strong> {ticketDetails[0].From}
              </div>
              <div>
                <strong>To:</strong> {ticketDetails[0].To}
              </div>
              <div>
                <strong>Departure:</strong>{" "}
                {ticketDetails[0].DepartureDate} at{" "}
                {ticketDetails[0].DepartureTime}
              </div>
              <div>
                <strong>Arrival:</strong> {ticketDetails[0].ArrivalDate} at{" "}
                {ticketDetails[0].ArrivalTime}
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="border rounded-xl p-5 shadow-sm bg-gray-50 mb-6">
            <h2 className="text-lg font-semibold text-blue-800 border-b pb-2 mb-4">
              👤 Passenger & Seat Details
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="border p-2 text-left">Passenger Name</th>
                  <th className="border p-2 text-left">Class</th>
                  <th className="border p-2 text-left">Seat</th>
                  <th className="border p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {ticketDetails.map((t, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="border p-2">{t.PassengerName}</td>
                    <td className="border p-2">{t.ClassName}</td>
                    <td className="border p-2">{t.SeatNumber}</td>
                    <td className="border p-2 font-medium text-gray-800">
                      ₹{t.TicketPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Price Section */}
          <div className="text-right mb-6">
            <h3 className="text-xl font-bold text-blue-700">
              Total Price: ₹{totalPrice.toFixed(2)}
            </h3>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
            <h4 className="text-yellow-700 font-semibold mb-2">
              ⚠️ Important Notes
            </h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
              <li>
                Arrive at least <strong>2 hours early</strong> for domestic and{" "}
                <strong>3 hours early</strong> for international flights.
              </li>
              <li>
                Carry a valid <strong>photo ID</strong> for check-in and
                boarding.
              </li>
              <li>
                For changes or cancellations, contact{" "}
                <strong>AeroFlex Support</strong>.
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>We wish you a pleasant journey! ✈️</p>
            <p className="mt-1 font-semibold text-blue-700">
              — The AeroFlex Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationEmail;
