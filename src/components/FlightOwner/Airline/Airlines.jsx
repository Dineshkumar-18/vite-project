import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import AirlineDetails from './AirlineDetails';
import RevenueChart from './RevenueChart';
import AirlineFlights from './AirlineFlights';

const Airlines = () => {
  const navigate = useNavigate();
  const [airlines, setAirlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedBy, setSortedBy] = useState('airlineName');
  const [sortedOrder, setSortedOrder] = useState('asc');

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await axiosInstance.get('/Airlines/airlinesByflightowner');
        console.log(response.data)
        setAirlines(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAirlines();
  }, []);


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column) => {
    if (sortedBy === column) {
      setSortedOrder(sortedOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedBy(column);
      setSortedOrder('asc');
    }
  };

  // Sorting logic: sort a copy of the filtered airlines, do not mutate the original state
  const sortedAirlines = [...airlines].filter((airline) => {
    return (
      airline.airlineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airline.iataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airline.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).sort((a, b) => {
    if (sortedBy === 'airlineName') {
      return sortedOrder === 'asc'
        ? a.airlineName.localeCompare(b.airlineName)
        : b.airlineName.localeCompare(a.airlineName);
    } else if (sortedBy === 'iataCode') {
      return sortedOrder === 'asc'
        ? a.iataCode.localeCompare(b.iataCode)
        : b.iataCode.localeCompare(a.iataCode);
    } else if (sortedBy === 'country') {
      return sortedOrder === 'asc'
        ? a.country.localeCompare(b.country)
        : b.country.localeCompare(a.country);
    }
  });

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Airline Management Dashboard</h2>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by airline name, IATA code, or country"
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => navigate('/flight-owner/add-airline')}
          className=" bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          Add New Airline
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-gray-600 cursor-pointer" onClick={() => handleSort('airlineName')}>
                Airline Name
                {sortedBy === 'airlineName' && (
                  <span className="inline-block ml-1">
                    {sortedOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th className="p-4 text-gray-600 cursor-pointer" onClick={() => handleSort('iataCode')}>
                IATA Code
                {sortedBy === 'iataCode' && (
                  <span className="inline-block ml-1">
                    {sortedOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th className="p-4 text-gray-600 cursor-pointer" onClick={() => handleSort('country')}>
                Country
                {sortedBy === 'country' && (
                  <span className="inline-block ml-1">
                    {sortedOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th className="p-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAirlines.length > 0 ? (
              sortedAirlines.map((airline, index) => (
                <tr
                  key={airline.id} // Use a unique key for each row
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="p-4 text-gray-800">{airline.airlineName}</td>
                  <td className="p-4 text-gray-800">{airline.iataCode}</td>
                  <td className="p-4 text-gray-800">{airline.country}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => navigate(`/flight-owner/view-airline/${airline.airlineId}`)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/flight-owner/edit-airline/${airline.airlineId}`)}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // Implement delete airline logic
                      }}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No airlines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Airlines;
