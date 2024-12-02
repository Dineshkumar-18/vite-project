import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  
  const initialUserType = localStorage.getItem('userType') || 'user';
  const [userType, setUserType] = useState(initialUserType);

  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  // When logging out or expiring session, clear localStorage
  // const logout = () => {
  //   setIsSessionExpired(true);
  //   setUserType('user'); // or any default
  //   localStorage.removeItem('userType'); // clear from localStorage
  // };

  return (
    <SessionContext.Provider value={{ isSessionExpired, setIsSessionExpired, userType, setUserType }}>
      {children}  
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
