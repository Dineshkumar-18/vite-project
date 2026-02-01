import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import TicketGenerator from './TicketGenerator';

const PaymentForm = () => {
  const location = useLocation();
  const navigation= useNavigate()
  const { bookingId, price } = location.state || {};

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [ticketData, setTicketData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    

      const paymentData = {
        bookingId: bookingId,
        referenceNumber: 'REF123456',
        paidAmount: price,
        paymentDate: new Date().toISOString(),
        PaymentMethod: 1,
      };

      // Step 1: Save payment
      const paymentResponse = await axiosInstance.post('/Payment', paymentData);
      console.log('Payment response:', paymentResponse.data);

      // Step 2: Get payment info
      const paymentInfo = await axiosInstance.get(`/Fetch/paymentinfo/${bookingId}`);
      console.log('Payment info:', paymentInfo.data);
      setPaymentId(paymentInfo.data.paymentId);

      // Step 3: Generate ticket data
      const ticketResponse = await axiosInstance.post(`/Payment/paymentsuccess/${paymentInfo.data.paymentId}`);
      console.log('Ticket Data Response:', ticketResponse.data);

      if (ticketResponse.data?.data?.length > 0) {
        setTicketData(ticketResponse.data.data);
        setPaymentSuccess(true);
        alert('Payment successfull, you\'re ticket will be sent to your email-id');
      } else {
        alert('No ticket data returned from backend.');
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    }
  };


  const handleTicketGenerated = () => {
    // Called after TicketGenerator finishes
    alert("Ticket generated successfully and successfully sent to your email");
    setIsProcessing(false);
    navigation("/user-details?tab=Trips")
  };



  return (
    <div className="flex items-center justify-center h-screen">
      {paymentSuccess ? (
        <TicketGenerator
          ticket={ticketData}
          status={'CONFIRMED'}
          onComplete={handleTicketGenerated}
        />
      ) : (
        <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-6">Payment</h3>
          <div className="mb-4">
            <span className="text-gray-700">Cards Accepted:</span>
            <img
              src="card_img.png"
              alt="Cards Accepted"
              className="w-full max-w-xs mx-auto my-2"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name on Card:</label>
              <input
                type="text"
                name="nameOnCard"
                placeholder="Mr. John Doe"
                value={formData.nameOnCard}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Credit Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1111-2222-3333-4444"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-between mb-4">
              <select
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleChange}
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Expiry Month
                </option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={(i + 1).toString().padStart(2, '0')}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>

              <select
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleChange}
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Expiry Year
                </option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">CVV:</label>
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Booking ID:</label>
              <input
                type="text"
                value={bookingId}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Paid Amount:</label>
              <input
                type="text"
                value={price.toFixed(2)}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-200"
              />
            </div>

            <input
              type="submit"
              value={isProcessing ? 'Processing...' : 'Proceed'}
              disabled={isProcessing}
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
