import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { useSession } from "./context/SessionContext";
import { useAuth } from "./context/AuthContext";
import Home from './pages/Home'
import Login from './components/FlightOwner/Login'
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
import ETicketTestPage from './Testing/ETicketTestPage'
import BookingConfirmationEmail from './Testing/BookingConfirmationEmail'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import { configureInterceptors } from "./utils/axiosInstance";
import ProtectedRoute from "./components/ProtectedRoute";
import {Role} from './constants/Role.js'
import Forbidden from "./components/Forbidden.jsx";

const App = () => {
  const {
    isSessionExpired,
    setIsSessionExpired,
    setInitialRole,
    loading,
    logout
  } = useSession();

  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const location= useLocation();

  /* Axios interceptor */
  useEffect(() => {
    configureInterceptors(setIsSessionExpired);
  }, [setIsSessionExpired]);

  /* Session expired handling */
  useEffect(() => {
    if (isSessionExpired) {
      setShowAuth(true);
    }
  }, [isSessionExpired]);

  const handleReLogin = () => {
    logout();
    setShowAuth(false);
    // Default to user login
    setInitialRole(Role.USER);
    if(location.pathname.startsWith("/flight-owner"))
    {
      navigate("/flight-owner/login");
    }
    else{
      navigate("/")
    }

  };

  if (loading) return null;

  /* Session expired modal */
  if (showAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded">
          <h2 className="text-red-600 font-bold">Session Expired</h2>
          <p>Please login again.</p>
          <button
            onClick={handleReLogin}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

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

  /* Login modal */
  if (showAuth) {
    return (
      <AuthContainer
        isOpen
        onClose={() => setShowAuth(false)}
        authType="login"
        onLoginSuccess={() => setShowAuth(false)}
      />
    );
  }

  return (
    <AppProvider>
      <ConditionalLayout>
        <Routes>
          {/* -------- PUBLIC ROUTES -------- */}
          <Route path="/" element={<SearchFlights />} />
          <Route path="/flights/results" element={<FlightResults />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forbidden" element={<Forbidden />} />


          {/* -------- USER PROTECTED -------- */}
          <Route
            path="/flights/booking/:id"
            element={
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <PaymentForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-details"
            element={
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <UserInfo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-confirm-email"
            element={
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <BookingConfirmationEmail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/e-ticket"
            element={
              <ProtectedRoute allowedRoles={[Role.USER]}>
                <ETicketTestPage />
              </ProtectedRoute>
            }
          />

          {/* -------- FLIGHT OWNER AUTH -------- */}
          <Route path="/flight-owner/login" element={<Login />} />
          <Route path="/flight-owner/register" element={<Register />} />

          {/* -------- FLIGHT OWNER PROTECTED -------- */}
          <Route
            path="/flight-owner/*"
            element={
              <ProtectedRoute allowedRoles={[Role.FLIGHT_OWNER]}>
                <FlightOwnerProvider>
                  <FlightOwnerLayout />
                </FlightOwnerProvider>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<FlightOwnerDashboard />} />
            <Route path="manage-profile" element={<EditProfile />} />
            <Route path="add-airline" element={<AddAirlineForm />} />
            <Route path="add-flight" element={<AddFlightForm />} />
            <Route path="view-airlines" element={<Airlines />} />
            <Route path="view-airline/:id" element={<AirlineDetails />} />
            <Route path="flight/:id" element={<FlightDetails />} />
            <Route
              path="flight/schedule/:id"
              element={
                <FlightProvider>
                  <ScheduleFlights />
                </FlightProvider>
              }
            />
            <Route
              path="flightschedule/:flightScheduleId"
              element={<FlightScheduleDetails />}
            />
          </Route>
        </Routes>
      </ConditionalLayout>
    </AppProvider>
  );
};

export default App;
