// components/AirlineDetails.jsx
import React, { useEffect, useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import AirlineFlights from './AirlineFlights';

const AirlineDetails = () => {
  // const airline = {
  //   AirlineName: 'AeroFlex Airlines',
  //   IataCode: 'AF',
  //   Headquarters: 'New York, USA',
  //   Country: 'USA',
  //   ContactNumber: '+1-800-123-4567',
  //   Email: 'support@aeroflex.com',
  //   FoundedYear: '1995',
  //   WebsiteUrl: 'https://www.aeroflex.com',
  //   AirlineLogo: 'https://via.placeholder.com/100',
  //   FlightsOperated: [
  //     { flightNumber: 'AF101', origin: 'JFK', destination: 'LAX', departure: '10:00 AM', arrival: '01:00 PM' },
  //     { flightNumber: 'AF102', origin: 'JFK', destination: 'SFO', departure: '02:00 PM', arrival: '05:00 PM' },
  //     { flightNumber: 'AF103', origin: 'JFK', destination: 'ORD', departure: '06:00 PM', arrival: '08:00 PM' },
  //   ],
  // };

  const {id}=useParams()
  const [airline,setAirline]=useState({})
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const handleInputChange = (e) => {
    setAirline({
      ...airline,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setAirline({
      ...airline,
      airlineLogo: file,
    });
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Submit updated data here
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };


  useEffect(()=>
  {
    const fetchAirlineDetails=async ()=>
    {
      const response=await axiosInstance.get(`/Airlines/${id}`)
      console.log(response.data)
      setAirline(response.data)
      setLogoPreview(response.data.airlineLogo)
    }
    fetchAirlineDetails();
  },[])

  return (
    <div className="container mx-auto p-6 lg:p-12">
      {/* Airline Overview Section */}
      <div className="bg-white shadow-xl rounded-lg p-8 mb-8 border-2 border-customColor">
      <div className="bg-white shadow-xl rounded-lg p-8 mb-8 border-2 border-customColor">
  <div className="flex items-center space-x-6 mb-6">
    <div className="relative">
      {/* Hidden file input for selecting the image */}
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}

      {/* Profile Circle with Camera Icon */}
      {logoPreview ? (
        <img
          src={logoPreview}
          alt="Airline Logo"
          className="w-24 h-24 object-cover rounded-full shadow-md"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full shadow-md">
          {isEditing && (
            <i className="fa-solid fa-camera  text-2xl cursor-pointer z-50" />
          )}
        </div>
      )}
    </div>

    <div>
      {/* Airline Name Input/Display */}
      {isEditing ? (
        <input
          type="text"
          name="AirlineName"
          value={airline.airlineName}
          onChange={handleInputChange}
          className="text-4xl font-bold text-gray-800"
        />
      ) : (
        <h2 className="text-4xl font-bold text-gray-800">{airline.airlineName}</h2>
      )}
      <p className="text-gray-500">Founded in {airline.foundedYear}</p>
    </div>

    {/* Edit Button */}
    <button onClick={handleEditClick} className="ml-auto bg-blue-500 text-white px-6 py-2 rounded">
      {isEditing ? 'Cancel' : <div className="flex gap-2 items-center text-lg"><i className="fa-solid fa-pen-to-square"></i><h1>Edit</h1></div>}
    </button>
  </div>
</div>


        {isEditing && (
          <button onClick={handleSubmit} className="mb-4 bg-green-500 text-white px-6 py-3 rounded">
            Save Changes
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Airline Details */}
          <DetailItem
            icon={<FaMapMarkerAlt className="text-blue-500" />}
            label="Headquarters"
            value={airline.headquarters}
            isEditing={isEditing}
            name="headquarters"
            onChange={handleInputChange}
          />
          <DetailItem
            icon={<FaPhoneAlt className="text-blue-500" />}
            label="Contact"
            value={airline.contactNumber}
            isEditing={isEditing}
            name="contactNumber"
            onChange={handleInputChange}
          />
          <DetailItem
            icon={<FaEnvelope className="text-blue-500" />}
            label="Email"
            value={airline.email}
            isEditing={isEditing}
            name="email"
            onChange={handleInputChange}
          />
          <DetailItem
            icon={<FaGlobe className="text-blue-500" />}
            label="Website"
            value={airline.websiteUrl}
            isEditing={isEditing}
            name="websiteUrl"
            onChange={handleInputChange}
          />
          <DetailItem
            label="IATA Code"
            value={airline.iataCode}
            isEditing={isEditing}
            name="iataCode"
            onChange={handleInputChange}
          />
          <DetailItem
            label="Country"
            value={airline.country}
            isEditing={isEditing}
            name="country"
            onChange={handleInputChange}
          />
        </div>
      </div>
      <AirlineFlights airline={airline}/>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isEditing, name, onChange }) => (
  <div className="p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
    {icon}
    <div className='space-y-3 text-lg'>
      <h3 className="font-semibold text-gray-700">{label}</h3>
      {isEditing ? (
        <input
          type={label==="Website" ? "url" : "text"}
          name={name}
          value={value}
          onChange={onChange}
          className="border px-3 py-2 outline-none rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p>{value}</p>
      )}
    </div>
  </div>
);

export default AirlineDetails;
