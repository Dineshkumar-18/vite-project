import React, { useState } from 'react';
import { getStatusStyles } from '../../statusStyles';
import { capitalizeOnlyFirstLetter } from '../../capitalizeOnlyFirstLetter';

function PassengerDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen) return null;




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 md:p-6">
  <div className="bg-white rounded-lg w-full max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-full overflow-y-auto p-6">
    <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
    
    <table className="w-full border-collapse text-[16px]">
      <thead>
        <tr>
          <th className="border-b py-3 px-4 text-left">Full Name</th>
          <th className="border-b py-3 px-4 text-left">Date of Birth</th>
          <th className="border-b py-3 px-4 text-left">Gender</th>
          <th className="border-b py-3 px-4 text-left">Passenger Type</th>
          <th className="border-b py-3 px-4 text-left">Seat Number</th>
          <th className="border-b py-3 px-4 text-left">Class</th>
          <th className="border-b py-3 px-4 text-left">Seat Type</th>
          <th className="border-b py-3 px-4 text-left">Seat Price (₹)</th>
          <th className="border-b py-3 px-4 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {booking.passengers.map((passenger, index) => (
          <tr key={index}>
            <td className="border-b py-4 px-4">{`${passenger.firstname} ${passenger.lastname}`}</td>
            <td className="border-b py-4 px-4">{passenger.dateOfBirth}</td>
            <td className="border-b py-4 px-4">{passenger.gender}</td>
            <td className="border-b py-4 px-4">{capitalizeOnlyFirstLetter(passenger.passengerType)}</td>
            <td className="border-b py-4 px-4">{booking.seats[index].seatNumber}</td>
            <td className="border-b py-4 px-4">{booking.seats[index].seatClass}</td>
            <td className="border-b py-4 px-4">
              {capitalizeOnlyFirstLetter(booking.seats[index].seatType)}
            </td>
            <td className="border-b py-4 px-4 text-end">{booking.seats[index].seatPrice}</td>
            <td className="border-b py-4 px-4">
  <span
    className={`inline-block px-3 py-1 rounded font-semibold text-center ${getStatusStyles(passenger.passengerStatus).textColor} ${getStatusStyles(passenger.passengerStatus).bgColor} whitespace-normal`}
    style={{
      wordWrap: 'break-word', // This ensures long words will break and wrap within the span
      maxWidth: '200px', // You can adjust this based on your design to prevent text overflow
    }}
  >
    {capitalizeOnlyFirstLetter(passenger.passengerStatus.replace('_', ' '))}
  </span>
</td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={onClose}
      className="mt-6 py-2 px-6 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-500"
    >
      Close
    </button>
  </div>
</div>

  );
}

export default PassengerDetailsModal