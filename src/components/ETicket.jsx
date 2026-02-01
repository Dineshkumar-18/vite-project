/* eslint-disable react/prop-types */
import Barcode from "react-barcode"
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";


const ETicket = ({ticketInfo}) => {

  const {
    ticketId,
    passengerName,
    airlineName,
    flightNumber,
    className,
    seatNumber,
    from,
    to,
    departureAirport,
    arrivalAirport,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime,
    ticketPrice,
    isCancelled
  } = ticketInfo;
  

  console.log("Ticket Id: ",ticketId)


  const adjustTime = (timeString, hoursToSubtract) => {
    // Parse the time string into a Date object
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
  
    // Subtract the hours
    date.setHours(date.getHours() - hoursToSubtract);
  
    // Format the time back to HH:MM
    const adjustedHours = String(date.getHours()).padStart(2, '0');
    const adjustedMinutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${adjustedHours}:${adjustedMinutes}`;
  };

  const boardingTime = adjustTime(departureTime, 2);
  const ticketUrl = `https://yourdomain.com/verify-ticket/${ticketId}`;
  return (
  <div className="min-w-full bg-white border border-blue-400 rounded-3xl shadow-lg overflow-hidden ticket relative"  id="" data-ticket-id={ticketId}>
 
    {isCancelled && (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <div className="text-red-500 font-extrabold uppercase px-6 py-2 tracking-widest text-8xl border-4 border-red-500 bg-opacity-30 opacity-20 transform -rotate-12 select-none">
        Cancelled
      </div>
    </div>
  )}


  <div className="bg-blue-500 p-4 flex justify-between items-center z-10">
    <div className="flex w-4/6 justify-between items-center">
     <div className="flex gap-5 justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="40px" height="40px" viewBox="0 0 58.568 58.568">
      <path id="flight_plane" data-name="flight plane" d="M1023.994,672.006c2.4-3.218,3.843-6.559,3.85-8.946a3.323,3.323,0,0,0-.453-1.828,1.706,1.706,0,0,0-.578-.584,3.265,3.265,0,0,0-1.852-.466c-2.381,0-5.723,1.442-8.942,3.849a77.166,77.166,0,0,0-8.806,8.487q-.917.966-1.934,2.031l-6.976-2.091.02-.02a1.566,1.566,0,0,0-.005-2.2l-1.259-1.261a1.571,1.571,0,0,0-1.11-.461,1.541,1.541,0,0,0-1.1.458l-1.885,1.886-1-.3a1.563,1.563,0,0,0-.125-2.063l-1.266-1.265a1.568,1.568,0,0,0-1.109-.457,1.534,1.534,0,0,0-1.1.458l-1.73,1.73-7.094-2.125a1.775,1.775,0,0,0-.507-.072,1.875,1.875,0,0,0-1.311.531l-2.494,2.494a1.463,1.463,0,0,0-.439,1.029,1.433,1.433,0,0,0,.761,1.284l14.918,8.334a2.607,2.607,0,0,1,.362.275l4.253,4.252c-3.978,4.191-7.522,8.25-10.284,11.781-.258.328-.5.649-.742.965l-11.541-1.048a1.573,1.573,0,0,0-.2-.012,2.127,2.127,0,0,0-1.429.591l-1.163,1.161a1.449,1.449,0,0,0-.446,1.029,1.418,1.418,0,0,0,.839,1.3l8.119,3.857a1.843,1.843,0,0,1,.311.223l.674.668a4.938,4.938,0,0,0-.325,1.561,2.053,2.053,0,0,0,.567,1.5l.029.026.008.005a2.056,2.056,0,0,0,1.493.56,4.964,4.964,0,0,0,1.548-.322l.684.682a1.956,1.956,0,0,1,.212.3l3.848,8.1a1.435,1.435,0,0,0,1.294.851h.008a1.446,1.446,0,0,0,1.026-.432l1.192-1.2a2.132,2.132,0,0,0,.569-1.426c0-.066,0-.117-.005-.144l-1.051-11.581c.317-.238.636-.484.965-.739,3.536-2.766,7.6-6.313,11.779-10.286l4.256,4.26a2.314,2.314,0,0,1,.278.365l8.318,14.891a1.451,1.451,0,0,0,2.322.342l2.512-2.51a1.9,1.9,0,0,0,.514-1.31,1.769,1.769,0,0,0-.069-.491l-2.125-7.095,1.729-1.733a1.563,1.563,0,0,0,0-2.205l-1.268-1.267a1.559,1.559,0,0,0-2.062-.129l-.3-.995,1.887-1.886a1.577,1.577,0,0,0,.455-1.107,1.54,1.54,0,0,0-.455-1.1l-1.262-1.262a1.563,1.563,0,0,0-2.217,0l-.013.012-2.089-6.976q1.082-1.032,2.062-1.96C1019.32,677.193,1022.053,674.6,1023.994,672.006Z" transform="translate(-969.276 -660.182)"/>
      </svg>
      <div className="text-white font-bold text-3xl">Aero<span className="font-bold text-3xl text-yellow-500">Flex</span></div>
   </div>
     <h2 className="text-3xl font-bold text-white">E-Ticket</h2>  
     <div className="text-white font-bold text-3xl mr-8">{airlineName}</div>
    </div>
    <div className="text-white w-2/6 flex justify-between items-center">
       <div className="flex gap-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="40px" height="40px" viewBox="0 0 58.568 58.568">
      <path id="flight_plane" data-name="flight plane" d="M1023.994,672.006c2.4-3.218,3.843-6.559,3.85-8.946a3.323,3.323,0,0,0-.453-1.828,1.706,1.706,0,0,0-.578-.584,3.265,3.265,0,0,0-1.852-.466c-2.381,0-5.723,1.442-8.942,3.849a77.166,77.166,0,0,0-8.806,8.487q-.917.966-1.934,2.031l-6.976-2.091.02-.02a1.566,1.566,0,0,0-.005-2.2l-1.259-1.261a1.571,1.571,0,0,0-1.11-.461,1.541,1.541,0,0,0-1.1.458l-1.885,1.886-1-.3a1.563,1.563,0,0,0-.125-2.063l-1.266-1.265a1.568,1.568,0,0,0-1.109-.457,1.534,1.534,0,0,0-1.1.458l-1.73,1.73-7.094-2.125a1.775,1.775,0,0,0-.507-.072,1.875,1.875,0,0,0-1.311.531l-2.494,2.494a1.463,1.463,0,0,0-.439,1.029,1.433,1.433,0,0,0,.761,1.284l14.918,8.334a2.607,2.607,0,0,1,.362.275l4.253,4.252c-3.978,4.191-7.522,8.25-10.284,11.781-.258.328-.5.649-.742.965l-11.541-1.048a1.573,1.573,0,0,0-.2-.012,2.127,2.127,0,0,0-1.429.591l-1.163,1.161a1.449,1.449,0,0,0-.446,1.029,1.418,1.418,0,0,0,.839,1.3l8.119,3.857a1.843,1.843,0,0,1,.311.223l.674.668a4.938,4.938,0,0,0-.325,1.561,2.053,2.053,0,0,0,.567,1.5l.029.026.008.005a2.056,2.056,0,0,0,1.493.56,4.964,4.964,0,0,0,1.548-.322l.684.682a1.956,1.956,0,0,1,.212.3l3.848,8.1a1.435,1.435,0,0,0,1.294.851h.008a1.446,1.446,0,0,0,1.026-.432l1.192-1.2a2.132,2.132,0,0,0,.569-1.426c0-.066,0-.117-.005-.144l-1.051-11.581c.317-.238.636-.484.965-.739,3.536-2.766,7.6-6.313,11.779-10.286l4.256,4.26a2.314,2.314,0,0,1,.278.365l8.318,14.891a1.451,1.451,0,0,0,2.322.342l2.512-2.51a1.9,1.9,0,0,0,.514-1.31,1.769,1.769,0,0,0-.069-.491l-2.125-7.095,1.729-1.733a1.563,1.563,0,0,0,0-2.205l-1.268-1.267a1.559,1.559,0,0,0-2.062-.129l-.3-.995,1.887-1.886a1.577,1.577,0,0,0,.455-1.107,1.54,1.54,0,0,0-.455-1.1l-1.262-1.262a1.563,1.563,0,0,0-2.217,0l-.013.012-2.089-6.976q1.082-1.032,2.062-1.96C1019.32,677.193,1022.053,674.6,1023.994,672.006Z" transform="translate(-969.276 -660.182)"/>
      </svg>

      <div className="text-white font-bold text-2xl md:text-xl">Aero<span className="font-bold text-2xl md:text-xl text-yellow-500">Flex</span></div>
   </div>      
    <h2 className="text-2xl md:text-xl font-bold">E-Ticket</h2>
    <div className="text-white font-bold text-2xl md:text-xl mr-8">{airlineName}</div>  
    </div>
  </div>  

  {/* <!-- Main Content --> */}
  <div className="grid grid-cols-6 divide-blue-400">
    {/* <!-- Left Side - Passenger Info --> */}
    <div className="px-6 py-3 col-span-4 flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
  {/* Left Side: Passenger Name and Flight No */}
    <div className="flex flex-col">
      <div className="text-2xl font-semibold">Name of the passenger:</div>
    <div className="text-2xl font-bold uppercase">{passengerName}</div>

  </div>
  <h2 className="text-2xl font-semibold">
      Flight No: <span className="font-bold">{flightNumber}</span>
    </h2>
  {/* Right Side: Class */}
  <div className="text-3xl font-bold px-2 py-1 uppercase">{className}</div>
</div>
      <div className="bg-white p-4 rounded-xl w-full">
  {/* Route Info with Proper Arrow */}
  <div className="relative flex flex-col md:flex-row items-center justify-between mb-6 mt-2">
    {/* Departure */}
    <div className="text-left md:text-left mb-4 md:mb-0">
      <div className="flex items-center space-x-2">
        <FaPlaneDeparture className="text-blue-600 text-xl" />
        <span className="text-xl font-semibold">
          {from}
        </span>
      </div>
      <div className="text-lg font-medium text-gray-700 mt-1">
        {departureAirport}
      </div>
      <div className="text-xl font-medium text-gray-700 mt-1">
        {departureDate} • {departureTime}
      </div>
    </div>

    {/* Arrow Line */}
    <div className="flex-grow mx-4 md:mx-6 relative flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 10" className="w-full h-4 text-blue-500">
        <line x1="0" y1="5" x2="190" y2="5" stroke="currentColor" strokeWidth="3" />
        <polygon points="190,0 200,5 190,10" fill="currentColor" />
      </svg>
    </div>

    {/* Arrival */}
    <div className="text-right md:text-right">
      <div className="flex items-center space-x-2 justify-end">
        <span className="text-xl font-semibold">
          {to}
        </span>
        <FaPlaneArrival className="text-green-600 text-xl" />
      </div>
      <div className="text-lg font-medium text-gray-700 mt-1">
        {arrivalAirport}
      </div>
      <div className="text-xl font-medium text-gray-700 mt-1">
        {arrivalDate} • {arrivalTime}
      </div>
    </div>
  </div>

  {/* Additional Flight Info - Optional */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div>
      <div className="text-xl font-semibold">Seat</div>
      <div className="text-xl font-bold text-blue-700">{seatNumber}</div>
    </div>
    <div>
      <div className="text-xl font-semibold">Class</div>
      <div className="text-xl font-bold text-blue-700">{className}</div>
    </div>
     <div>
      <div className="text-xl font-semibold">Travel Date</div>
      <div className="text-xl font-bold text-blue-700">{departureDate}</div>
    </div>
    <div>
      <div className="text-xl font-semibold">Boarding Time</div>
      <div className="text-xl font-bold text-blue-700">{boardingTime}</div>
    </div>

  </div>
</div>

      {/* <div className="flex justify-between">
            <div>
              <div className="text-2xl font-semibold">Seat:</div>
              <div className="text-3xl font-bold text-blue-500">{seatNumber}</div>
            </div>
      </div> */}
      <div className="flex justify-between">
        
        <Barcode value={ticketUrl} displayValue={false}
        width={1}  height={60}
        />
        <div>
        <div className="flex flex-col">
              <div className="text-2xl font-semibold">Total Price:</div>
              <div className="text-3xl font-bold mt-1"><span className="text-3xl">₹</span>{ticketPrice}</div>
        </div>
        </div>
      </div>
    </div>

  

    
    {/* <!-- Right Side - Flight Info --> */}
    <div className="p-2 col-span-2 flex justify-between">
      <div className="w-3/4 space-y-3">
       <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg font-semibold"> Name of Passenger:</div>
          <div className="text-2xl font-bold">{passengerName}</div>
        </div>
        <div className="text-2xl font-bold uppercase">{className}</div>
        </div>
        
        
        <div className="mt-1 text-lg font-semibold">Flight No.: <span className="font-semibold">{flightNumber}</span></div>
        <div className="mt-1 text-lg font-semibold">Travel Date: <span className="font-semibold">{departureDate}</span></div>
        {/* <div className="mt-2 text-lg font-semibold">From: <span className="font-semibold">{from}</span></div>
        <div className="mt-2 text-lg font-semibold">To: <span className="font-semibold">{to}</span></div> */}
   <div className="relative flex flex-col md:flex-row items-center justify-between mt-3">
    {/* Departure */}
    <div className="text-left md:text-left mb-4 md:mb-0">
      <div className="flex items-center space-x-2">
        <FaPlaneDeparture className="text-blue-600 text-2xl" />
        <span className="text-sm font-semibold">
        {from}
        </span>
      </div>
      <div className="text-xs font-medium text-gray-700 mt-1">
        {departureAirport}
      </div>
      <div className="text-sm font-medium text-gray-700 mt-1">
        {departureDate} • {departureTime}
      </div>
    </div>

    {/* Arrow Line */}
    <div className="flex-grow relative flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 10" className="w-full h-1 text-blue-500">
        <line x1="0" y1="5" x2="190" y2="5" stroke="currentColor" strokeWidth="3" />
        <polygon points="190,0 200,5 190,10" fill="currentColor" />
      </svg>
    </div>

    {/* Arrival */}
    <div className="text-right md:text-right">
      <div className="flex items-center space-x-2 justify-end">
        <span className="text-sm font-semibold">
          {to}
        </span>
        <FaPlaneArrival className="text-green-600 text-2xl" />
      </div>
      <div className="text-xs font-medium text-gray-700 mt-1">
        {arrivalAirport}
      </div>
      <div className="text-sm font-medium text-gray-700 mt-1">
        {arrivalDate} • {arrivalTime}
      </div>
    </div>
  </div>
        <div className="text-lg font-semibold">Seat: <span className="text-lg font-bold text-blue-600">{seatNumber}</span></div>
        <div className="text-lg font-semibold">Class: <span className="font-semibold">{className}</span></div>
        <div className="flex flex-1 justify-between">

        <div className="">
          <div className="text-lg font-semibold">Boarding Time:</div>
          <div className="text-lg font-bold">{boardingTime}</div>
        </div>
          <div className="flex flex-col">
              <div className="text-xl font-semibold">Total Price:</div>
              <div className="text-2xl font-bold"><span className="text-2xl">₹</span>{ticketPrice}</div>
        </div>
 

        </div>
      </div>
      <div className="w-1/4 lg:mt-5">
        <div className="transform rotate-90">
          <Barcode value={ticketUrl} displayValue={false}
            width={0.5}  height={60}/>
      </div>
    
    </div>
    </div>

     {/* Scissor Cut Line */}
    <div className="absolute top-0 bottom-0 left-[65.5%] flex flex-col items-center justify-center">
      {/* Vertical Dashed Line */}
      <div className="h-full border-l-2 border-dashed border-gray-400"></div>
      {/* Scissor Icon positioned at middle */}

    </div>

  </div>
</div>

  )
}

export default ETicket
