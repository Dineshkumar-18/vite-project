import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import TicketGenerator from './TicketGenerator';

const PaymentForm = () => {
    const location = useLocation();
    const { bookingId, price } = location.state || {};

    const [paymentSuccess,setPaymentSucess]=useState(false)
    const [paymentId,setPaymenttId]=useState(false)

    const [formData, setFormData] = useState({
        nameOnCard: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const paymentData = {
            bookingId: bookingId,
            referenceNumber: 'REF123456', // Hardcoded value
            paidAmount: price, // Total price from state // Assuming balance is zero for full payment
            paymentDate: new Date().toISOString(), // Current date in ISO format
            PaymentMethod: 1, // UPI (hardcoded as per enum)
            // Pending status (hardcoded as per enum)
        };
         
         console.log(paymentData);
         const paymentResponse=await axiosInstance.post('/Payment', paymentData);
         console.log(paymentResponse.data)

         const paymentInfo=await axiosInstance.get(`/Fetch/paymentinfo/${bookingId}`)
         console.log(paymentInfo.data);

         setPaymenttId(paymentInfo.data.paymentId)

         setPaymentSucess(true)


        // Here, you would typically send paymentData to your backend or payment processing service
        

        // Handle success or failure logic
        alert('Payment processed successfully!');
    };

    return (
       
        <div className="flex items-center justify-center h-screen bg-blue-900">

            { paymentSuccess ? <TicketGenerator paymentId={paymentId}/> :
           ( <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-center mb-6">Payment</h3>
                <div className="mb-4">
                    <span className="text-gray-700">Cards Accepted:</span>
                    <img src="card_img.png" alt="Cards Accepted" className="w-full max-w-xs mx-auto my-2" />
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
                        value="Proceed"
                        className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                    />
                </form>
            </div>)}
        </div>
    );
};

export default PaymentForm;
