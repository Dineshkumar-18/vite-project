import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import LoginButton from './LoginButton'
import AuthContainer from './AuthContainer'
import LogoutConfirmation from './FlightOwner/LogoutConfirmation'
import axiosInstance from '../utils/axiosInstance'
import UserMenu from './UserMenu'
import { AuthContext } from '../context/AuthContext'

const NavBar = () => {

  const navigate=useNavigate()
  const {isLoggedIn,setIsLoggedIn}=useContext(AuthContext)
   const[profileOpen,setProfileOpen]=useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const dropdownRef = useRef(null);


    const [isOpen, setIsOpen] = useState(false);
    const [authType, setAuthType] = useState('login'); // Default to login


    const handleOpenAuth = (type) => {
      setAuthType(type);
      setIsOpen(true);
  };

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
    console.log("inside handle logout")

    axiosInstance.post('/Account/logout', {})
      .then(response => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('userType','user');
        setShowLogoutConfirmation(false)
        navigate('/');
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
    <nav className='flex items-center justify-between font-roboto text-lg'>
      <div>
         <img src="/aeroflex-removebg.png" alt="AeroFlex Logo" className='w-28 h-28'/>
     </div>
     <div className='text-white flex gap-7'>
        <Link to="/" className='hover:text-secondary'>Home</Link>
        <Link to="/" className='hover:text-secondary'>Flights</Link>
     </div>
     <div className='flex items-center gap-6'>
        <div className='text-white flex gap-2 items-center'>
            <img src="/india.png" alt="flag" className='w-8 h-5' />
            <h1>India</h1>
        </div>
        <div className='text-white'>
            <h1>Support</h1>
        </div>
          <div>

           {!isLoggedIn ?
            (<button 
                className='px-6 py-3 border rounded-lg font-semibold border-white text-white hover:bg-blue-600 hover:border-customColor shadow-lg backdrop-blur-md' 
                onClick={() => handleOpenAuth(isLoggedIn ? 'login' : 'register')}
            >
                Login/Signup
            </button>) : (
              <div className='flex items-center gap-3 text-white cursor-pointer' onClick={(e)=>handleProfile(e)} ref={dropdownRef}> 
                <i className="fa-regular fa-user "></i>
                <span>My Account</span>
                {profileOpen &&   
    
      <UserMenu navigate={navigate} setShowLogoutConfirmation={setShowLogoutConfirmation}/>
    }
              </div>
            )}
            <AuthContainer 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                authType={authType} 
                onSwitchAuth={(type) => setAuthType(type)} 
                onLoginSuccess={()=>{}}
            />
        </div>
     </div>
     {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogout} // Log out user on confirmation
          onCancel={() => setShowLogoutConfirmation(false)} // Hide popup on cancel
        />
      )}
   </nav>
  )
}

export default NavBar
