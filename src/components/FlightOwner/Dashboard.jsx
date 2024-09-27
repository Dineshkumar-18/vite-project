import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FlightCard from './FlightCard';

const Dashboard = () => {

   return (
          <div className="grid grid-cols-3 gap-6">
            <FlightCard imageSrc="/aeroplane.jpg" description="Airbus 811 - 78 flights" />
            <FlightCard imageSrc="/aeroplane.jpg" description="Boeing 787 - 60 flights" />
            <FlightCard imageSrc="/aeroplane.jpg" description="Total Flights - 150" />
          </div>

         );
};

export default Dashboard;
