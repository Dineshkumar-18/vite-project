import React from "react";

const UserMenu = ({ navigate, setShowLogoutConfirmation }) => {
  return (
    <div className="absolute right-24 bg-white top-20 w-80 rounded-md h-max z-50 shadow-lg p-4 grid grid-cols-2 gap-4 text-sm text-black">
      
      {/* Left Column */}
      <div className="flex flex-col space-y-3">
        <h1 className="text-gray-700 p-2">Account</h1>
        {/* Manage Profile */}
        <div
          className="flex items-center gap-3 hover:bg-blue-500 hover:text-white rounded-lg p-2"
          onClick={() => navigate("/user-details?tab=Manage Profile")}
        >
          <i className="fas fa-user-edit"></i>
          <span className="text-md font-semibold">Manage Profile</span>
        </div>
        
        {/* Trips */}
        <div className="flex items-center gap-3 p-2 hover:bg-blue-500 hover:text-white rounded-lg" onClick={()=> navigate("/user-details?tab=Trips")}>
        <i class="fa-solid fa-plane-departure"></i>
          <span className="font-semibold">Trips</span>
        </div>
        

        {/* Travellers */}
        <div className="flex items-center gap-3 p-2 hover:bg-blue-500 hover:text-white rounded-lg" onClick={()=> navigate("/user-details?tab=Travellers")}>
        <i class="fa-solid fa-user-group"></i>
          <span className="font-semibold">Travellers</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-blue-500 hover:text-white rounded-lg" onClick={()=> navigate("/user-details?tab=Settings")}>
        <i class="fa-solid fa-gear"></i>
          <span className="font-semibold">Settings</span>
        </div>

      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-3">
        
      <h1 className="text-gray-700 p-2">Quick tools</h1>
       
      <div className="flex items-center gap-3 p-2 hover:bg-blue-500 hover:text-white rounded-lg">
        <i class="fa-solid fa-circle-minus"></i>
          <span className="font-semibold">Cancellations</span>
        </div>

        <div className="flex items-center gap-3 p-2 hover:bg-blue-500 hover:text-white rounded-lg">
        <i class="fa-solid fa-print"></i>
          <span className="font-semibold">Print Tickets</span>
        </div>
      </div>

      {/* Sign out / Logout */}
      <div
        className="col-span-2 flex items-center justify-center gap-4 p-2 hover:bg-blue-500 hover:text-white rounded-lg border-t"
        onClick={() => setShowLogoutConfirmation(true)}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        <button className="font-semibold">Logout</button>
      </div>
    </div>
  );
};

export default UserMenu;
