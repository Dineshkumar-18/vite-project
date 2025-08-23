import React, { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import FlightRevenueGraph from "./FlightRevenueGraph.jsx";
import { AiOutlineBarChart } from "react-icons/ai";
import { useFlightOwner } from "./FlightOwnerContext.jsx";
import { HiOutlineChartBar } from "react-icons/hi";
import axios from "axios";
import TimeRangeFilter from "./Flights/TimeRangeFilter.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { info } from "autoprefixer";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function FlightOwnerDashboard() {

    const { flightOwner } = useFlightOwner()



    const [dashboardInfo,setDashboarInfo]= useState(null)



    const handleFilterChange = async (filterPayload) => {

        console.log("Sending payload:", filterPayload);
        console.log("flightowner", flightOwner)

         if (!flightOwner.userId) return;

         console.log( `https://localhost:7055/api/FlightOwners/dashboard-info/${flightOwner.userId}`)

        try {
          const response = await axiosInstance.post(
            `https://localhost:7055/api/FlightOwners/dashboard-info/${flightOwner.userId}`,
             filterPayload
          );
          
          console.log(response.data);
          // setDashboardData(response.data); // if you want to store it in state
          setDashboarInfo(response.data)
        } catch (error) {
          console.error("Error fetching dashboard info:", error);
        }
  };

   // Load TOTAL data when component mounts
  useEffect(() => {
    const defaultPayload = {
      timeRange: "TOTAL",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      specificMonth: 0,
      specificYear: 0,
      offset: 0,
    };
    handleFilterChange(defaultPayload);
  }, [flightOwner?.userId]);


    
   
    const LifeTimeOverview=[
        { title: 'Total Flights',total: dashboardInfo?.totalFlights, color: 'bg-blue-500', icon: '✈️' },
        { title: 'Domestic Flights',total: dashboardInfo?.domesticFlights,color: 'bg-green-500', icon: '🏠' },
        { title: 'International Flights',total:dashboardInfo?.internationalFlights,color: 'bg-orange-500', icon: '🌍' },
    ]


    const dashboardData = [
        { title: 'Bookings', total: dashboardInfo?.bookings, color: 'bg-pink-500', icon: '📈' },
        { title: 'Cancelled Flights', total: dashboardInfo?.cancelledFlights, color: 'bg-red-300', icon: '❌' },
        { title: 'Completed Flights',total: dashboardInfo?.tripCompletedFlights, color: 'bg-yellow-500', icon: '✔️' },
        { title: 'Upcoming Flights', total: 1200, color: 'bg-orange-500', icon: '⏳' },
        { title: 'Total Passengers',total: dashboardInfo?.travelledPassengers, color: 'bg-teal-500', icon: '👥' },
        { title: 'Flight Revenue',total: dashboardInfo?.netRevenue, color: 'bg-blue-700', icon: '💵' },
        { title: 'Top Flights by Revenue',total: `${Object.entries(dashboardInfo?.highestRevenueFlight || {}).map(([flight, revenue]) => (
              <div key={flight}>
                {flight}: ${revenue}
              </div>
))}`, color: 'bg-purple-700', icon: '🔥' },
      ];


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <header className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {flightOwner?.userName}</h1>
        <p className="text-gray-600">Insights and analytics for your flights at a glance.</p>
      </header>

      <h1 className="text-2xl font-semibold mb-5 text-customColor flex items-center gap-2"><HiOutlineChartBar className="text-blue-700 text-4xl" />Lifetime Flights Overview</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {LifeTimeOverview.map((item,index)=>
        {
            return (
                <div
                  key={index}
                  className={`${item.color} text-white p-4 rounded-lg shadow-lg flex items-center`}
                >
                  <div className="text-4xl mr-4">{item.icon}</div>
                  <div>
                    <h2 className="text-xl font-semibold">{`${item.title}`}</h2>
                    <p className="text-lg">
                    {item.total}
                  </p>
                  </div>
                </div>
              ); 
        })}
       
      </section>


      <TimeRangeFilter onFilterChange={handleFilterChange} />

      {/* Dropdown for time range selection
      <div className="mb-4 flex items-center justify-between">
      
        <label className="text-2xl font-semibold text-customColor flex items-center gap-2"><AiOutlineBarChart size={40} color="blue" />Flight Insights</label>
        <select
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="p-2 border-2 border-blue-500 outline-none font-semibold focus:ring-2 rounded-lg focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="total">Total</option>
        </select>
      </div> */}




       {/* Metrics Section */}
       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.map((item, index) => {
          // For Total Flights and Total Revenue, we always display their values
          // if (item.title === 'Total Flights' || item.title === 'Total Revenue') {
          //   return (
          //     <div
          //       key={index}
          //       className={`${item.color} text-white p-4 rounded-lg shadow-lg flex items-center`}
          //     >
          //       <div className="text-4xl mr-4">{item.icon}</div>
          //       <div>
          //         <h2 className="text-xl font-semibold">{item.title}</h2>
          //         <p className="text-lg">
          //       {timeRange === 'today'
          //         ? item.today
          //         : timeRange === 'thisWeek'
          //         ? item.thisWeek
          //         : timeRange === 'thisMonth'
          //         ? item.thisMonth
          //         : timeRange === 'thisYear'
          //         ? item.thisYear
          //         : item.total}
          //     </p>
          //       </div>
          //     </div>
          //   );
          // }

          // For other parameters, dynamically update title and value based on the selected time range
          return (
            <div
              key={index}
              className={`${item.color} text-white p-4 rounded-lg shadow-lg flex items-center`}
            >
              <div className="text-4xl mr-4">{item.icon}</div>
              <div>
                <h2 className="text-xl font-semibold">{`${item.title}`}</h2>
                <p className="text-lg">
                {item.total}
              </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Charts Section */}
     <FlightRevenueGraph/>


      {/* Flight Table */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">Flight Performance</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              {["Flight", "On-Time %", "Seats Sold", "Average Price", "Revenue"].map((header, index) => (
                <th key={index} className="p-3 border-b">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { flight: "Flight A", onTime: "96%", sold: "120", avgPrice: "$250", revenue: "$30,000" },
              { flight: "Flight B", onTime: "90%", sold: "110", avgPrice: "$200", revenue: "$22,000" },
            ].map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-3 border-b">{row.flight}</td>
                <td className="p-3 border-b">{row.onTime}</td>
                <td className="p-3 border-b">{row.sold}</td>
                <td className="p-3 border-b">{row.avgPrice}</td>
                <td className="p-3 border-b">{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Notification Panel */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Alerts</h3>
        <ul className="space-y-3">
          <li className="bg-yellow-100 p-4 rounded-lg">
            🚨 <strong>Flight B</strong> has a delay of 45 minutes.
          </li>
          <li className="bg-red-100 p-4 rounded-lg">
            ❗ Pending refund requests for <strong>Flight D</strong>.
          </li>
        </ul>
      </section>
    </div>
  );
}
