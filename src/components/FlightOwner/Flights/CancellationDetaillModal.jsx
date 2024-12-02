import React, { useState } from 'react';
import { getStatusStyles } from '../../statusStyles';
import { capitalizeOnlyFirstLetter } from '../../capitalizeOnlyFirstLetter';
import { CalculatorIcon, CurrencyDollarIcon, ExclamationCircleIcon, ReceiptRefundIcon, TicketIcon } from '@heroicons/react/24/solid';

function CancellationDetailModal({ isOpen, onClose, booking }) {
  if (!isOpen) return null;

  const insights = {
    totalBookings: 120,
    totalRevenue: 15000,
    cancellationCount: 10,
    cancellationAmount: 2000,
    refundProcessed: 1800,
    refundPending: 200,
    taxAmount: 1000,
  };

  const findCancelledCount = (passengers) => {
    return passengers.filter(passenger => passenger.passengerStatus === "CANCELLED").length;
};

  const cards = [
    {
      title: 'Booking Id',
      value: booking.bookingId, 
      icon: <TicketIcon className="h-8 w-8 text-blue-600" />,
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Booking Price',
      value: `₹${booking.totalAmount.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Cancellations',
      value: booking.cancellationCount,
      icon: <ExclamationCircleIcon className="h-8 w-8 text-red-600" />,
      bgColor: 'bg-red-100',
    },
    {
      title: 'Refund Amount',
      value: `₹${booking.refundAmount.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-red-600" />,
      bgColor: 'bg-red-100',
    },
    {
      title: 'Refund Processed',
      value: `${booking.refundProcessed}`,
      icon: <ReceiptRefundIcon className="h-8 w-8 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Refunded Amount',
      value: `₹${booking.refundedAmount.toFixed(2)}`,
      icon: <ReceiptRefundIcon className="h-8 w-8 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Refund Pending',
      value: `${booking.refundPending}`,
      icon: <ReceiptRefundIcon className="h-8 w-8 text-orange-600" />,
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Refund Pending Amount',
      value: `₹${booking.refundPendingAmount.toFixed(2)}`,
      icon: <ReceiptRefundIcon className="h-8 w-8 text-orange-600" />,
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Tax Amount',
      value: `₹${booking.taxAmount.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Platform charges - Cancellation',
      value: `₹${booking.platformAndServiceChargeAmount.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-red-600" />,
      bgColor: 'bg-red-100',
    },
    {
      title: 'Company Commission',
      value: `₹${booking.totalCompanyCommission.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100',
    },

    {
      title: 'Net Profit',
      value: `₹${booking.netprofit.toFixed(2)}`,
      icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
      bgColor: 'bg-green-100',
    }
  ];

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 md:p-6">
  <div className="bg-white rounded-lg w-full max-w-3xl md:max-w-4xl lg:max-w-7xl max-h-full overflow-y-auto p-6">
    <h2 className="text-2xl font-bold mb-6">Cancellation Details</h2>
      
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center p-4 rounded-lg shadow-lg ${card.bgColor}`}
        >
          <div className="p-3 rounded-full bg-white">
            {card.icon}
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>

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
          <th className="border-b py-3 px-4 text-left">Cancelled Date</th>
          <th className="border-b py-3 px-4 text-left">Reason</th>
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
            <td className="border-b py-4 px-4">{new Date(booking.seats[index].cancellationDetails.cancelledTime).toLocaleString()}</td>
            <td className="border-b py-4 px-4">{booking.seats[index].cancellationDetails.cancellationReason}</td>


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

export default CancellationDetailModal