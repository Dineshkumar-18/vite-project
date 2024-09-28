import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useFlightOwner } from './FlightOwnerContext';
import axios from 'axios';

const EditProfile = () => {

  const {flightOwner,updateFlightOwner}=useFlightOwner()
  const [profileData, setProfileData] = useState({
    companyName: "",
    companyRegistrationNumber: "",
    companyPhoneNumber: "",
    companyEmail: "",
    operatingLicenseNumber: "",
    joinedDate: "",
    supportContact: "",
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    registerationDate: "",
    addressId:0,
    profilePictureUrl: null, // To store the profile photo
});
 const [addressData,setAddressData]=useState(
    {
        streetAddress: "",
        city: "",
        state: "",
        zipcode: "",
        country: ""
    }
 )

useEffect(() => {
    if (flightOwner) {
        setProfileData({
            companyName: flightOwner.companyName || "",
            companyRegistrationNumber: flightOwner.companyRegistrationNumber || "",
            companyPhoneNumber: flightOwner.companyPhoneNumber || "",
            companyEmail: flightOwner.companyEmail || "",
            operatingLicenseNumber: flightOwner.operatingLicenseNumber || "",
            joinedDate: flightOwner.joinedDate || "",
            supportContact: flightOwner.supportContact || "", 
            userName: flightOwner.userName || "",
            email: flightOwner.email || "",
            firstName: flightOwner.firstName || "",
            lastName: flightOwner.lastName || "",
            phoneNumber: flightOwner.phoneNumber || "",
            dateOfBirth: flightOwner.dateOfBirth || "",
            registerationDate: flightOwner.registerationDate || "",
            addressId:flightOwner.addressId,
            profilePictureUrl: flightOwner.profilePictureUrl, 
        });
    }
}, [flightOwner]);


  
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null); // For profile photo preview
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData({...addressData,[name]:value})
  };

  // Handle profile photo upload
  const handlePhotoUpload = async(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); // Set photo preview
      }
      reader.readAsDataURL(file);

        const formDataFile = new FormData();
        formDataFile.append('file', file);
        let response="";
        try {
            if(!flightOwner.profilePictureUrl){
            // Upload file and get the file URL from backend
            response = await axios.post(`https://localhost:7055/api/FlightOwners/upload-profile-picture/${flightOwner && flightOwner.userId}`, formDataFile, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            });
        }
        else
        {
            response = await axios.put(`https://localhost:7055/api/FlightOwners/update-profile-picture/${flightOwner && flightOwner.userId}`, formDataFile, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
              });
        }
            const logoUrl = response.data.fileUrl; // Assume the response contains fileUrl
            setProfileData((prev) => ({ ...prev, profilePictureUrl: logoUrl }));
        }
        catch(error)
        {
          console.log(error)
        }
    }
  };

  const fetchAddress=async()=>
  {
    const response=await  axios.get(`https://localhost:7055/api/Address/${profileData.addressId}`)
    console.log(response.data)
    setAddressData(response.data)
  }

useEffect(()=>
{
   if(profileData.addressId)
   {
     fetchAddress();
   }
},[profileData.addressId])

  // Handle form submission
  const handleSubmit = async(e) => {
     e.preventDefault();
    try
    { 
        let newAddressId = null;
        console.log(profileData)
       if(profileData.addressId===null || profileData.addressId ===0)
       {
        const addressResponse=await axios.post('https://localhost:7055/api/Address/create-address',addressData,{withCredentials:true})
        console.log(addressResponse.data)
        newAddressId = addressResponse.data.addressId; 
       }
      const updateData=
      {
           
            companyPhoneNumber: profileData.companyPhoneNumber,
            companyEmail: profileData.companyEmail,
            supportContact: profileData.supportContact , 
            userName: profileData.userName ,
            email: profileData.email,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phoneNumber: profileData.phoneNumber,
            dateOfBirth: profileData.dateOfBirth,
            addressId: newAddressId ? parseInt(newAddressId) : parseInt(profileData.addressId),
            profilePictureUrl: profileData.profilePictureUrl
      }
      console.log(profileData.profilePictureUrl)

      console.log('Profile Update Data:', updateData);


       const profileResponse=await axios.put(`https://localhost:7055/api/FlightOwners/${flightOwner.userId}`,updateData,{withCredentials:true})
       console.log(profileResponse.data)
       updateFlightOwner(profileResponse.data)

        setTimeout(() => {
        setShowSuccess(true);
        // Hide the message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 500);
    console.log(profileData);

    }catch(error)
    {
      console.log(error)
    }
   
  };

  return (
    <div className="w-3/4 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      {showSuccess && (
        <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className='text-lg'>Your profile has been updated successfully!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Info */}
       
         {/* Profile Photo Upload */}
        <div className='flex items-center gap-10'>
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Profile Preview"
              className="w-36 h-36 object-cover rounded-full  border"
            />
          ) : (
            // <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center border">
            //   <span className="text-gray-500">No Image</span>
            // </div>
            <img
              src={`${profileData.profilePictureUrl ? profileData.profilePictureUrl : '/empty-profile.png'}`}
              alt="Profile Preview"
              className="w-36 h-36 object-cover rounded-full border"
            />
          )}
          <div className="mt-4">
            <label className="block  font-medium text-gray-700">
              Upload Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-1 block w-full text-md text-gray-900 border border-gray-300 p-2 rounded-lg cursor-pointer bg-gray-50"
            />
          </div>
          {uploading && <p>Uploading logo...</p>}
        </div>
      <div className='bg-blue-400 p-2 text-white rounded-lg'><h1 className='font-semibold text-lg '>Comapany Info</h1></div>
        <div className="grid grid-cols-2 gap-4">
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={profileData.companyName || ''}
              disabled
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Company Registration Number</label>
            <input
              type="text"
              name="companyRegistrationNumber"
              disabled
              value={profileData.companyRegistrationNumber || ''}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Operating License Number</label>
            <input
              type="text"
              name="operatingLicenseNumber"
              value={profileData.operatingLicenseNumber || ''}
              disabled
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Joined Date</label>
            <input
              type="date"
              name="joinedDate"
              value={formatDate(profileData.joinedDate || '')}
              disabled
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Company Phone Number</label>
            <input
              type="text"
              name="companyPhoneNumber"
              value={profileData.companyPhoneNumber || ''}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Company Email</label>
            <input
              type="email"
              name="companyEmail"
              value={profileData.companyEmail || ''}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Support Contact</label>
            <input
              type="text"
              onChange={handleChange}
              name="supportContact"
              value={profileData.supportContact || ''}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* User Info */}
        <div className='bg-blue-400 p-2 text-white rounded-lg'><h1 className='font-semibold text-lg '>Account Info</h1></div>
       <div className="grid grid-cols-2 gap-4">
        <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              value={profileData.userName || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={profileData.dateOfBirth || ''}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="space-y-2">
        <div className='bg-blue-400 p-2 text-white rounded-lg'><h1 className='font-semibold text-lg '>Address</h1></div>
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <label className="block font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={addressData.streetAddress || ''}
                onChange={handleAddressChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className='space-y-2'>
              <label className="block font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                required
                value={addressData.city || ''}
                onChange={handleAddressChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <label className="block font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={addressData.state || ''}
                onChange={handleAddressChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className='space-y-2'>
              <label className="block font-medium text-gray-700">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={addressData.zipcode || ''}
                onChange={handleAddressChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={addressData.country || ''}
              required
              onChange={handleAddressChange}
              className="w-1/2 border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

       

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
