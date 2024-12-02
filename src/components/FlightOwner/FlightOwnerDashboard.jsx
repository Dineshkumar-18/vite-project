import React, { useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import FlightRevenueGraph from "./FlightRevenueGraph.jsx";
import { AiOutlineBarChart } from "react-icons/ai";
import { useFlightOwner } from "./FlightOwnerContext.jsx";
import { HiOutlineChartBar } from "react-icons/hi";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function FlightOwnerDashboard() {

    const { flightOwner } = useFlightOwner()

    const [timeRange, setTimeRange] = useState('today'); // 'today', 'thisWeek', 'thisYear'
   
    const LifeTimeOverview=[
        { title: 'Total Flights',total:50, color: 'bg-blue-500', icon: '✈️' },
        { title: 'Domestic Flights',total:10,color: 'bg-green-500', icon: '🏠' },
        { title: 'International Flights',total:10,color: 'bg-orange-500', icon: '🌍' },
        { title: 'Total Revenue', today: '$1,020,400', total: '$500,000,000', color: 'bg-purple-500', icon: '💰' },
    ]


    const dashboardData = [
        { title: 'Bookings', today: 50, thisWeek: 342, thisMonth: 1400, thisYear: 4400, total: 20000, color: 'bg-pink-500', icon: '📈' },
        { title: 'Cancelled Flights', today: 1, thisWeek: 5, thisMonth: 18, thisYear: 60, total: 300, color: 'bg-red-300', icon: '❌' },
        { title: 'Completed Flights', today: 15, thisWeek: 80, thisMonth: 300, thisYear: 960, total: 4000, color: 'bg-yellow-500', icon: '✔️' },
        { title: 'Upcoming Flights', today: 4, thisWeek: 20, thisMonth: 80, thisYear: 250, total: 1200, color: 'bg-orange-500', icon: '⏳' },
        { title: 'Total Passengers', today: 1200, thisWeek: 8000, thisMonth: 32000, thisYear: 96000, total: 400000, color: 'bg-teal-500', icon: '👥' },
        { title: 'Flight Revenue', today: '$25,000', thisWeek: '$150,000', thisMonth: '$600,000', thisYear: '$1,800,000', total: '$8,000,000', color: 'bg-blue-700', icon: '💵' },
        { title: 'Top Flights by Revenue', today: 'Flight 101, 202, 303', thisWeek: 'Flight 601, 702', thisMonth: 'Flight 1201, 1302', thisYear: 'Flight 2001, 2202', total: 'Flight 10001, 12001', color: 'bg-purple-700', icon: '🔥' },
        { title: 'Flight Trends', today: 'Most Flights Today', thisWeek: 'Most Flights on Monday', thisMonth: 'Most Flights in Week 2', thisYear: 'Most Flights in Summer', total: 'Most Flights in 2022', color: 'bg-green-700', icon: '📊' }
      ];

      const handleTimeRangeChange = (range) => {
        setTimeRange(range);
      };

      // Function to determine the appropriate title suffix based on time range
  const getTimeRangeTitle = () => {
    switch (timeRange) {
      case 'today':
        return 'Today';
      case 'thisWeek':
        return 'This Week';
      case 'thisMonth':
        return 'This Month';
      case 'thisYear':
        return 'This Year';
      case 'total':
        return 'Total';
      default:
        return '';
    }
  };


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




      {/* Dropdown for time range selection */}
      <div className="mb-4 flex items-center justify-between">
      
        <label className="text-2xl font-semibold text-customColor flex items-center gap-2"><AiOutlineBarChart size={40} color="blue" />{getTimeRangeTitle()} Flight Insights</label>
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
      </div>


       {/* Metrics Section */}
       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.map((item, index) => {
          // For Total Flights and Total Revenue, we always display their values
          if (item.title === 'Total Flights' || item.title === 'Total Revenue') {
            return (
              <div
                key={index}
                className={`${item.color} text-white p-4 rounded-lg shadow-lg flex items-center`}
              >
                <div className="text-4xl mr-4">{item.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-lg">
                {timeRange === 'today'
                  ? item.today
                  : timeRange === 'thisWeek'
                  ? item.thisWeek
                  : timeRange === 'thisMonth'
                  ? item.thisMonth
                  : timeRange === 'thisYear'
                  ? item.thisYear
                  : item.total}
              </p>
                </div>
              </div>
            );
          }

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
                {timeRange === 'today'
                  ? item.today
                  : timeRange === 'thisWeek'
                  ? item.thisWeek
                  : timeRange === 'thisMonth'
                  ? item.thisMonth
                  : timeRange === 'thisYear'
                  ? item.thisYear
                  : item.total}
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
