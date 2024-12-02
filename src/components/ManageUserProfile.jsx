import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import axiosInstance from '../utils/axiosInstance';
import { isEqual } from 'lodash';
import PhoneNumberInput from './PhoneNumberInput';
import { FaTimes, FaTrash } from 'react-icons/fa';


const ManageUserProfile = () => {
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    countryCode:"",
    userProfile: null,
    addressId: null,
  });
  
  const [addressData, setAddressData] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
  });
  
  const [initialProfileData, setInitialProfileData] = useState({});
  const [initialAddressData, setInitialAddressData] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isChanged, setIsChanged] = useState({ address: false, profile: false });
  const [userId, setUserId] = useState(0);
  const [showAlert, setShowAlert] = useState({ isVisible: false, message:[], isSuccess: true });
  const [errors, setErrors] = useState({});

  const setShowAlertMessage = (message, isSuccess, duration = 3000) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This enables smooth scrolling
  });
    setShowAlert({ isVisible: true, message: Array.isArray(message) ? message : [message],
       isSuccess });
    setTimeout(() => {
      setShowAlert({ isVisible: false, message: [], isSuccess: true });
    }, duration);
  };

  const handlePhoneChange = (data) => {
    console.log(data.phoneNumber,data.countryCode)
    setProfileData((prev) => ({
      ...prev,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
    }));
  };

  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const validateFields = () => {
    const newErrors = {};
    // Check if the email is empty
    if (!profileData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Check if the username is empty
    if (!profileData.userName) {
      newErrors.userName = "Username is required.";
    }
    if(!profileData.firstName)
    {
      newErrors.firstName="Firstname is required";
    }
      if(!profileData.lastName)
      {
        newErrors.LastName="Lastname is required";
      }
      if(!profileData.phoneNumber)
      {
        newErrors.phoneNumber="Phonenumber is required";
      }
    
    // Set errors if any
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await axiosInstance.get('/User/get-user-details');
      const { userId } = response.data;
      setUserId(userId);
      
      const profileResponse = await axiosInstance.get(`/User/${userId}`);
      setInitialProfileData(profileResponse.data);
      setProfileData(profileResponse.data);
      
      if (profileResponse.data.addressId) {
        const addressResponse = await axiosInstance.get(`/Address/${profileResponse.data.addressId}`);
        setInitialAddressData(addressResponse.data);
        setAddressData(addressResponse.data);
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Exit if no file is selected
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result); // Set the preview of the selected file
    };
    reader.readAsDataURL(file);
  
    const formDataFile = new FormData();
    formDataFile.append('file', file);
  
    try {
      // Determine the API endpoint based on the presence of an existing profile picture
      const apiEndpoint = profileData.userProfile
        ? `/User/update-profile-picture/${userId}`
        : `/User/upload-profile-picture/${userId}`;
      
      // Make the appropriate API call (PUT for update, POST for new upload)
      const response = await axiosInstance({
        method: profileData.userProfile ? 'put' : 'post',
        url: apiEndpoint,
        data: formDataFile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const logoUrl = response.data.fileUrl; // Assuming response contains the URL
      console.log(logoUrl);
      // Update profileData with the new image URL
      setProfileData((prev) => ({ ...prev, userProfile: logoUrl }));
    } catch (error) {
      console.error('Error uploading or updating profile picture:', error);
    }
  };
  

  const isAddressChanged = () => {
    console.log("Current Address Data:", addressData);
    console.log("Initial Address Data:", initialAddressData);
    return !isEqual(addressData, initialAddressData);
  };
  
  const isProfileDataChanged = () => {
    console.log("Current Profile Data:", profileData);
    console.log("Initial Profile Data:", initialProfileData);
    return !isEqual(profileData, initialProfileData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // If validation fails, do not proceed
    }
    setErrors({});
    const addressNeedsUpdate = isAddressChanged();
    const profileNeedsUpdate = isProfileDataChanged();
    console.log(addressNeedsUpdate,profileNeedsUpdate)
    setIsChanged({ address: addressNeedsUpdate, profile: profileNeedsUpdate });


    if (!addressNeedsUpdate && !profileNeedsUpdate) {
      setShowAlertMessage("Your profile is already up to date!", true);
      return; 
    }

    try {
      let newAddressId = profileData.addressId;

      if (addressNeedsUpdate) {
        const addressResponse = profileData.addressId
          ? await axiosInstance.put(`/Address/update-address/${profileData.addressId}`, addressData)
          : await axiosInstance.post('/Address/create-address', addressData);

        newAddressId = addressResponse.data.addressId;
        setInitialAddressData(addressData); 
      }

      if (profileNeedsUpdate) {
        const updateData = {
          ...profileData,
          addressId: newAddressId,
        };
        
        const profileResponse = await axiosInstance.put(`/User/${userId}`, updateData);
        setInitialProfileData(updateData);
      }

    setShowAlertMessage("Your profile has been updated successfully!", true);
    } catch (error) {
      console.error("Error updating profile:", error);
      const alertMessages = [];
      if (error.response && Array.isArray(error.response.data)) {
         const newErrors = {};
         error.response.data.forEach((errorMessage) => {
          if (errorMessage.includes("Email")) {
            newErrors.email = errorMessage;
            alertMessages.push(errorMessage);
          }
          if (errorMessage.includes("Username")) {
            newErrors.userName = errorMessage;
            alertMessages.push(errorMessage);
          }
        });

      setErrors(newErrors);
      if (alertMessages.length > 0) {
      setShowAlertMessage(alertMessages, false);
       }

      }
    }
  };

  

  const handleRemovePhoto = () => {
    setShowConfirmPopup(true); // Show confirmation popup
  };

  const confirmRemovePhoto = async() => {
    // Logic to remove the profile photo
    const response=await axiosInstance.put(`/User/remove-profile-picture/${userId}`)
    console.log(response.data)
    setPhotoPreview(null);
    setProfileData((prevData) => ({
      ...prevData,
      userProfile: null,
    }));
    setShowConfirmPopup(false); // Close the popup after removing
  };

  const cancelRemovePhoto = () => {
    setShowConfirmPopup(false); // Close the popup without removing
  };

  console.log(showAlert.message)
  return (
    <div className="w-3/4 mx-auto p-6 bg-white shadow-md rounded-lg" id='profile'>

      {showAlert.isVisible && (
         <div
         className={`flex flex-col items-start justify-between p-4 mb-4 text-sm ${
           showAlert.isSuccess ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
         } rounded-lg transition-opacity duration-500 ease-in-out`}
       >
         {showAlert.message.map((msg, index) => (
           <div key={index} className="flex items-center">
             {showAlert.isSuccess ? (
               <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
             ) : (
               <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
             )}
             <p className="text-lg">{msg}</p>
           </div>
         ))}
       </div>
       
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
       
         {/* Profile Photo Upload */}
         <div className='flex items-center gap-10'>
      {photoPreview || profileData.userProfile ? (
        <img
          src={photoPreview || profileData.userProfile}
          alt="Profile Preview"
          className="w-36 h-36 object-cover rounded-full border"
        />
      ) : (
        <img
          src="/empty-profile.png"
          alt="No Profile"
          className="w-36 h-36 object-cover rounded-full border"
        />
      )}

      <div className="mt-4">
        <label className="block font-medium text-gray-700">
          {photoPreview || profileData.userProfile ? 'Update Profile Photo' : 'Upload Profile Photo'}
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handlePhotoUpload}
          className="mt-1 block w-full text-md text-gray-900 border border-gray-300 p-2 rounded-lg cursor-pointer bg-gray-50"
        />
        {(photoPreview || profileData.userProfile) && (
  <button
    type="button"
    onClick={handleRemovePhoto}
    className="mt-2 flex items-center text-red-500 cursor-pointer text-md font-semibold"
  >
    <FaTrash className="mr-2" /> {/* Delete icon with margin */}
    Remove Profile Photo
  </button>
)}
      </div>
    </div>
      {/* <div className='bg-blue-400 p-2 text-white rounded-lg'><h1 className='font-semibold text-lg '>Comapany Info</h1></div> */}
        {/* <div className="grid grid-cols-2 gap-4">
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
        </div> */}

{showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
            {/* Close Icon */}
            <button
              onClick={cancelRemovePhoto}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <FaTimes size={20} />
            </button>

            {/* Popup Content */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Do you really want to remove your profile photo?</p>

            {/* Yes and No Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemovePhoto}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmRemovePhoto}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

        {/* User Info */}
    <div className='bg-blue-400 p-2 text-white rounded-lg '><h1 className='font-semibold text-lg '>Account Info</h1></div>
       <div className="grid grid-cols-2 gap-4">
        <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="userName"
              required
              value={profileData.userName || ''}
              onChange={handleChange}
              className={`w-full border-gray-300 border rounded-lg p-3  focus:outline-none ${errors.userName ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500 '}`}
            />
            {errors.userName && <p className="text-red-500 text-xs">{errors.userName}</p>}
          </div>
          <div className='space-y-2'> 
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={profileData.email || ''}
              onChange={handleChange}
              className={`w-full border-gray-300 border rounded-lg p-3  focus:outline-none ${errors.email ? 'border-red-500':'focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={profileData.firstName || ''}
              onChange={handleChange}
              className={`w-full border-gray-300 border rounded-lg p-3 focus:outline-none ${errors.firstName ? 'border-red-500':'focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={profileData.lastName || ''}
              onChange={handleChange}
              className={`w-full border-gray-300 border rounded-lg p-3  focus:outline-none ${errors.lastName ? 'border-red-500':'focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
          <div className='space-y-2'>
            <label className="block font-medium text-gray-700">Phone number</label>
            {/* <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber || ''}
              onChange={handleChange}
              className={`w-full border-gray-300 border rounded-lg p-3  focus:outline-none ${errors.phoneNumber ? 'border-red-500':'focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>} */}

       <PhoneNumberInput
        value={{ phoneNumber: profileData.phoneNumber, countryCode: profileData.countryCode }}
        onChange={handlePhoneChange}
        styles={{
          container: '',
          select: '',
          input: ''
        }}
        errorMessage={setErrors}
      />
       {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>} 
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

export default ManageUserProfile;
