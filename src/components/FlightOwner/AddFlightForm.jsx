import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    first: false,
    business: false,
    premium: false,
    economy: false
  });
  const [selectedLayout, setSelectedLayout] = useState('');
  const [disabledSeats, setDisabledSeats] = useState(new Set());
  const [error,setError]=useState("")
  const [airlines,setAirlines]=useState([])
  const [fromLocation,setFromLocation]=useState(0)
  const [toLocation,setToLocation]=useState(0)
  const [showSuccess, setShowSuccess] = useState(false);
  const [flightId,setFlightId]=useState(0);
  const [seatLayoutInfo,setSeatLayoutInfo]=useState([])

  const [TotalColumns, setTotalColumns] = useState(0);
  const [AirCraftType,setAirCraftType]=useState("")
  const [loading,setLoading]=useState(false)
  const [isEditing,setIsEditing]=useState(false)
  const [unavailableSeat,setUnavailableSeat]=useState([])
  const [isSchedling,setIsScheduling]=useState(false)

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

  const flightTypeMapping={
    1:'Domestic',
    2:'International'
  }
  
  const [rowCount,setRowCount]=useState(
    {
      'first-row-count':0,
      'business-row-count':0,
      'premium-row-count':0,
      'economy-row-count':0,
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
    
    if(!isEditing){

    setSeatCount({
      'economy-seats': TotalColumns * rowCount['economy-row-count'],
      'business-seats': TotalColumns * rowCount['business-row-count'],
      'first-seats': TotalColumns * rowCount['first-row-count'],
      'premium-seats': TotalColumns * rowCount['premium-row-count'],
    });
  }
  

  }, [TotalColumns, rowCount]);



  useEffect(() => {
    if (seatLayoutInfo.length > 0) {
      const updatedRowCount = {
        'economy-row-count': 0,
        'business-row-count': 0,
        'first-row-count': 0,
        'premium-row-count': 0,
      };
  
      seatLayoutInfo.forEach(seatLayout => {
        const classType = seatLayout.classType.toLowerCase(); // Ensure classType consistency
  
        // Increment the corresponding row count
        if (classType === 'economy') {
          updatedRowCount['economy-row-count'] += parseInt(seatLayout.rowCount);
        } else if (classType === 'business') {
          updatedRowCount['business-row-count'] += parseInt(seatLayout.rowCount);
        } else if (classType === 'first') {
          updatedRowCount['first-row-count'] += parseInt(seatLayout.rowCount);
        } else if (classType === 'premium') {
          updatedRowCount['premium-row-count'] += parseInt(seatLayout.rowCount);
        }
      });
  
      // Update the row count state
      setRowCount(updatedRowCount);
      initialSeatLayoutInfo.current = updatedRowCount;
      console.log('Initial layout set:', initialSeatLayoutInfo.current);
    }
  }, [seatLayoutInfo]);
  

  
  

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



  useEffect(() => {
    // Calculate total seats for each class based on row counts and TotalColumns
    const calculatedSeatCount = {
      'economy-seats': TotalColumns * rowCount['economy-row-count'],
      'business-seats': TotalColumns * rowCount['business-row-count'],
      'first-seats': TotalColumns * rowCount['first-row-count'],
      'premium-seats': TotalColumns * rowCount['premium-row-count']
    };

    // Initialize disabled seats per class
    const disabledSeatsPerClass = {
      economy: 0,
      business: 0,
      first: 0,
      premium: 0,
    };

    // Count unavailable seats based on classType
    unavailableSeat.forEach(seat => {
      const classType = seat.classType.toLowerCase(); // e.g., "economy"
      if (disabledSeatsPerClass[classType] !== undefined) {
        disabledSeatsPerClass[classType] += 1;
      }
    });

    // Adjust seat counts by subtracting the number of disabled seats for each class
    const adjustedSeatCount = {
      'economy-seats': calculatedSeatCount['economy-seats'] - disabledSeatsPerClass.economy,
      'business-seats': calculatedSeatCount['business-seats'] - disabledSeatsPerClass.business,
      'first-seats': calculatedSeatCount['first-seats'] - disabledSeatsPerClass.first,
      'premium-seats': calculatedSeatCount['premium-seats'] - disabledSeatsPerClass.premium,
    };

    // Ensure no negative seat counts
    const totalSeats = Object.values(adjustedSeatCount).reduce((acc, cur) => acc + Math.max(cur, 0), 0);

    // Update seat count state
    setSeatCount(adjustedSeatCount);

    // Assuming setFlightData is defined elsewhere to update flight data
    setFlightData((prevState) => ({
      ...prevState,
      totalSeats: totalSeats,
    }));
  }, [TotalColumns, rowCount]);





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
    setRowCount(prevRowCount=>({...prevRowCount,[name]:parseInt(value)}))
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

  console.log(selectedClassesArray)


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

      if (response.data.length > 0 && !flightData.airlineId) {
        setFlightData((prevData) => ({
          ...prevData,
          airlineId: response.data[0].airlineId, // Pre-select first airline
        }));
     }
    }
     fetchAirlines();
  },[])

  function getRowNumber(seatNumber) {
    // Use regex to match all digits at the beginning of the seatNumber
    const match = seatNumber.match(/^\d+/);
    return match ? parseInt(match[0], 10) : null; // Convert to integer or return null if not found
}


  const getClassTypeBySeatNumber = (seatNumber) => {
    // Extract row number from seatNumber (assuming it's formatted like "12A")
    const rowNumber = getRowNumber(seatNumber); // Adjust if your row number is formatted differently

    // Calculate total rows in each class type
    const firstRowCount = rowCount['first-row-count'];
    const businessRowCount = rowCount['business-row-count'] + firstRowCount; // Start after first class
    const premiumRowCount = rowCount['premium-row-count'] + businessRowCount; // Start after business class
    const economyRowCount = rowCount['economy-row-count'] + premiumRowCount; // Start after premium class

    // Determine the class type based on the row number
    if (rowNumber <= firstRowCount) {
      return 'First';
    } else if (rowNumber <= businessRowCount) {
      return 'Business';
    } else if (rowNumber <= premiumRowCount) {
      return 'Premium';
    } else if (rowNumber <= economyRowCount) {
      return 'Economy';
    }

    return null; // Return null if no class type is found
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    //editing updation
    
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


    const seatsByClass = {};

    // Iterate over the disabled seats and group them by class type
    disabledSeats.forEach(seatNumber => {
      const classType = getClassTypeBySeatNumber(seatNumber); // Call the method to get class type
      if (classType) {
        // If the class type doesn't exist in the object, initialize it
        if (!seatsByClass[classType]) {
          seatsByClass[classType] = [];
        }
        // Add the seat number to the corresponding class type
        seatsByClass[classType].push(seatNumber);
      }
    });


    console.log(seatsByClass)


  
    try {
      console.log(seatLayouts);
      console.log(flightData)
      // Create Flight and get flightId
      const flightResponse = await axiosInstance.post('/Flight/add', flightData);
      const newFlightId = flightResponse.data.data;  // Store the new FlightId
  
      console.log('Flight created with ID:', newFlightId);
      setFlightId(newFlightId);  // Update state
  
      // Create Unavailable Seats
      const unavailableSeatResponse = await axiosInstance.post('/UnavailableSeat', {
        flightId: newFlightId,  // Use the newly created flight ID
        seats: seatsByClass,
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
      airlineId: "",
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


  const initialFlightData = useRef({});
  const initialSeatLayoutInfo = useRef(null);
  const initialSelectedClasses = useRef({});
  const initialDisabledSeats = useRef(new Set());

  useEffect(()=>
    {
       if(location.pathname.includes('edit') || location.pathname.includes('schedule')){

        setIsEditing(true)
        setIsScheduling(true)
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
                 const FlightDetails=
                  {
                    airlineId:flightWithAirports.airlineId,
                    flightNumber:flightWithAirports.flightNumber,
                    flightType: flightTypeMapping[flightWithAirports.flightType],
                    airCraftType: flightWithAirports.airCraftType,
                    departAirport: flightWithAirports.departureAirport.airportId,
                    arrivalAirport: flightWithAirports.arrivalAirport.airportId,
                    totalSeats: flightWithAirports.totalSeats,
                    totalSeatColumn: flightWithAirports.totalSeatColumn
                  }
                
                setFlightData(FlightDetails)
                setTotalColumns(flightWithAirports.totalSeatColumn)
                setFromLocation(flightWithAirports.departureAirport.airportId)
                setToLocation(flightWithAirports.arrivalAirport.airportId)
                setAirCraftType(flightWithAirports.airCraftType)
               
                const seatLayoutResponse=await axiosInstance.get(`/SeatLayout/${id}`)
                console.log(seatLayoutResponse.data)
                const layoutData=seatLayoutResponse.data;
                setSeatLayoutInfo(seatLayoutResponse.data)
                setSelectedLayout(layoutData[0].layoutPattern)
                const classTypes = seatLayoutResponse.data.map(layout => layout.classType.toLowerCase());

                // Create a new object for selectedClasses
                const updatedSelectedClasses = {
                    first: classTypes.includes('first'),
                    business: classTypes.includes('business'),
                    premium: classTypes.includes('premium'),
                    economy: classTypes.includes('economy'),
                };

                setSelectedClasses(updatedSelectedClasses);

                const unavailableSeatResponse=await axiosInstance.get(`UnavailableSeat/${id}`)
                console.log(unavailableSeatResponse.data)
                const data=unavailableSeatResponse.data;
                setUnavailableSeat(data);
                const seatNumbers = data.map(seat => seat.seatNumber);
                setDisabledSeats(new Set(seatNumbers));

                initialFlightData.current = FlightDetails;
                initialSelectedClasses.current = updatedSelectedClasses;
                initialDisabledSeats.current = new Set(seatNumbers);

            } catch (error) {
                console.error("Error fetching flight details", error);
            }
            finally{
            setLoading(false); 
            } // Set loading to false after fetching
        };
      fetchFlightDetails();
       }
    },[id,location])

    console.log(flightData)

    const [flightDataChanged,setFlightDataChanged]=useState(false);
    const[seatLayoutChanged,setSeatLayoutChanged]=useState(false)
    const [selectedClassChanged,setSelectedClassChanged]=useState(false)
    const [disabledSeatsChanged,setDisabledSeatsChanged]=useState(false)

    const hasChanges = () => {

      // console.log(JSON.stringify(flightData),JSON.stringify(initialFlightData.current))
       console.log(JSON.stringify(rowCount))
       console.log(JSON.stringify(initialSeatLayoutInfo.current))

      //  console.log(JSON.stringify(selectedClasses))
      //  console.log(JSON.stringify(initialSelectedClasses.current))
      //  console.log(disabledSeats.size,initialDisabledSeats.current.size)

      const flightDataChanged = JSON.stringify(flightData) !== JSON.stringify(initialFlightData.current);
      setFlightDataChanged(flightDataChanged)
      const seatLayoutChanged = JSON.stringify(rowCount) !== JSON.stringify(initialSeatLayoutInfo.current);
      setSeatLayoutChanged(seatLayoutChanged)
      const selectedClassesChanged = JSON.stringify(selectedClasses) !== JSON.stringify(initialSelectedClasses.current);
      setSelectedClassChanged(selectedClassChanged)
      const disabledSeatsChanged = disabledSeats.size !== initialDisabledSeats.current.size || 
        Array.from(disabledSeats).some(seat => !initialDisabledSeats.current.has(seat));
      
        setDisabledSeatsChanged(disabledSeatsChanged)

        console.log({flightDataChanged,seatLayoutChanged,selectedClassesChanged,disabledSeatsChanged})
  
      return flightDataChanged || seatLayoutChanged || selectedClassesChanged || disabledSeatsChanged;
    };


    const handleSaveChanges = async (e) => {
       e.preventDefault();
       
       console.log(seatLayoutInfo)
       console.log(JSON.stringify(rowCount))
       console.log(JSON.stringify(initialSeatLayoutInfo.current))
       
       


      if (hasChanges()) {

        if(isSchedling)
        { 
          
           
        }
        const seatLayouts = [];
        if (selectedClasses.economy) {
          seatLayouts.push({
            flightId: id,  // This will be updated later
            totalColumns: TotalColumns,
            layoutPattern: selectedLayout,
            seatTypePattern: seatTypePatterns[selectedLayout] || '',
            classType: 'Economy',
            rowCount: parseInt(rowCount['economy-row-count'])
          });
        }
      
        if (selectedClasses.business) {
          seatLayouts.push({
            flightId: id,
            totalColumns: TotalColumns,
            layoutPattern: selectedLayout,
            seatTypePattern: seatTypePatterns[selectedLayout] || '',
            classType: 'Business',
            rowCount: parseInt(rowCount['business-row-count'])
          });
        }
      
        if (selectedClasses.first) {
          seatLayouts.push({
            flightId: id,
            totalColumns: TotalColumns,
            layoutPattern: selectedLayout,
            seatTypePattern: seatTypePatterns[selectedLayout] || '',
            classType: 'First',
            rowCount: parseInt(rowCount['first-row-count'])
          });
        }
      
        if (selectedClasses.premium) {
          seatLayouts.push({
            flightId: id,
            totalColumns: TotalColumns,
            layoutPattern: selectedLayout,
            seatTypePattern: seatTypePatterns[selectedLayout] || '',
            classType: 'Premium',
            rowCount: parseInt(rowCount['premium-row-count'])
          });
        }
        console.log(seatLayouts)
        console.log('Changes detected, making API call...');
       
        try {
             console.log(flightData,id)
             const updateFlightDataResponse=await axiosInstance.put(`/Flight/update/${parseInt(id)}`,flightData)
             console.log(updateFlightDataResponse.data)
             
             const SeatLayoutUpdateResponse=await axiosInstance.put('/SeatLayout',seatLayouts)
             console.log(SeatLayoutUpdateResponse.data)
            
              console.log("inside disable seats changed condition")
              const initialSeats = initialDisabledSeats.current;
              const currentSeats = disabledSeats;
          
              // Find seats that were added
              const addedSeats = new Set([...currentSeats].filter(seat => !initialSeats.has(seat)));
          
              // Find seats that were removed
              const removedSeats = new Set([...initialSeats].filter(seat => !currentSeats.has(seat)));

              console.log(addedSeats)
              console.log(removedSeats)
          
              // POST request for new seats added
              if (addedSeats.size > 0) {
                const seatsByClass = {};

                // Iterate over the disabled seats and group them by class type
                addedSeats.forEach(seatNumber => {
                  const classType = getClassTypeBySeatNumber(seatNumber); // Call the method to get class type
                  if (classType) {
                    // If the class type doesn't exist in the object, initialize it
                    if (!seatsByClass[classType]) {
                      seatsByClass[classType] = [];
                    }
                    // Add the seat number to the corresponding class type
                    seatsByClass[classType].push(seatNumber);
                  }
                });


                const unavailableSeatResponse = await axiosInstance.post('/UnavailableSeat', {
                  flightId: id,  // Use the newly created flight ID
                  seats: seatsByClass,
                });
                console.log('Unavailable seats added response:', unavailableSeatResponse.data);
              }
          
              // // DELETE request for removed seats
              if (removedSeats.size > 0) {
                const removedSeatsArray = Array.from(removedSeats);
                await axiosInstance.delete(`/UnavailableSeat/${id}`, {
                  data: removedSeatsArray  // Correct way to pass data to DELETE
                });
                console.log('Unavailable seats removed:', removedSeatsArray);
              }

             window.scrollTo({ top: 0, behavior: 'smooth' });
             setShowSuccess(true);
             setTimeout(() => setShowSuccess(false), 3000);
          }
        catch(error)  
        {
           console.log(error)
        }
      } else {
        console.log('No changes detected, no API call made.');
      }
    };


    useEffect(() => {
      if (seatLayoutInfo.length > 0) {
          const updatedRowCount = {
              'economy-row-count': 0,
              'business-row-count': 0,
              'first-row-count': 0,
              'premium-row-count': 0,
          };
          const classNamesSet = new Set();

          seatLayoutInfo.forEach(seatLayout => {
              const classType = seatLayout.classType.toLowerCase(); // Convert to lower case for consistency

              // Add class type to the set for unique values
              classNamesSet.add(classType);

              // Increment the corresponding row count
              if (classType === 'economy') {
                  updatedRowCount['economy-row-count'] += parseInt(seatLayout.rowCount);
              } else if (classType === 'business') {
                  updatedRowCount['business-row-count'] += parseInt(seatLayout.rowCount);
              } else if (classType === 'first') {
                  updatedRowCount['first-row-count'] += parseInt(seatLayout.rowCount);
              } else if (classType === 'premium') {
                  updatedRowCount['premium-row-count'] += parseInt(seatLayout.rowCount);
              }
          });
          console.log(updatedRowCount)
 
          // Update state with the final values
             setRowCount(updatedRowCount);
          // If `initialSeatLayoutInfo.current` hasn't been set yet, initialize it

            initialSeatLayoutInfo.current = updatedRowCount; // Store the initial layout data
            console.log('Initial layout set:', initialSeatLayoutInfo.current)
          
          // setClassnames(Array.from(classNamesSet));
      }
  }, [seatLayoutInfo]);








  if (!initialSeatLayoutInfo.current) {
    initialSeatLayoutInfo.current = rowCount; // Store the initial layout data
    console.log('Initial layout set:', initialSeatLayoutInfo.current)}




  return (
    <>
    {showSuccess && (
        <div className="flex items-center justify-between p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity duration-500 ease-in-out">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className='text-lg'>{isEditing ? 'Flight Layout updated successfully': 'Flight Added Successfully'}</p>
          </div>
        </div>)}
  
    <div className="flex">  
      {/* Main Content */}
      <div className="p-3 w-full">
        <div className="flex justify-between items-center px-12">
          <h2 className="text-3xl font-bold text-gray-800">{isEditing ? 'Edit Flight Layout': 'Add New Flight'}</h2>
          {!isEditing && 
          <button
            onClick={handleViewFlights}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded flex items-center gap-2"
          >
            <i className="fa-solid fa-plane-departure"></i>
            <span className="text-lg">View Flights</span>
          </button> }
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
                value={flightData.airlineId || 0}
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
              <AircraftSelector setAirCraftType={setAirCraftType} initialAircraftType={AirCraftType}/>
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
              <AirportSelect placeholder={"Departure"} Location={fromLocation} setLocation={setFromLocation} initialLocationId={flightData.departAirport} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
              dropdownstyling="bg-white hover:text-white"/>

            </div>
            <div className='p-4 rounded-lg shadow-sm'>
              <label
                htmlFor="flight-number"
                className="block text-lg font-semibold text-gray-700 mb-2">  
                Arrival Location
              </label>
              <AirportSelect placeholder={"Arrival"} Location={toLocation} setLocation={setToLocation} initialLocationId={flightData.arrivalAirport} error={error} inputstyling={`p-2 rounded-lg outline-none w-full border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${error ? 'border-2 border-red-500' : 'border-2 hover:bg-blue-'}`}
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
              
                onClick={isEditing ? handleSaveChanges : handleSubmit}
              >
                {isEditing ? 'Save Changes':'Submit'}
              </button>
              <button
                type="reset"
                className="bg-red-600 text-white py-3 px-8 rounded hover:bg-red-700"
              >
                 {isEditing ? 'Cancel':'Reset'}
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
