import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import axiosInstance from '../../utils/axiosInstance';


const AddAirlineForm = () => {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    airlineName: '',
    iataCode: '',
    headquarters: '',
    country: '',
    contactNumber: '',
    email: '',
    websiteUrl: '',
    airlineLogo: '' ,
    foundedYear:''
  });

  const [uploading, setUploading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file)
    if (file) {
      setUploading(true);
      const formDataFile = new FormData();
      formDataFile.append('file', file);

      try {
        // Upload file and get the file URL from backend
        const response = await axiosInstance.post('/Airlines/upload-logo', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log(response.data)

        // Set the logo URL in formData
        const logoUrl = response.data.fileUrl; // Assume the response contains fileUrl
        setFormData((prev) => ({ ...prev, airlineLogo: logoUrl }));
        setUploading(false);
      } catch (error) {
        console.error('File upload failed:', error);
        setUploading(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData)
      // Make the POST request to the backend with the formData
      const response = await axiosInstance.post('/Airlines', formData);
      console.log('Airline added successfully:', response.data);

      // Navigate to view airlines page after successful submission
      navigate('/flight-owner/view-airlines');
    } catch (error) {   
      console.error('Error adding airline:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Add New Airline</h2>
        <button
          onClick={() => navigate('/flight-owner/view-airlines')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <i className="fa-solid fa-plane-departure"></i>
          <span className="text-lg">View Airlines</span>
        </button>
      </div>

      <div className="bg-white p-4 text-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Airline Name */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="airlineName">
                Enter Airline Name:
              </label>
              <input
                type="text"
                id="airlineName"
                name="airlineName"
                value={formData.airlineName}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Airindia"
              />
            </div>

            {/* IATA Code */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="iataCode">
                IATA Code:
              </label>
              <input
                type="text"
                id="iataCode"
                name="iataCode"
                value={formData.iataCode}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="country">
                Country of Origin:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Headquarters */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="headquarters">
                Headquarters Location:
              </label>
              <input
                type="text"
                id="headquarters"
                name="headquarters"
                value={formData.headquarters}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="contactNumber">
                Contact Number:
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="email">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Website URL */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="websiteUrl">
                Website URL:
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Founded Year */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="foundedYear">
                Founded Year:
              </label>
              <input
                type="date"
                id="foundedYear"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleInputChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Upload for Airline Logo */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-700 mb-1" htmlFor="file-upload">
                Upload Airline Logo:
              </label>
              <input
                type="file"
                id="file-upload"
                name="airlineLogo"
                accept="image/*"
                className="w-full border-gray-300 border rounded-lg p-2 bg-gray-50"
                onChange={handleFileChange}
              />
              {uploading && <p>Uploading logo...</p>}
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
            <button
              type="reset"
              className="bg-red-600 text-white py-3 px-8 rounded hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAirlineForm;
