import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmation from './LogoutConfirmation';
import axiosInstance from '../../utils/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  const navigate = useNavigate();

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);


  const handleLogout = () => {
    


    axiosInstance.post('/Account/logout', {})
      .then(response => {
        navigate('/flight-owner/login');
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <nav className={`fixed top-0 left-0 h-full bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className={`text-white flex items-center bg-gray-800 p-4 ${!isSidebarOpen ? 'justify-center': 'justify-between'}`}>
        {isSidebarOpen && (
          <img src="/aeroflex.jpeg" alt="Logo" className="h-12 w-16 bg-transparent" />
        )}
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>
      </div>
      <ul className="p-4 space-y-5">
        <li>
          <Link to="/flight-owner/dashboard" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bx-home-alt mr-3'></i> 
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/flight-owner/view-airlines" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-plane-alt mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Airline Management</span>}
          </Link>
        </li>
        <li>
          <Link to="/flight-owner/view-airlines" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-plane-take-off mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Flight Management</span>}
          </Link>
        </li>
        {/* <li>
          <Link to="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-calendar mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Scheduled Flights</span>}
          </Link>
        </li> */}
        {/* <li>
          <Link href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-calendar mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Payment History</span>}
          </Link>
        </li> */}
        <li>
          <Link to="/flight-owner/manage-profile" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-user mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Profile</span>}
          </Link>
        </li>
        <li className="mt-auto">
          <div onClick={()=>setShowLogoutConfirmation(true)} className="flex items-center p-3 hover:bg-blue-500 rounded-lg cursor-pointer">
            <i className="bx bx-log-out mr-3"></i>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </div>
        </li>
        
      </ul>

      {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogout} // Log out user on confirmation
          onCancel={() => setShowLogoutConfirmation(false)} // Hide popup on cancel
        />
      )}
    </nav>
  );
};

export default Sidebar;
