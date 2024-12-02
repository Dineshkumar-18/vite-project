import React from 'react';
import { CurrencyDollarIcon, TicketIcon, ExclamationCircleIcon, ReceiptRefundIcon, CalculatorIcon } from '@heroicons/react/24/solid';

const BookingInsights = ({booking}) => {

    const insights = {
        totalBookings: 120,
        totalRevenue: 15000,
        cancellationCount: 10,
        cancellationAmount: 2000,
        refundProcessed: 1800,
        refundPending: 200,
        taxAmount: 1000,
      };
      

      const cards = [
        {
          title: 'Total Bookings',
          value: booking.length, 
          icon: <TicketIcon className="h-8 w-8 text-blue-600" />,
          bgColor: 'bg-blue-100',
        },
        {
          title: 'Total Booking Amount',
          value: `₹${booking.reduce((sum,book)=>sum+book.totalAmount,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
          bgColor: 'bg-green-100',
        },
        {
          title: 'Cancellations',
          value: booking.reduce((sum,book)=>sum+book.cancellationCount,0),
          icon: <ExclamationCircleIcon className="h-8 w-8 text-red-600" />,
          bgColor: 'bg-red-100',
        },
        {
          title: 'Refund Amount',
          value: `₹${booking.reduce((sum,book)=>sum+book.refundAmount,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-red-600" />,
          bgColor: 'bg-red-100',
        },
        {
          title: 'Refund Processed',
          value: booking.reduce((sum,book)=>sum+book.refundProcessed,0),
          icon: <ReceiptRefundIcon className="h-8 w-8 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
        },
        {
          title: 'Refunded Amount',
          value: `₹${booking.reduce((sum,book)=>sum+book.refundedAmount,0).toFixed(2)}`,
          icon: <ReceiptRefundIcon className="h-8 w-8 text-yellow-600" />,
          bgColor: 'bg-yellow-100',
        },
        {
          title: 'Refund Pending',
          value: booking.reduce((sum,book)=>sum+book.refundPending,0),
          icon: <ReceiptRefundIcon className="h-8 w-8 text-orange-600" />,
          bgColor: 'bg-orange-100',
        },
        {
          title: 'Refund Pending Amount',
          value: `₹${booking.reduce((sum,book)=>sum+book.refundPendingAmount,0).toFixed(2)}`,
          icon: <ReceiptRefundIcon className="h-8 w-8 text-orange-600" />,
          bgColor: 'bg-orange-100',
        },
        {
          title: 'Tax Amount',
          value: `₹${booking.reduce((sum,book)=>sum+book.taxAmount,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
          bgColor: 'bg-green-100',
        },
        {
          title: 'Platform charges - Cancellation',
          value: `₹${booking.reduce((sum,book)=>sum+book.platformAndServiceChargeAmount,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-red-600" />,
          bgColor: 'bg-red-100',
        },
        {
          title: 'Company Commission',
          value: `₹${booking.reduce((sum,book)=>sum+book.totalCompanyCommission,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
          bgColor: 'bg-green-100',
        },

        {
          title: 'Net Profit',
          value: `₹${booking.reduce((sum,book)=>sum+book.netprofit,0).toFixed(2)}`,
          icon: <CurrencyDollarIcon className="h-8 w-8 text-green-600" />,
          bgColor: 'bg-green-100',
        }
        
      ];

  return (
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
  );
};

export default BookingInsights;
