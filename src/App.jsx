import React, { useContext, useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './components/FlightOwner/Login'
import { BrowserRouter, Route, Routes, useLocation,useNavigate } from 'react-router-dom'
import FlightSearchForm from './components/FlightSearchForm'
import FlightResults from './components/FlightResults'
import NavBar from './components/NavBar'
import SearchFlights from './components/SearchFlights'
import { AppProvider } from './context/AppContext'
import Booking from './pages/Booking'
import Footer from './components/Footer'
import SeatAllocation from './components/SeatAllocation'
import FlightOwnerLayout from './components/FlightOwner/FlightOwnerLayout'
import AddAirlineForm from './components/FlightOwner/AddAirlineForm'
import Dashboard from './components/FlightOwner/Dashboard'
import AddFlightForm from './components/FlightOwner/AddFlightForm'
import Register from './components/FlightOwner/Register'
import FlightOwnerProfile from './components/FlightOwner/FlightOwnerProfile'
import { FlightOwnerProvider } from './components/FlightOwner/FlightOwnerContext'
import EditProfile from './components/FlightOwner/EditProfile'
import Airlines from './components/FlightOwner/Airline/Airlines'
import {useSession } from './context/SessionContext'
import { configureInterceptors } from './utils/axiosInstance'
import AirlineDetails from './components/FlightOwner/Airline/AirlineDetails'
import FlightDetails from './components/FlightOwner/Flights/FlightDetails'



const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  
  const isFlightOwnerRoute = location.pathname.startsWith('/flight-owner');

  return (
    <div className={isFlightOwnerRoute ? '' : 'bg-customColor min-h-screen'}>
      <div className={isFlightOwnerRoute ? '' : 'container mx-auto px-4'}>
        {!isFlightOwnerRoute && <NavBar />}
        <div className={isFlightOwnerRoute ? '' : 'min-h-screen'}>
          {children}
        </div>
        {!isFlightOwnerRoute && <Footer />}
      </div>
    </div>
  );
};

const App = () => {
  const { isSessionExpired,setIsSessionExpired, setUserType,userType } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Configure the interceptor when the app mounts
    configureInterceptors(setIsSessionExpired);
  }, [setIsSessionExpired,setUserType]);

  useEffect(() => {
    // If session expired, open the modal
    if (isSessionExpired) {
      setIsModalOpen(true);
    }
  }, [isSessionExpired]);

  const navigate=useNavigate()

  const handleLoginRedirect = () => {
    // Close the modal before navigating
    setIsModalOpen(false);
    if (userType === 'user') {
      navigate('/login'); // Redirect to normal user login
    } else if (userType === 'flightOwner') {
      navigate('/flight-owner/login'); // Redirect to flight owner login
    }
  };

  if (isSessionExpired) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-red-600">Session Expired</h2>
          <p className="mt-2">Please log in again to continue.</p>
          <button
            onClick={() => {
              if (userType === 'user') {
                navigate('/login'); // Redirect to normal user login
              } else if (userType === 'flightOwner') {
                console.log("clicked")
                setIsSessionExpired(null)
                navigate('/flight-owner/login'); // Redirect to flight owner login
              }
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }
 

  return (
    
      <AppProvider>
       <ConditionalLayout>
        <Routes>
  
          <Route path="/" element={<SearchFlights />} />
          <Route path='/login' element={<Login />} />
          <Route path="/flights/results" element={<FlightResults />}/>
          <Route path='/flights/booking/:id' element={<Booking/>}/>



          <Route path="/flight-owner/register" element={
          <FlightOwnerProvider>
            <Register />
          </FlightOwnerProvider>
          }/>
        <Route path="/flight-owner/login" element={
          <FlightOwnerProvider>
            <Login />
          </FlightOwnerProvider>
        }/>
         <Route 
              path="/flight-owner/*" 
              element={
                <FlightOwnerProvider>
                  <FlightOwnerLayout />
                </FlightOwnerProvider>
              }
            >
            <Route path='manage-profile' element={<EditProfile/>}/>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-airline" element={<AddAirlineForm/>}/>
            <Route path='add-flight' element={<AddFlightForm/>}/>
            <Route path='view-airlines' element={<Airlines/>}/>
            <Route path="view-airline/:id" element={<AirlineDetails/>}/>
            <Route path='flight/:id' element={<FlightDetails/>}/>
          </Route>

      </Routes>
      </ConditionalLayout>
      
      </AppProvider>



  );

}

export default App

