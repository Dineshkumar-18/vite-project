import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation';
import axios from 'axios';
import { useFlightOwner } from './FlightOwnerContext';
import axiosInstance from '../../utils/axiosInstance';

const Topbar = () => {
   const[profileOpen,setProfileOpen]=useState(false)
   const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
   const dropdownRef = useRef(null);
   const { flightOwner } = useFlightOwner()

   

   const navigate = useNavigate();

   const handleProfile=(e)=>
   {
      setProfileOpen((prev)=>!prev)
   }
   const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setProfileOpen(false);
    }
  };

  const handleLogout = () => {

    axiosInstance.post('/Account/logout', {})
      .then(response => {
        navigate('/flight-owner/login');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  useEffect(() => {
    // Add event listener for clicks outside the component
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="sticky top-0 flex justify-end items-center px-4   gap-4 bg-white shadow">
      <button className="bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 px-6 rounded-lg" onClick={()=>navigate('add-flight')}>
        <i className='bx bxs-plane-alt mr-2'></i> Add New Flight
      </button>
      <button className="bg-gray-100 hover:bg-gray-200 text-black font-semibold py-2 px-6 rounded-lg" onClick={()=>navigate('add-airline')}>
        <i className='bx bxs-plane-alt mr-2'></i> Add New Airline 
      </button>
     <div className='flex items-center gap-3 cursor-pointer relative p-2' onClick={(e)=>handleProfile(e)} ref={dropdownRef}>
      {flightOwner && flightOwner.profilePictureUrl ? 
      <img
      src={flightOwner.profilePictureUrl}
      alt="Profile Preview"
      className="w-16 h-16 object-cover rounded-full border"
    /> : <i className="fa-solid fa-user"></i>
    }
  
      <span className="text-gray-600 text-md font-semibold">{flightOwner && flightOwner.userName}</span>

     
      {profileOpen && 
      <div className='absolute right-0 bg-secondary top-16 w-52 rounded-md h-max z-50 shadow-lg p-4 flex flex-col gap-3' > 
        <div className='flex items-center gap-3 hover:bg-blue-500 hover:text-white rounded-lg p-2' onClick={()=>navigate('/flight-owner/manage-profile')}>
         <i class="fas fa-user-edit"></i>
         <span className="text-md font-semibold">Manage Profile</span>
        </div>
        <div className='flex items-center gap-4 p-2 hover:bg-blue-500 rounded-lg hover:text-white' onClick={() => setShowLogoutConfirmation(true)}>
           <i class="fa-solid fa-right-from-bracket"></i>
          <button className='font-semibold'>Logout</button>
        </div>
     </div>}
    </div>
    {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogout} // Log out user on confirmation
          onCancel={() => setShowLogoutConfirmation(false)} // Hide popup on cancel
        />
      )}
  </div>

  );
};

export default Topbar;
