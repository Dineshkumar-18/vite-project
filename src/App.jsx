import React from 'react'
import Home from './pages/Home'
import Login from './components/FlightOwner/Login'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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
  

  return (
    
    <BrowserRouter>
      <AppProvider>
      <ConditionalLayout>
        <Routes>
  
          <Route path="/" element={<SearchFlights />} />
          <Route path='/login' element={<Login />} />
          <Route path="/flights/results" element={<FlightResults />}/>
          <Route path='/flights/booking/:id' element={<Booking/>}/>
         
          <Route path='/flight-owner/register' element={<Register/>}/>
          <Route path='/flight-owner/login' element={<Login/>}/>
         <Route path="/flight-owner/*" element={<FlightOwnerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-airline" element={<AddAirlineForm/>}/>
            <Route path='add-flight' element={<AddFlightForm/>}/>
          </Route>
      </Routes>
      </ConditionalLayout>
      
      </AppProvider>

    </BrowserRouter>


  );

}

export default App

