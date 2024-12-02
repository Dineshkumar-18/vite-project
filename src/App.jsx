import React, { useContext, useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './components/FlightOwner/Login'
import { BrowserRouter, Route, Routes, useLocation,useNavigate } from 'react-router-dom'
import FlightSearchForm from './components/FlightSearchForm'
import FlightResults from './components/FlightResults'
import NavBar from './components/NavBar'
import SearchFlights from './components/SearchFlights'
import { AppContext, AppProvider } from './context/AppContext'
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
import ScheduleFlights from './components/FlightOwner/Flights/ScheduleFlights'
import { FlightProvider } from './context/FlightContext'
import UserLogin from './components/UserLogin'
import UserRegister from './components/UserRegister'
import PaymentForm from './components/PaymentForm'
import FooterInfo from './components/FooterInfo'
import AuthContainer from './components/AuthContainer'
import UserInfo from './components/UserInfo'
import { AuthContext } from './context/AuthContext'
import FlightScheduleDetails from './components/FlightOwner/Flights/FlightScheduleDetails'
import FlightOwnerDashboard from './components/FlightOwner/FlightOwnerDashboard'



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
        {!isFlightOwnerRoute && <FooterInfo />}
      </div>
    </div>
  );
};

const App = () => {
  const { isSessionExpired,setIsSessionExpired, setUserType,userType } = useSession();
  const {setIsLoggedIn}=useContext(AuthContext)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authType, setAuthType] = useState('login'); // Default to login

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
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn','false');
    setIsSessionExpired(null)
    if (userType === 'user') {
      setAuthType('login');  // Set default to login
      setIsOpen(true); 
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
            onClick={() => handleLoginRedirect()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  if(isOpen)
  {
    return (<AuthContainer
    isOpen={isOpen} 
    onClose={() => setIsOpen(false)} 
    authType={authType} 
    onSwitchAuth={(type) => setAuthType(type)} 
    onLoginSuccess={()=>{}}
/>)
  }
 

  return (
    
      <AppProvider>
       <ConditionalLayout>
        <Routes>
  
          <Route path="/" element={<SearchFlights />} />
          <Route path="/auth" element={<AuthContainer/>}/>
          <Route path="/flights/results" element={<FlightResults />}/>
          <Route path='/flights/booking/:id' element={<Booking/>}/>
          <Route path='/payment' element={<PaymentForm/>}/>
          <Route path="/user-details" element={<UserInfo/>}/>



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
            <Route path="dashboard" element={<FlightOwnerDashboard />} />
            <Route path="add-airline" element={<AddAirlineForm/>}/>
            <Route path='add-flight' element={<AddFlightForm/>}/>
            <Route path='view-airlines' element={<Airlines/>}/>
            <Route path="view-airline/:id" element={<AirlineDetails/>}/>

            <Route path='flight/:id' element={<FlightDetails/>}/>
            <Route path='flight/schedule/:id' element={<FlightProvider>
                                    <ScheduleFlights />
                                </FlightProvider>}/>

             <Route path="flightschedule/:flightScheduleId" element={<FlightScheduleDetails />} />
            <Route path='flight/layout/edit/:id' element={<AddFlightForm/>}/>
          </Route>

      </Routes>
      </ConditionalLayout>
      
      </AppProvider>



  );

}

export default App

