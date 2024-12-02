import React, { useEffect, useState, useMemo } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaPlane, FaSearch, FaTimes } from 'react-icons/fa'; 
import axiosInstance from '../../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const AirlineFlights = ({ airline }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedBy, setSortedBy] = useState('flightNumber');
  const [sortedOrder, setSortedOrder] = useState('asc');
  const navigate=useNavigate()
  const { id } = useParams();

  const FlightType = {
    1: 'Domestic',
    2: 'International',
  };

  useEffect(() => {
      const fetchFlightDetails = async () => {
      const response = await axiosInstance.get(`/Flight/flightsByAirline/${id}`);
      const flightsData = response.data;

      const promises = flightsData.map(async (flight) => {
        const departAirportResponse = await axiosInstance.get(`/Airports/${flight.departureAirportId}`);
        const arrivalAirportResponse = await axiosInstance.get(`/Airports/${flight.arrivalAirportId}`);

        return {
          ...flight,
          departAirport: departAirportResponse.data,
          arrivalAirport: arrivalAirportResponse.data,
        };
      });

      const flightsWithAirports = await Promise.all(promises);
      setFlights(flightsWithAirports);
      setLoading(false);
    };

    fetchFlightDetails();
  }, [id]);

  // Sorting logic
  const sortFlights = (flightsToSort) => {
    return [...flightsToSort].sort((a, b) => {
      let aValue = a[sortedBy];
      let bValue = b[sortedBy];

      if (sortedBy === 'departAirport') {
        aValue = a.departAirport.airportName;
        bValue = b.departAirport.airportName;
      } else if (sortedBy === 'arrivalAirport') {
        aValue = a.arrivalAirport.airportName;
        bValue = b.arrivalAirport.airportName;
      } else if (sortedBy === 'flightType') {
        aValue = FlightType[a.flightType];
        bValue = FlightType[b.flightType];
      } else if (sortedBy === 'departIataCode') {
        aValue = a.departAirport.iataCode;
        bValue = b.departAirport.iataCode;
      } else if (sortedBy === 'arrivalIataCode') {
        aValue = a.arrivalAirport.iataCode;
        bValue = b.arrivalAirport.iataCode;
      }

      if (sortedOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };
  const sortedFlightsMemo = useMemo(() => {
    const isSearching = searchQuery.trim() !== '';
    const flightsToSort = isSearching ? filteredFlights : flights;
    return sortFlights(flightsToSort);
  }, [flights, filteredFlights, sortedBy, sortedOrder, searchQuery]);

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setFilteredFlights([]);
    } else {
      const lowercasedValue = value.toLowerCase();
      const filtered = flights.filter((flight) =>
        flight.flightNumber.toLowerCase().includes(lowercasedValue) ||
        flight.departAirport.airportName.toLowerCase().includes(lowercasedValue) ||
        flight.arrivalAirport.airportName.toLowerCase().includes(lowercasedValue) ||
        FlightType[flight.flightType].toLowerCase().includes(lowercasedValue) ||
        flight.departAirport.iataCode.toLowerCase().includes(lowercasedValue) ||
        flight.arrivalAirport.iataCode.toLowerCase().includes(lowercasedValue)
      );
      setFilteredFlights(filtered);
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredFlights([]);
  };

  // Handle sorting when a column header is clicked
  const handleSort = (column) => {
    if (sortedBy === column) {
      setSortedOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortedBy(column);
      setSortedOrder('asc');
    }
  };


  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold rounded-lg mb-4 bg-blue-500 p-2 text-white">Flights Operated by {airline.airlineName}</h2>
      <div className="flex flex-col md:flex-row items-center mb-6 space-y-4 md:space-y-0 md:space-x-4 relative">
        <input
          type="search" 
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Flight Number, Departure, or Arrival"
          className="w-full md:w-1/3 px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
         <FaSearch className="absolute top-3 left-0 text-gray-400" />
          {searchQuery && (
            <FaTimes 
              className="absolute top-3 right-3 text-gray-400 cursor-pointer hover:text-red-500"
              onClick={clearSearch}
            />
          )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-auto border-collapse ">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700"onClick={() =>handleSort('flightNumber')}>Flight No.{sortedBy === 'flightNumber' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}</th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700" onClick={() =>handleSort('departAirport')}>Departure Airport
              {sortedBy === 'departAirport' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700" onClick={()=>handleSort('departIataCode')}>Departure Iata Code
              {sortedBy === 'departIataCode' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700" onClick={()=>handleSort('arrivalAirport')}>Arrival Airport
              {sortedBy === 'arrivalAirport' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700" onClick={()=>handleSort('arrivalIataCode')}>Arrival Iata Code
              {sortedBy === 'arrivalIataCode' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700" onClick={()=>handleSort('flightType')}>Flight Type
              {sortedBy === 'flightType' && (
                  <span className="inline-block ml-3">
                    {sortedOrder === 'asc' ? <i class="fa-solid fa-arrow-up"></i> : <i class="fa-solid fa-arrow-down"></i>}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-lg font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
           {sortedFlightsMemo.length > 0 ? (
              sortedFlightsMemo.map((flight, index) => (
              <tr key={flight.flightId} className="border-b hover:bg-gray-200">
                <td className="px-4 py-2 text-lg text-gray-700">{flight.flightNumber}</td>
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaPlaneDeparture className="text-blue-500" />
                    <span>{flight.departAirport.airportName}-{flight.departAirport.city}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>{flight.departAirport.iataCode}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    <FaPlaneArrival className="text-blue-500" />
                    <span>{flight.arrivalAirport.airportName} - {flight.arrivalAirport.city}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>{flight.arrivalAirport.iataCode}</span>
                  </div>
                </td>
                
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    {
                      flight.flightType === 1 ?  <div className='flex items-center gap-2'><FaPlane className="text-blue-500"/> <span className='text-black'>Domestic</span> </div>
                      
                      : <div className='flex items-center gap-2'><FaPlane className="text-red-500"/> <span className='text-black'>International</span> </div>
                    }
                  </div>
                </td>
                <td className="px-4 py-2 text-lg text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className='bg-green-500 px-3 text-white rounded-lg'>{"Active"}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-lg">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=>navigate(`/flight-owner/flight/${flight.flightId}`)}>
                    View Flight Details
                  </button>
                </td>
              </tr>
            ))):(<tr>
              <td colSpan="8" className="text-center py-4 text-lg font-semibold text-gray-500">
                No flights match your search criteria.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AirlineFlights;
