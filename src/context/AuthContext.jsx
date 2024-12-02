import { createContext, useEffect, useState } from "react";

export const AuthContext=createContext()

export const AuthProvider=({children})=>
{
        const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        return storedIsLoggedIn === 'true'; // localStorage returns strings, so check for the string 'true'
    });
   useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

    const value = {
        isLoggedIn,
        setIsLoggedIn
      };
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

