import React from 'react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <nav className={`fixed top-0 left-0 h-full bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className={`text-white flex items-center bg-gray-800 p-4 ${!isSidebarOpen ? 'justify-center': 'justify-between'}`}>
        {isSidebarOpen && (
          <img src="/aeroflex.jpg" alt="Logo" className="h-12 w-12 bg-transparent" />
        )}
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>
      </div>
      <ul className="p-4 space-y-5">
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bx-home-alt mr-3'></i> 
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-plane-alt mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Airline Management</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-plane-take-off mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Flight Management</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-calendar mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Schedule Flights</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-calendar mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Payment History</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className='bx bxs-user mr-3'></i>
            {isSidebarOpen && <span className="ml-3">Profile</span>}
          </a>
        </li>
        <li className="mt-auto">
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className="bx bx-log-out mr-3"></i>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-3 hover:bg-blue-500 rounded-lg">
            <i className="bx bxs-plus-circle mr-3"></i>
            {isSidebarOpen && <span className="ml-3">Add new Assistant</span>}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
