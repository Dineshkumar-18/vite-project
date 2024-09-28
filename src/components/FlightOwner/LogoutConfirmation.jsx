import React, { useState } from 'react';

const LogoutConfirmation = ({ onConfirm, onCancel }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const handleLogout = () => {
        setIsLoggingOut(true);
    
        setTimeout(() => {
          setShowSuccess(true);
          setTimeout(() => {
            onConfirm()
          }, 3000);
        }, 500); 
      };
    
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6 items-center">
        {showSuccess ? (
          <>
            <i className="fa-solid fa-check-circle text-green-600 fa-3x"></i>
            <h2 className="text-xl font-semibold text-green-600">Logout Successful</h2>
          </>
        ) : (
          <>
            <i className="fa-solid fa-power-off text-red-600 fa-3x"></i>
            <h2 className="text-xl font-semibold">Are you sure you want to log out?</h2>
            <div className="flex justify-center gap-4 font-semibold">
              <button onClick={onCancel} className="bg-gray-200 text-black px-6 py-3 rounded">Cancel</button>
              <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-3 rounded">
                {isLoggingOut ? 'Logging out...' : 'Yes, Log out'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoutConfirmation;
