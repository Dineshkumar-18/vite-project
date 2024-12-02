import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeOnlyFirstLetter } from "../../capitalizeOnlyFirstLetter";

const FlightScheduleTable = () => {
    const [flightSchedules, setFlightSchedules] = useState([]);

    const {id}=useParams()

    const navigate = useNavigate();

    useEffect(() => {
        
        const getFlightScheduleDetails=async()=>
        {
          const response=await axiosInstance.get(`/FlightSchedule/fs-info/${id}`);
          setFlightSchedules(response.data)
          console.log(response.data)
        }
        
        getFlightScheduleDetails();
    }, []);


    const getStatusColor = (status) => {
        switch (status) {
          case "SCHEDULING_PROCESS":
            return "bg-gray-500"; // Gray for scheduling process
          case "SCHEDULED":
            return "bg-green-600"; // Blue for scheduled
          case "ONTIME":
            return "bg-green-500"; // Green for on time
          case "DELAYED":
            return "bg-yellow-500"; // Yellow for delayed
          case "BOARDING":
            return "bg-indigo-500"; // Indigo for boarding
          case "GATE_CLOSED":
            return "bg-red-500"; // Red for gate closed
          case "DEPARTED":
            return "bg-blue-700"; // Darker blue for departed
          case "IN_AIR":
            return "bg-sky-500"; // Sky blue for in air
          case "LANDED":
            return "bg-green-600"; // Dark green for landed
          case "ARRIVED":
            return "bg-teal-500"; // Teal for arrived
          case "CANCELLED":
            return "bg-red-700"; // Dark red for cancelled
          case "DIVERTED":
            return "bg-orange-500"; // Orange for diverted
          default:
            return "bg-gray-500"; // Default gray color for unknown statuses
        }
      };


    const handleRowClick = (flightScheduleId,schedule) => {
        navigate(`/flight-owner/flightschedule/${flightScheduleId}`, {
            state: { flightSchedule: schedule }
          });
    };
      

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Flight Schedules</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-blue-500 text-white">Flight Number</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Departure Airport</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Arrival Airport</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Departure Time</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Arrival Time</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Duration</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Seats</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Available Seats</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Status</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Scheduled At</th>
                            <th className="py-2 px-4 bg-blue-500 text-white">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flightSchedules.map((schedule, index) => (
                            <tr key={schedule.flightScheduleId} className="border-t hover:bg-blue-300/30 cursor-pointer" onClick={()=>handleRowClick(schedule.flightScheduleId,schedule)}>
                                <td className="py-2 px-4 text-center">{schedule.flightNumber}</td>
                                <td className="py-2 px-4">
                                <span className="font-bold text-red-600">{schedule.departureAirportIataCode}</span>
                                {" - "}
                                <span className="font-semibold">{schedule.departureAirport}</span>
                                {" - "}
                                <span className="text-gray-600">{schedule.departureCity}</span>
                                </td>
                                <td className="py-2 px-4">
                                <span className="font-bold text-red-600">{schedule.arrivalAirportIataCode}</span>
                                {" - "}
                                <span className="font-semibold">{schedule.arrivalAirport}</span>
                                {" - "}
                                <span className="text-gray-600">{schedule.arrivalCity}</span>
                                </td>
                                <td className="py-2 px-4 text-center">{new Date(schedule.departureDateTime).toLocaleString()}</td>
                                <td className="py-2 px-4 text-center">{new Date(schedule.arrivalDateTime).toLocaleString()}</td>
                                <td className="py-2 px-4 text-center">{schedule.duration}</td>
                                <td className="py-2 px-4 text-center">{schedule.totalSeatsCount}</td>
                                <td className="py-2 px-4 text-center">{schedule.availableSeatsCount}</td>
                                <td className={`py-2 px-4 text-center font-bold text-white`}>
                                <span
                className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(schedule.flightStatus)}`}
              >
                {schedule.flightStatus}
              </span>
                                </td>
                                <td className="py-2 px-4 text-center">{new Date(schedule.scheduledAt).toLocaleString()}</td>
                                <td className="py-2 px-4 text-center">{schedule.UpdatedAt ? new Date(schedule.updatedAt).toLocaleString() : "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlightScheduleTable;
