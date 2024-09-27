import React from 'react'
import NavBar from '../components/NavBar'
import SearchFlights from '../components/SearchFlights'
import FilterSidebar from '../components/FilterSidebar';
import ScrollableDateRange from '../components/ScrollableDateRange';
import FlightTable from '../components/FlightTable';

const Home = () => {

  const dates = [
    { date: '2024-09-21', price: '$300' },
    { date: '2024-09-22', price: '$320' },
    { date: '2024-09-23', price: '$310' },
    { date: '2024-09-21', price: '$300' },
    { date: '2024-09-22', price: '$320' },
    { date: '2024-09-23', price: '$310' },
    { date: '2024-09-21', price: '$300' },
    { date: '2024-09-22', price: '$320' },
    { date: '2024-09-23', price: '$310' },
    // Add more dates and prices as needed
  ];


  const flightData = [
    {
      airlines: "Airline A",
      departure: "2024-09-25 08:00 AM",
      duration: "3h 15m",
      arrival: "2024-09-25 11:15 AM",
      price: "$250.00",
    },
    {
      airlines: "Airline B",
      departure: "2024-09-25 10:00 AM",
      duration: "2h 45m",
      arrival: "2024-09-25 12:45 PM",
      price: "$200.00",
    },
    {
      airlines: "Airline C",
      departure: "2024-09-25 01:00 PM",
      duration: "4h 30m",
      arrival: "2024-09-25 05:30 PM",
      price: "$300.00",
    },
    {
      airlines: "Airline D",
      departure: "2024-09-25 03:00 PM",
      duration: "2h 10m",
      arrival: "2024-09-25 05:10 PM",
      price: "$180.00",
    },
    {
      airlines: "Airline E",
      departure: "2024-09-25 05:00 PM",
      duration: "3h 50m",
      arrival: "2024-09-25 08:50 PM",
      price: "$275.00",
    },
  ];
  return (
    <div className='bg-customColor min-h-screen'>
      <div className='container mx-auto px-2'>
         <NavBar/>
          <SearchFlights />
  
      </div>
      </div>
  )
}

export default Home
