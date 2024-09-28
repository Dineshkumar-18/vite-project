import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FlightOwnerProfile = ({ flightOwnerId, onClose,isProfileCompleted }) => {

  const navigate=useNavigate()
  const [profileData, setProfileData] = useState({
    companyName: "",
    companyRegistrationNumber: "",
    companyPhoneNumber: "",
    companyEmail: "", 
    operatingLicenseNumber: "",
  });

  const handleProfileCompletionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://localhost:7055/api/FlightOwners/profileCompletion/${flightOwnerId}`, // Assuming flightOwnerId is available
        profileData,
        { withCredentials: true }
      );

      alert(response.data);
      // Close the modal after submission
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleBack=()=>
  {
    axios.post('https://localhost:7055/api/Account/logout', {}, { withCredentials: true })
    .then(response => {
      navigate('/flight-owner/login');
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });
  }

  return (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
  {!isProfileCompleted ? 
    (<><h2 className="text-2xl font-semibold mb-6 text-gray-800">Complete Your Profile</h2><form onSubmit={handleProfileCompletionSubmit}>
                      <div className="mb-5">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Company Name</label>
                          <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                              value={profileData.companyName}
                              onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })} />
                      </div>
                      <div className="mb-5">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Company Registration Number</label>
                          <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                              value={profileData.companyRegistrationNumber}
                              onChange={(e) => setProfileData({
                                  ...profileData,
                                  companyRegistrationNumber: e.target.value,
                              })} />
                      </div>
                      <div className="mb-5">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Company Email</label>
                          <input
                              type="email"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                              value={profileData.companyEmail}
                              onChange={(e) => setProfileData({ ...profileData, companyEmail: e.target.value })} />
                      </div>
                      <div className="mb-5">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Company Phone Number</label>
                          <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                              value={profileData.companyPhoneNumber}
                              onChange={(e) => setProfileData({
                                  ...profileData,
                                  companyPhoneNumber: e.target.value,
                              })} />
                      </div>
                      <div className="mb-5">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Operating License Number</label>
                          <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                              value={profileData.operatingLicenseNumber}
                              onChange={(e) => setProfileData({
                                  ...profileData,
                                  operatingLicenseNumber: e.target.value,
                              })} />
                      </div>
                      <button
                          type="submit"
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                      >
                          Submit
                      </button>
                  </form></>) : (
        <div className="text-center bg-white p-6 rounded-lg  w-full max-w-sm mx-auto">
        <div className="text-gray-800 text-2xl font-semibold mb-4">
          <i className="fas fa-check-circle text-green-500 text-3xl"></i>
        </div>
        <div className="text-center text-gray-700 text-lg font-medium mb-4">
          Your profile is currently under review by our admin team.
        </div>
        <p className="text-gray-600 text-base mb-4">
          Thank you for submitting your profile details. Our team will review your information and get back to you as soon as possible. Meanwhile, please ensure that all the details provided are accurate and up-to-date. If you have any questions, feel free to contact our support team.
        </p>
        <button className="px-6 py-3 bg-red-500 text-secondary rounded-lg" onClick={handleBack}>Go back</button>
        <div className="mt-4">
          <a href="/support" className="text-blue-500 hover:text-blue-700 font-medium">
            Contact Support
          </a>
        </div>
      </div>
      
    )}
  </div>
</div>

  );
};

export default FlightOwnerProfile;
