import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlightOwnerProfile from './FlightOwnerProfile';
import { useFlightOwner } from './FlightOwnerContext';

const FlightOwnerLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [flightOwnerId, setFlightOwnerId] = useState(null);
    const [isProfileCompleted, setIsProfileCompleted] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const {flightOwner,updateFlightOwner}=useFlightOwner()
    const navigate = useNavigate();
    
    const toggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
      const fetchProfileStatus = async () => {
        try {
          // Get flight owner profile status (JWT stored in HTTP-only cookie)
          const response = await axios.get("https://localhost:7055/api/FlightOwners/get-flightowner-details", {
            withCredentials: true,
          });
  
          const { flightOwnerId } = response.data;
          setFlightOwnerId(flightOwnerId);

  
          const profileResponse = await axios.get(
            `https://localhost:7055/api/FlightOwners/${flightOwnerId}`,
            { withCredentials: true }
          );
  
          const { isProfileCompleted, isApproved } = profileResponse.data;
          console.log(profileResponse.data)
          // Set the profile completion and approval status
          setIsProfileCompleted(isProfileCompleted);
          setIsApproved(isApproved);
          updateFlightOwner(profileResponse.data)
  
          if (!isProfileCompleted || !isApproved) {
            setShowProfileForm(true);
          } 
        } catch (error) {
          console.error("Error fetching flight owner profile", error);
        }
      };
      fetchProfileStatus();
    }, [navigate]);
     
    return (
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        {/* Content */}
        <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'} p-6`}>
          <Topbar />
          <main className="p-4">
             <Outlet/>
          </main> 
        {showProfileForm && (
          <FlightOwnerProfile
            flightOwnerId={flightOwnerId}
            isProfileCompleted={isProfileCompleted}
            onClose={() => setShowProfileForm(false)}
          />
        )}
        </div>
      </div>
    );
}

export default FlightOwnerLayout
