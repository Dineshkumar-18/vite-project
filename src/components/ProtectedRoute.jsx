import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSession } from "../context/SessionContext";
import {Role} from '../constants/Role.js'


const ProtectedRoute = ({ allowedRoles = [], children }) => {

  const { roles,activeRole, setActiveRole, loading } = useSession();
  const location = useLocation();

  console.log("isLoggedIn status: "+activeRole)

  // Wait until session is resolved
  if (loading) return null;

  // Not logged in → go to login
  if (!activeRole) {
    if(location.pathname.startsWith("/flight-owner"))
    {
      return <Navigate to="/flight-owner/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 🔁 Auto-switch role if user has a permitted one
  if (
    allowedRoles.length &&
    !allowedRoles.includes(activeRole)
  ) {
    const alternativeRole = roles.find(r =>
      allowedRoles.includes(r)
    );

    if (alternativeRole) {
      setActiveRole(alternativeRole);
      return children;   // allow access after switch
    }

   return (
      <Navigate
        to="/forbidden"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
