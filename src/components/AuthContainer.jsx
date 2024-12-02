import React, { useState } from 'react';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AuthContainer = ({ isOpen, onClose, authType, onSwitchAuth,onLoginSuccess }) => {
    if (!isOpen) return null;
    const [showSuccess,setShowSuccess]=useState(false)

    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
        <div className={`bg-opacity-80 border-2 border-white border-opacity-40 backdrop-blur-lg text-white rounded-lg p-10 relative ${authType === 'register' ? 'w-[700px]' : 'w-[400px]'}`}>
            <button className="text-white absolute top-4 right-4 hover:text-red-500" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            {showSuccess && (
        <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className='text-lg'>{authType=== 'login' ? 'Login successful': 'User Account Registered successfully'}</p>
          </div>
        </div>)}
            {authType === 'login' ? (
                <UserLogin 
                    onClose={onClose} 
                    onSwitchToRegister={() => onSwitchAuth('register')}
                    setShowSuccess={setShowSuccess}
                    onLoginSuccess={onLoginSuccess}
                />
            ) : (
                <UserRegister 
                    onClose={onClose} 
                    onSwitchToLogin={() => onSwitchAuth('login')} 
                    setShowSuccess={setShowSuccess}
                />
            )}
        </div>
    </div>
    
    );
};

export default AuthContainer;
