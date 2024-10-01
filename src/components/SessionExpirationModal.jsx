import React from 'react';

const SessionExpiredModal = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">Session Expired</h2>
      <p>Your session has expired. Please log in again.</p>
      <button 
        onClick={onClose} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Login
      </button>
    </div>
  </div>
);

export default SessionExpiredModal;
