import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AircraftSelector from './AircraftSelector';
import SeatAllocation from '../SeatAllocation'
import axiosInstance from '../../utils/axiosInstance';
import AirportSelect from '../AirportSelect';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AddFlightForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id}=useParams()

  const [selectedClasses, setSelectedClasses] = useState({
    economy: false,
    business: false,
    first: false,
    premium: false,
  });
  const [selectedLayout, setSelectedLayout] = useState('');
  const [disabledSeats, setDisabledSeats] = useState(new Set());
  const [error,setError]=useState("")
  const [airlines,setAirlines]=useState([])
  const [fromLocation,setFromLocation]=useState(0)
  const [toLocation,setToLocation]=useState(0)
  const [showSuccess, setShowSuccess] = useState(false);
  const [flightId,setFlightId]=useState(0);

  const [TotalColumns, setTotalColumns] = useState(0);
  const [AirCraftType,setAirCraftType]=useState("")
  const [loading,setLoading]=useState(false)

  const handleLayoutChange = (e) => {
    const layout = e.target.value;
    console.log(layout)
    setSelectedLayout(layout);
  
    // Split the layout string by "+" and sum the length of each segment
    const totalColumns = layout.split('+').reduce((acc, col) => acc + col.length, 0);
    console.log(totalColumns)
    setTotalColumns(totalColumns); // Update the total columns
  };

  const seatTypePatterns = {
    'AC+DEFG+HJ': 'WA+AMMA+AW',  // 2+4+2 layout
    'ABC+DEF+GHI': 'WMA+AMA+AMW', // 3+3+3 layout
    'AB+CD+EF': 'WA+MM+AW',       // 2+2+2 layout
    'ABC+DEF': 'WMA+AMW'            // 3+3 layout
  };

  
  const [rowCount,setRowCount]=useState(
    {
      'economy-row-count':0,
      'business-row-count':0,
      'first-row-count':0,
      'premium-row-count':0
    }
  )

  const [seatCount,setSeatCount]=useState(
    {
      'economy-seats':TotalColumns*rowCount['economy-row-count'],
      'business-seats':TotalColumns*rowCount['business-row-count'],
      'first-seats':TotalColumns*rowCount['first-row-count'],
      'premium-seats':TotalColumns*rowCount['premium-row-count']
    }
  )

  useEffect(() => {
    setSeatCount({
      'economy-seats': TotalColumns * rowCount['economy-row-count'],
      'business-seats': TotalColumns * rowCount['business-row-count'],
      'first-seats': TotalColumns * rowCount['first-row-count'],
      'premium-seats': TotalColumns * rowCount['premium-row-count'],
    });
  }, [TotalColumns, rowCount]);

  const [flightData, setFlightData] = useState({
    airlineId:0,
    flightNumber: '',
    airCraftType: AirCraftType,
    flightType: 'Domestic',
    departAirport: fromLocation,
    arrivalAirport: toLocation,
    totalSeats: 0,
    totalSeatColumn: TotalColumns
  });





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value)
    const updatedValue = name === "airlineId" ? parseInt(value) : value;
    setFlightData((prevState) => ({
      ...prevState,
      [name]: updatedValue, // Update the field dynamically based on input name
    }));
  };

  useEffect(() => {
    const totalSeats = Object.values(seatCount).reduce((acc, cur) => acc + parseInt(cur), 0);
    setFlightData((prevState) => ({
      ...prevState,
       totalSeats, 
    }));
  }, [seatCount]);


  useEffect(() => {
    setFlightData((prevState) => ({
      ...prevState,
      airCraftType: AirCraftType,
      departAirport: fromLocation,
      arrivalAirport: toLocation,
    }));
  }, [AirCraftType, fromLocation, toLocation]);

  useEffect(() => {
    setFlightData((prevState) => ({
      ...prevState,
       totalSeatColumn: TotalColumns, 
    }));
  }, [TotalColumns]);
 

  const handleTotalColumns=(e)=>
  {
    setTotalColumns(parseInt(e.target.value))
  }




  


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
      ...prevCount,
      [name]:value
    }
  ))
}



  // Handle checkbox changes
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    console.log(name, checked);
    setSelectedClasses((prevClasses) => ({
      ...prevClasses,
      [name]: checked, // Toggle the checked state
    }));
  }, []);


  //convert object to array
  const selectedClassesArray = useMemo(() => {
    return Object.entries(selectedClasses)
      .filter(([_, value]) => value) // Filter for true values
      .map(([key]) => key); // Get the keys (class names)
  }, [selectedClasses]);


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


  useEffect(()=>
  {
     const fetchAirlines=async()=>
     {
      const response=await axiosInstance.get('/Airlines/airlinesByflightowner');
      console.log(response.data)
      setAirlines(response.data)
     }
     fetchAirlines();
  },[])



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construct seatLayouts for each selected class
    const seatLayouts = [];
    if (selectedClasses.economy) {
      seatLayouts.push({
        flightId: flightId,  // This will be updated later
        totalColumns: TotalColumns,
        layoutPattern: selectedLayout,
        seatTypePattern: seatTypePatterns[selectedLayout] || '',
        classType: 'Economy',
        rowCount: parseInt(rowCount['economy-row-count'])
      });
    }
  
    if (selectedClasses.business) {
      seatLayouts.push({
        flightId: flightId,
        totalColumns: TotalColumns,
        layoutPattern: selectedLayout,
        seatTypePattern: seatTypePatterns[selectedLayout] || '',
        classType: 'Business',
        rowCount: parseInt(rowCount['business-row-count'])
      });
    }
  
    if (selectedClasses.first) {
      seatLayouts.push({
        flightId: flightId,
        totalColumns: TotalColumns,
        layoutPattern: selectedLayout,
        seatTypePattern: seatTypePatterns[selectedLayout] || '',
        classType: 'First',
        rowCount: parseInt(rowCount['first-row-count'])
      });
    }
  
    if (selectedClasses.premium) {
      seatLayouts.push({
        flightId: flightId,
        totalColumns: TotalColumns,
        layoutPattern: selectedLayout,
        seatTypePattern: seatTypePatterns[selectedLayout] || '',
        classType: 'Premium',
        rowCount: parseInt(rowCount['premium-row-count'])
      });
    }
  
    try {
      console.log(flightData);
  
      // Create Flight and get flightId
      const flightResponse = await axiosInstance.post('/Flight/add', flightData);
      const newFlightId = flightResponse.data.data;  // Store the new FlightId
  
      console.log('Flight created with ID:', newFlightId);
      setFlightId(newFlightId);  // Update state
  
      // Create Unavailable Seats
      const unavailableSeatResponse = await axiosInstance.post('/UnavailableSeat', {
        flightId: newFlightId,  // Use the newly created flight ID
        seats: Array.from(disabledSeats),
      });
      console.log(unavailableSeatResponse.data);
  
      // Create Seat Layouts
      const seatLayoutResponse = seatLayouts.map(layout => ({
        ...layout,
        flightId: newFlightId,  // Update FlightId for each layout
      }));

      console.log(seatLayoutResponse);

      const seatLayoutDatabaseResponse=await axiosInstance.post('/SeatLayout',seatLayoutResponse)
     

      console.log(seatLayoutDatabaseResponse.data)
      // Scroll to top and show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
  
      // Reset form fields
      resetFormFields();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create flight or seat layouts. Please try again.');
    }
  };
  
  const resetFormFields = () => {
    setFlightData({
      airlineId: 0,
      flightNumber: '',
      airCraftType: "",
      flightType: 'Domestic',
      departAirport: "",
      arrivalAirport: "",
      totalSeats: 0,
      totalSeatColumn: ""
    });
    setDisabledSeats(new Set());
    setSelectedClasses({
      first: false,
      business: false,
      premium: false,
      economy: false,
    });
    setRowCount({
      'economy-row-count': 0,
      'business-row-count': 0,
      'first-row-count': 0,
      'premium-row-count': 0
    });
    setSeatCount({
      'economy-seats': 0,
      'business-seats': 0,
      'first-seats': 0,
      'premium-seats': 0
    });
    setSelectedLayout('');
    setTotalColumns(0);
    setAirCraftType(''); // Reset aircraft type
    setFromLocation(''); // Reset departure location
    setToLocation('');   // Reset arrival location
  };

  useEffect(()=>
    {
       if(location.pathname.includes('edit')){
        const fetchFlightDetails = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/Flight/flight/${id}`);
                const flightData = response.data;

                const departAirportResponse = await axiosInstance.get(`/Airports/${flightData.departureAirportId}`);
                const arrivalAirportResponse = await axiosInstance.get(`/Airports/${flightData.arrivalAirportId}`);
                const flightWithAirports = {
                    ...flightData,
                    departureAirport: departAirportResponse.data,
                    arrivalAirport: arrivalAirportResponse.data,
                };
                setFlightData(
                  {
                    airlineId:flightWithAirports.airlineId,
                    flightNumber:flightWithAirports.flightNumber,
                    flightType:flightWithAirports.flightType,
                    airCraftType: flightWithAirports.airCraftType,
                    departAirport: flightWithAirports.departureAirport.airportId,
                    arrivalAirport: flightWithAirports.arrivalAirport.airportId,
                    totalSeats: flightWithAirports.totalSeats,
                    totalSeatColumn: flightWithAirports.totalSeatColumn
                  }
                )

               
                const seatLayoutResponse=await axiosInstance.get(`/SeatLayout/${id}`)
                console.log(seatLayoutResponse.data)
                setSeatLayoutInfo(seatLayoutResponse.data)

                const unavailableSeatResponse=await axiosInstance.get(`UnavailableSeat/${id}`)
                console.log(unavailableSeatResponse.data)
                const data=unavailableSeatResponse.data;
                const seatNumbers = data.map(seat => seat.seatNumber);
                setDisabledSeats(new Set(seatNumbers));
                

            } catch (error) {
                console.error("Error fetching flight details", error);
            }
            setLoading(false);  // Set loading to false after fetching
        };
      fetchFlightDetails();
       }
    },[])


  

  return (
    <>
    {showSuccess && (
        <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className='text-lg'>Flight Added Successfully</p>
          </div>
        </div>)}
   
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
                name="airlineId"
                value={flightData.airlineId}
                required
                onChange={handleInputChange}
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {airlines.map((airline)=>(
                  <option key={parseInt(airline.airlineId)} value={parseInt(airline.airlineId)}>{airline.airlineName}</option>
                ))}
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
                value={flightData.flightNumber}
                onChange={handleInputChange}
                id="flight-number"
                required
                name="flightNumber"
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            

            {/* Aircraft Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <AircraftSelector setAirCraftType={setAirCraftType} />
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
                    required
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
                    required
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
                    required
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
                    required
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
            <div className="p-4 rounded-lg shadow-sm">
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Flight Type:
                </label>
              <select className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" name="flightType" value={flightData.flightType} onChange={handleInputChange} required>
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>

            <div className='p-4 rounded-lg shadow-sm'>
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2">  
                Departure Location
              </label>
              <AirportSelect placeholder={"Departure"} Location={fromLocation} setLocation={setFromLocation} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
              dropdownstyling="bg-white hover:text-white"/>

            </div>
            <div className='p-4 rounded-lg shadow-sm'>
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2">  
                Arrival Location
              </label>
              <AirportSelect placeholder={"Arrival"} Location={toLocation} setLocation={setToLocation} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
              dropdownstyling="bg-white hover:text-white"/>

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
                required
                value={selectedLayout}
                onChange={handleLayoutChange}
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
                required
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
                required
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
                required
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
                required
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
                required
                name="economy-seats"
                value={seatCount['economy-seats']}
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
                required
                disabled
                value={seatCount['business-seats']}
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
                required
                disabled
                value={seatCount['first-seats']}
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
                required
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
                required
                name="total-seats"
                value={flightData.totalSeatColumn}
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
                required
                name="total-seats"
                value={flightData.totalSeats}
                disabled
                className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className='col-span-2 mt-3'>
              <SeatAllocation layout={selectedLayout} TotalColumns={TotalColumns} rowCount={rowCount} setSeatCount={setSeatCount} disabledSeats={disabledSeats} setDisabledSeats={setDisabledSeats} role="flightOwner" classnames={selectedClassesArray}/>
           </div>
            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6 col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-8 rounded hover:bg-blue-700"
                onClick={handleSubmit}
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
    </>
  );
};

export default AddFlightForm;
