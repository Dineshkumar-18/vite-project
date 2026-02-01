import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [showAuth, setShowAuth] = useState(false);

  return (
    <AuthContext.Provider value={{showAuth,setShowAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
