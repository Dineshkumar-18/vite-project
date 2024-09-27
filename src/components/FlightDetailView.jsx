import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const FlightDetailView = ({flightDetails,formatDate,formatDuration}) => {

  const {Class}=useContext(AppContext)
  return (
    <div className="bg-gray-50 p-4 mt-4 rounded-t-md border-2 border-blue-500">
          <div className="flex items-center gap-4  mb-4">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-md">{flightDetails.departureCity}</h1>
              <i class="fa-solid fa-arrow-right"></i>
              <h1 className="font-bold text-md">{flightDetails.arrivalCity}</h1>
            </div>
            <div>
              <h1 className="text-sm text-gray-500">{formatDate(flightDetails.departureDate)}</h1>
            </div>
          </div>

          {/* Detailed Table View */}
          <div className="grid grid-cols-5 gap-4 mb-2 flex items-center">
            <div className="flex flex-col">
                <img
                src="" // Image source for Indigo logo
                alt="Indigo"
                className="w-8 h-8 mb-2"
                />
                <h2 className="text-sm font-medium text-gray-800">{flightDetails.airlineName}</h2>
            </div>
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-gray-800">{flightDetails.departureAirportIataCode}</h1>
                <span className="text-gray-500">{flightDetails.departureTime.substring(0,5)}</span>
                <h2 className="text-sm text-gray-500">{formatDate(flightDetails.departureDate)}</h2>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
            
                <i className="fas fa-clock text-gray-500"></i>
                <h2 className="text-sm text-gray-500">{formatDuration(flightDetails.duration)}</h2>

            </div>
            <div className="flex flex-col items-center justify-center">
                <h1 className="font-semibold text-gray-800">{flightDetails.arrivalAirportIataCode}</h1>
                <span className="text-gray-500">{flightDetails.arrivalTime.substring(0,5)}</span>
                <h2 className="text-sm text-gray-500">{formatDate(flightDetails.arrivalDate)}</h2>
            </div>
        </div>


        <div className="grid grid-cols-5 gap-4">
            {/* Flight number and class info */}
            <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-gray-800">Flight: {flightDetails.flightNumber}</h1>
                <h2 className="text-sm text-gray-500">Class: {Class}</h2>
            </div>

            {/* Departure Airport Info */}
            <div className="flex flex-col items-center">
                <h1 className="text-sm font-semibold text-gray-800 text-center">{flightDetails.departureAirport}</h1>
                <h1 className="text-sm text-gray-500">Departure: {flightDetails.departureCity}</h1>
            </div>

            {/* Empty Middle Column (for maintaining spacing) */}
            <div className="flex"></div>

            {/* Arrival Airport Info */}
            <div className="flex flex-col items-center">
                <h1 className="text-sm font-semibold text-gray-800">{flightDetails.arrivalAirport}</h1>
                <h1 className="text-sm text-gray-500">Arrival: {flightDetails.arrivalCity}</h1>
            </div>
            </div>
        </div>
  )
}

export default FlightDetailView
