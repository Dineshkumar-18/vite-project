import { BriefcaseIcon, CogIcon, PrinterIcon, TicketIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import ManageUserProfile from './ManageUserProfile';

const UserInfo = () => {
  // State to track the currently selected menu
  const [selectedMenu, setSelectedMenu] = useState('Manage Profile');

  // Function to render the content based on the selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'Manage Profile':
        return <ManageUserProfile/>
      case 'Trips':
        return <p>View your upcoming trips.</p>;
      case 'Travellers':
        return <p>Manage travellers associated with your account.</p>;
      case 'Settings':
        return <p>Update your account settings.</p>;
      case 'Cancellations':
        return <p>View your cancellation requests.</p>;
      case 'Print Tickets':
        return <p>Print your booked tickets.</p>;
      default:
        return <p>Select a menu item to view details.</p>;
    }
  };


  const menuItems = [
    { name: 'Manage Profile', icon: <UserCircleIcon className="h-6 w-6" /> },
    { name: 'Trips', icon: <BriefcaseIcon className="h-6 w-6" /> },
    { name: 'Travellers', icon: <UsersIcon className="h-6 w-6" /> },
    { name: 'Settings', icon: <CogIcon className="h-6 w-6" /> },
    { name: 'Cancellations', icon: <TicketIcon className="h-6 w-6" /> },
    { name: 'Print Tickets', icon: <PrinterIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 rounded-lg">
      {/* Left sidebar menu */}
      <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
        <ul className="space-y-4">
          {menuItems.map((menu) => (
            <li key={menu.name}>
              <button
                className={`flex items-center w-full text-left p-2 rounded hover:bg-blue-500 hover:text-white transition ${
                  selectedMenu === menu.name ? 'bg-blue-500 text-white' : 'text-gray-700'
                }`}
                onClick={() => setSelectedMenu(menu.name)}
              >
                <span className="mr-3">{menu.icon}</span>
                {menu.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right content view */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-4">{selectedMenu}</h1>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserInfo;
