import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AircraftSelector from './AircraftSelector';
import SeatAllocation from '../SeatAllocation'

const AddFlightForm = () => {
  const navigate = useNavigate();
  const [selectedClasses, setSelectedClasses] = useState({
    economy: false,
    business: false,
    first: false,
    premium: false,
  });
  const [selectedLayout, setSelectedLayout] = useState('');


  const handleTotalColumns=(e)=>
  {
    setTotalColumns(parseInt(e.target.value))
  }

  const [seatCount,setSeatCount]=useState(
    {
      'economy-seats':0,
      'business-seats':0,
      'first-seats':0,
      'premium-seats':0
    }
  )

  const [rowCount,setRowCount]=useState(
    {
      'economy-row-count':0,
      'business-row-count':0,
      'first-row-count':0,
      'premium-row-count':0
    }
  )


  const handleChangeRowCount=(e)=>
  {
    const {name,value}=e.target;
    console.log(name,value)
    setRowCount(prevRowCount=>({...prevRowCount,[name]:value}))
  }

const handleChangeSeatCount=(e)=>
{
  const {name,value}=e.target;
  console.log(name,value)

  setSeatCount((prevCount)=>(
    {
      ...seatCount,
      [name]:value
    }
  ))
}

const totalSeatCount=Object.values(seatCount).reduce((acc, cur) => acc + parseInt(cur), 0);


  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(name,checked)
    setSelectedClasses((prevClasses) => ({
      ...prevClasses,
      [name]: checked,
    }));
  };

  const handleViewFlights = () => {
    navigate('view-flights'); // Replace with your route
  };

  const seatLayouts = [
    { label: '2+4+2', value: 'AC+DEFG+HJ' },
    { label: '3+3+3', value: 'ABC+DEF+GHI' },
    { label: '2+2+2', value: 'AB+CD+EF' },
    {label:'3+3',value:'ABC+DEF'}
    // Add more layouts as needed
  ];

  const TotalColumns=selectedLayout.split('+').reduce((acc,row)=>acc+row.length,0)

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="p-3 w-full">
        <div className="flex justify-between items-center px-12">
          <h2 className="text-3xl font-bold text-gray-800">Add New Flight</h2>
          <button
            onClick={handleViewFlights}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded flex items-center gap-2"
          >
            <i className="fa-solid fa-plane-departure"></i>
            <span className="text-lg">View Flights</span>
          </button> 
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Airline Selection */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="airline"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Select Airline:
              </label>
              <select
                id="airline"
                name="airline"
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Airline</option>
                <option value="AirIndia">Air India</option>
                <option value="AirFrance">Air France</option>
                <option value="Indigo">Indigo</option>
                <option value="Lufthansa">Lufthansa</option>
                <option value="MalaysiaAirlines">Malaysia Airlines</option>
                <option value="SpiceJet">SpiceJet</option>
                <option value="Vistara">Vistara</option>
                <option value="QatarAirways">Qatar Airways</option>
              </select>
            </div>

            {/* Flight Number */}
            <div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Enter Flight Number:
              </label>
              <input
                type="text"
                id="flight-number"
                name="flight-number"
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Aircraft Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <AircraftSelector />
            </div>

            {/* Flight Classes */}
            <div className="p-4 rounded-lg shadow-sm space-y-6 text-lg">
              <label
                htmlFor="flight-has"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Flight Has:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="economy"
                    value="economy"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={handleCheckboxChange}
                    checked={selectedClasses.economy}
                  />
                  <span className="text-gray-700">Economy</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="business"
                    value="business"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={handleCheckboxChange}
                    checked={selectedClasses.business}
                  />
                  <span className="text-gray-700">Business</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="first"
                    value="first"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={handleCheckboxChange}
                    checked={selectedClasses.first}

                  />
                  <span className="text-gray-700">First</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="premium"
                    value="premium"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={handleCheckboxChange}
                    checked={selectedClasses.premium}
                  />
                  <span className="text-gray-700">Premium Economy</span>
                </label>
              </div>  
            </div>


            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="seat-layout"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Seat Layout:
              </label>
              <select
                id="seat-layout"
                name="seat-layout"
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value)}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Layout</option>
                {seatLayouts.map((layout) => (
                  <option key={layout.value} value={layout.value}>
                    {layout.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedClasses.economy &&
            (<div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="economy-row-count"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Total Rows for Economy Class:
              </label>
              <input
                type="number"
                id="economy-row-count"
                name="economy-row-count"
                value={rowCount['economy-row-count']}
                onChange={handleChangeRowCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}

            {selectedClasses.business &&
            (<div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="business-row-count"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Total Rows for Business Class:
              </label>
              <input
                type="number"
                id="business-row-count"
                name="business-row-count"
                value={rowCount['business-row-count']}
                onChange={handleChangeRowCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}

            {selectedClasses.first &&
            (<div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="first-row-count"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Total Rows for First Class:
              </label>
              <input
                type="number"
                id="first-row-count"
                name="first-row-count"
                value={rowCount['first-row-count']}
                onChange={handleChangeRowCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}


            {selectedClasses.premium &&
            (<div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="premium-row-count"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Total Rows for Premium Class:
              </label>
              <input
                type="number"
                id="premium-row-count"
                name="premium-row-count"
                value={rowCount['premium-row-count']}
                onChange={handleChangeRowCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}


            {/* Economy Class Seats */}
            {selectedClasses.economy &&
            (<div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="economy-seats"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
                Economy Class Seats:
              </label>
              <input
                type="number"
                id="economy-seats"
                name="economy-seats"
                value={TotalColumns*rowCount['economy-row-count']}
                onChange={handleChangeSeatCount}
                disabled
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}

            {/* Business Class Seats */}
            {selectedClasses.business &&
            (<div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="business-seats"
                className="block text-lg font-semibold text-gray-700 mb-1"
              >
              Business Class Seats:
              </label>
              <input
                type="number"
                id="business-seats"
                name="business-seats"
                disabled
                value={TotalColumns*rowCount['business-row-count']}
                onChange={handleChangeSeatCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}

            {/* First Class Seats */}
            {selectedClasses.first &&
            (<div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="first-class-seats"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
              First Class Seats:
              </label>
              <input
                type="number"
                id="first-class-seats"
                name="first-seats"
                disabled
                value={TotalColumns*rowCount['first-row-count']}
                onChange={handleChangeSeatCount}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}

            {/* Premium Economy Class Seats */}
            {selectedClasses.premium &&
            (<div className=" p-4 rounded-lg shadow-sm">
              <label
                htmlFor="premium-seats"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
              Premium Economy Class Seats:
              </label>
              <input
                type="number"
                id="premium-seats"
                name="premium-seats"
                value={seatCount['premium-seats']}
                onChange={handleChangeSeatCount}
                disabled
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>)}


            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="total-seats"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
              Total Columns in the Flight:
              </label>
              <input
                type="number"
                id="total-seats"
                name="total-seats"
                value={TotalColumns}
                disabled
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Total Seats */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label
                htmlFor="total-seats"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Total Number of Seats:
              </label>
              <input
                type="number"
                id="total-seats"
                name="total-seats"
                value={totalSeatCount}
                disabled={true}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className='col-span-2'>
              <SeatAllocation layout={selectedLayout} TotalColumns={TotalColumns} RowCount={rowCount}/>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6 col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="reset"
                className="bg-red-600 text-white py-3 px-8 rounded hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFlightForm;
