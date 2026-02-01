import React from "react";
import ETicket from "../components/ETicket";

const testTicket = {
  ticketId: "12345",
  passengerName: "John Doe",
  airlineName: "Air India",
  flightNumber: "AI202",
  className: "Economy",
  seatNumber: "12A",
  from: "DEL",
  to: "BOM",
  departureDate: "2025-10-15",
  departureTime: "14:30",
  arrivalDate: "2025-10-15",
  arrivalTime: "16:30",
  ticketPrice: 5000,
  isCancelled: true, // toggle to test cancelled overlay
  departureCity: "DELHI",
  arrivalCity: "BENGALURU",
  departureAirport: "INDIRAGANDHI INTERNATIONAL AIRPORT",
  arrivalAirport: "KEMBAGOWDA INTERNATIONAL AIRPORT"
};

export default function ETicketTestPage() {
  return (
    <div className="p-10">
      <ETicket ticketInfo={testTicket} />
    </div>
  );
}
