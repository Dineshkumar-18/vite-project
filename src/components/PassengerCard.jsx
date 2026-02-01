import { useState } from "react";

const PassengerCard = ({ passengers}) => {

const [selectedTicket, setSelectedTicket] = useState(null);

  const handleViewTicket = (ticketUrl) => {
    setSelectedTicket(ticketUrl);
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const handleDownload = async (ticketUrl) => {
  try {
    const response = await fetch(ticketUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ticket.jpg"; // you can customize the filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
};


  return (
    <>
    <div className="space-y-4 mt-6">
      {passengers.map((p) => (
        <div
          key={p.passengerId}
          className="flex justify-between items-center border rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
        >
          {/* Left: Passenger Info */}
          <div className="flex flex-col space-y-1">
            {/* Name */}
            <div className="text-lg font-bold text-gray-800">
              {p.firstname} {p.lastname} ({p.passengerType})
            </div>

            {/* Seat and Price */}
            <div className="flex items-center space-x-4">
              <div className="text-blue-600 font-semibold text-md">
                Seat: {p.seatInfo?.seatNumber}
              </div>
              <div className="text-green-600 font-bold text-md">
                ₹{p.seatInfo?.seatPrice}
              </div>
            </div>

            {/* Seat type, class, status */}
            <div className="flex space-x-3 text-sm text-gray-600">
              {p.seatInfo?.seatType && <span>{p.seatInfo.seatType}</span>}
              {p.seatInfo?.seatClass && <span>{p.seatInfo.seatClass}</span>}
              <span
                className={`font-semibold px-2 py-0.5 rounded-full text-white ${
                  p.passengerStatus === "CANCELLED"
                    ? "bg-red-600"
                    : "bg-green-600"
                }`}
              >
                {p.passengerStatus}
              </span>
            </div>

            {/* DOB & Gender */}
            <div className="flex space-x-4 text-gray-500 text-sm">
              {p.dateOfBirth && (
                <span>DOB: {new Date(p.dateOfBirth).toLocaleDateString()}</span>
              )}
              {p.gender && <span>Gender: {p.gender}</span>}
            </div>
          </div>

          {/* Right: View Ticket Button */}
          <div>
            <button
              onClick={() => handleViewTicket(p.ticketInfo?.ticketUrl)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
    
          {/* Modal for Ticket */}
{selectedTicket && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg w-11/12 md:w-3/4 lg:w-2/3 p-4 relative flex flex-col items-center">
      {/* Close Button */}
      <button
        onClick={handleCloseModal}
        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
      >
        ✕
      </button>

      {/* Ticket Image */}
      <div className="w-full flex justify-center">
        <img
          src={selectedTicket}
          alt="Ticket"
          className="max-h-[80vh] max-w-full object-contain rounded-md shadow"
        />
      </div>

      {/* Download Button */}
      <div className="flex justify-end w-full mt-4">
        <a
          href={selectedTicket}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Download Ticket
        </a>
      </div>

      {/* <button
  onClick={() => handleDownload(selectedTicket)}
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
>
  Download Ticket
</button> */}
    </div>
  </div>
)}


      </>

  );
};

export default PassengerCard;
