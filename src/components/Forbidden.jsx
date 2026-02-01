import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Role } from "../constants/Role";

const Forbidden = () => {
  const navigate = useNavigate();
  const { activeRole } = useSession();

  const goHome = () => {
    if (activeRole === Role.FLIGHT_OWNER) {
      navigate("/flight-owner/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <h2 className="text-xl mt-2">Forbidden</h2>
      <p className="mt-2 text-gray-600">
        You don’t have permission to access this page.
      </p>

      <button
        onClick={goHome}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Forbidden;
