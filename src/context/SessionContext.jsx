  import { createContext, useContext, useEffect, useRef, useState } from "react";
  import { useAuth } from "./AuthContext";
  import axiosInstance from "../utils/axiosInstance";
  import {Role} from '../constants/Role'

  const SessionContext = createContext();

  export const SessionProvider = ({ children }) => {

    const [roles, setRoles] = useState([]);
    const [activeRole, setActiveRole] = useState(null);
    const [pendingInitialRole, setPendingInitialRole] = useState(null);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchedOnce = useRef(false);



    useEffect(() => {

      const loadSession = async () => {
        try {
          const res = await axiosInstance.get("/account/auth/me");
          const userRoles = res.data.roles || [];

          setRoles(userRoles);

          console.log("User roles: "+userRoles)

          // Respect login-selected role if valid
          if (pendingInitialRole && userRoles.includes(pendingInitialRole)) {
            setActiveRole(pendingInitialRole);
          }
          // Fallback to priority
          else if (userRoles.includes(Role.FLIGHT_OWNER)) {
            setActiveRole(Role.FLIGHT_OWNER);
          } else if (userRoles.includes(Role.USER)) {
            setActiveRole(Role.USER);
          }
        } catch(err) {
          if (err.response?.status === 401) {
             setRoles([]);
             setActiveRole(null);
             return;
           }
        } finally {
          setLoading(false);
        }
      };

      loadSession();
    }, [pendingInitialRole]);

  const logout = () => {
    setRoles([]);
    setActiveRole(null);
    setIsSessionExpired(false);
  };

    return (
      <SessionContext.Provider
        value={{
          roles,
          activeRole,
          setActiveRole,
          setInitialRole: setPendingInitialRole,
          isSessionExpired,
          setIsSessionExpired,
          loading,
          logout
        }}
      >
        {children}
      </SessionContext.Provider>
    );
  };

  export const useSession = () => useContext(SessionContext);