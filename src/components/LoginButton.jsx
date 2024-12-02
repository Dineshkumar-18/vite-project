import React, { useState, useContext } from 'react';
import UserLogin from './UserLogin'; // Assuming UserLogin is in the same directory
import { AuthContext } from '../context/AuthContext';

const LoginButton = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div>
      <button 
        className='px-6 py-3 border rounded-lg font-semibold border-white text-white hover:bg-blue-600 hover:border-customColor shadow-lg backdrop-blur-md' 
        onClick={handleLoginClick}
      >
        {isLoggedIn ? "Dineshkumar" : "Login/Signup"}
      </button>

      {/* Render login modal conditionally */}
      {showLoginModal && <UserLogin onClose={handleCloseModal} />}
    </div>
  );
};

export default LoginButton;
