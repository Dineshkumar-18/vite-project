import React, { useMemo, useRef, useState } from 'react'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axiosInstance from '../utils/axiosInstance';


const convertLayoutToArray = (layoutString) => {

let result = [];
console.log(layoutString)
  for (let char of layoutString) {
    if (char === '+') {
      result.push(' ');
    } else {
      result.push(char);
    }
  }

  return result.reverse();
};

const convertSeatTypetoArray=(seatTypeString)=>
{
  let result=[];
  for(let char of seatTypeString)
  {
    if (char === '+') {
      result.push(' ');
    } else {
        let value='';
        if(char==='W') value='Window';
        else if(char==='A') value='Aisle';
        else value='Middle'
        result.push(value);
    }
  }
  return result;
}


    


const UserSeatLayout = ({layout,TotalColumns,classnames,rowCount,setSeatCount,disabledSeats,setDisabledSeats,role,isBookingStarted,isPriceSetup,pricing,handleBatchUpdatePrices,seatPrice, onSeatSelect,markedSeats}) => {

  console.log(pricing)
  
  
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading,setLoading]=useState(false)
  const [showPopup,setShowPopup]=useState(false)
  const [Class,SetClass]=useState('')
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [seatPriceUpdates, setSeatPriceUpdates] = useState({}); 

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const seatContainerRef = useRef(null);


  const [editingSeat, setEditingSeat] = useState(null); // State to track which seat is being edited
  const [newPrice, setNewPrice] = useState('');


const seatClassColors = {
    economy: 'bg-green-200', // Example color for economy class
    business: 'bg-blue-200', // Example color for business class
    firstClass: 'bg-red-200', // Example color for first class
    disabled: 'bg-gray-300', // Color for disabled seats
};
 
const seatTypePatterns = {
    'AC+DEFG+HJ': 'WA+AMMA+AW',  // 2+4+2 layout
    'ABC+DEF+GHI': 'WMA+AMA+AMW', // 3+3+3 layout
    'AB+CD+EF': 'WA+MM+AW',       // 2+2+2 layout
    'ABC+DEF': 'WMA+AMW'            // 3+3 layout
  };

  const updateSeatCount = (className, value) => {
    setSeatCount((prevCounts) => {
      return {
        ...prevCounts,
        [`${className}-seats`]: prevCounts[`${className}-seats`] + value,
      };
    });
  };

  function getSeatPriceFromSeat(seatPrices, seatIdentifier) {
    // Find the seat price object that matches the seatIdentifier
    const seatPriceObj = seatPrices.find(seat => seat.seatNumber === seatIdentifier);

    // Return the price if found, otherwise return null
    return seatPriceObj ? seatPriceObj.seatPrice : null;
    }

    const isSeatBooked = (seatNumber) => {
        // Find the seat object by its seat number
        const seat = seatPrice.find(seat => seat.seatNumber === seatNumber);
        
        // Return true if the seat is booked, false otherwise
        return seat ? seat.status === 2 ||  seat.status === 3 : false; // Assuming 3 means booked
    };


  const handleSeatClick = (seat, className, event) => {
   if(role==='flightOwner'){
    if (disabledSeats.has(seat)) {
      // If the seat is already disabled, enable it by removing from disabledSeats
      setDisabledSeats(prev => {
        const updatedSeats = new Set(prev);
        updatedSeats.delete(seat); // Remove from disabledSeats
        return updatedSeats;
      });
      updateSeatCount(className, 1); // Increment seat count
    } else {
      // If seat is not disabled, open the popup for actions (Delete or Close)
      setSelectedSeat(seat);
      SetClass(className)
  
      const containerRect = seatContainerRef.current.getBoundingClientRect();
      const seatRect = event.currentTarget.getBoundingClientRect();
  
      setPopupPosition({
        top: seatRect.top - containerRect.top,
        left: seatRect.left - containerRect.left,
      });

      setEditingSeat(seat);
      setNewPrice('');

  
      setShowPopup(true); // Open the popup
    }
    }
    else if(role==='user'){ 
      setSelectedSeats((prevSelectedSeats) => {
        const newSelectedSeats = new Set(prevSelectedSeats);
        if (newSelectedSeats.has(seat)) {
          newSelectedSeats.delete(seat); // Deselect the seat if already selected
        } else {
          newSelectedSeats.add(seat); // Select the seat
        }
        return newSelectedSeats;
      });
    }
  };

    const handleDeleteSeat = () => {
       console.log(Class)
      if (selectedSeat) {
        // Add the selected seat to disabledSeats
        setDisabledSeats(prev => {
          const updatedSeats = new Set(prev);
          updatedSeats.add(selectedSeat); // Disable the seat
          return updatedSeats;
        });
        updateSeatCount(Class, -1); // Decrement seat count
        setSelectedSeat(null); // Clear the selected seat
        setShowPopup(false); // Close the popup
      }
    };

    // function getSeatPrice(seatPrices, seatIdentifier) {
    //     // Find the seat price object that matches the seatIdentifier
    //     const seatPriceObj = seatPrices.find(seat => seat.seatNumber === seatIdentifier);
    
    //     // Return the price if found, otherwise return null
    //     return seatPriceObj ? seatPriceObj.seatPrice : null;
    // }

   
    

    
   
  console.log(layout)
  const seats = convertLayoutToArray(layout);
  console.log(seats)
  console.log(layout)
  
  let seatType='';
  if(layout) { seatType=convertSeatTypetoArray(seatTypePatterns[layout])}
  console.log(seats)
  console.log(seatType)
  const seatHeight = useMemo(() => {
    console.log('Calculating seatHeight');
    return 28 * (TotalColumns + 1) + 80;
  }, [TotalColumns]);
  const containerHeight=seatHeight+104

  console.log(seatHeight,containerHeight)


const getSeatPrice = (seatClass, seatType) => {
  if(isPriceSetup && !pricing)
  {
    return 0;
  }
  else if(isPriceSetup) { // Check if pricing setup is enabled
    return pricing[seatClass]?.[seatType] || 0;
  }
  return 0; // Default price if pricing is not set up
};

const saveNewPrice = () => {
  if (editingSeat && newPrice && !isNaN(newPrice)) {
    setSeatPriceUpdates((prevUpdates) => ({
      ...prevUpdates,
      [editingSeat]: newPrice // Store the updated price for this specific seat
    }));
    setEditingSeat(null); // Close the price editor after saving
  }
};

console.log(seatPriceUpdates);

const handleSubmitSeatPrices = () => {
  if (Object.keys(seatPriceUpdates).length > 0) {
    handleBatchUpdatePrices(seatPriceUpdates); // Submit price updates to the parent
    setSeatPriceUpdates({}); // Clear updates after submission
  }
};




  let rowNumber=1;

  return (
    <div className='space-y-3'>
    <div className='bg-flightbg rounded-br-sm border border-1 border-neutral-100 flex items-center relative rounded-lg'>
        <div>
        <svg
         viewBox="0 0 40 40"
         height="40"
         width="40"
         className="text-secondary-500 cursor-pointer absolute z-30"
         style={{ left: '-22px', transform: 'translateY(-50%)' }}
         >
      <  g transform="rotate(-180 20 20.0091465)" fill="none" fillRule="evenodd">
        <rect fill="#FFF" transform="matrix(-1 0 0 1 40 0)" width="40" height="40" rx="20" />
        <rect stroke="currentColor" transform="matrix(-1 0 0 1 40 0)" x="0.5" y="0.5" width="39" height="39" rx="19.5" />
        <path d="M20 26.2928932L19.4821068 25.775l5.4-5.4H13.5v-.75h11.3821068l-5.4-5.4L20 13.7071068 26.2928932 20 20 26.2928932z" stroke="currentColor" />
      </g>
    </svg>
  
       <svg viewBox="0 0 40 40" 
       height="40" 
       width="40" 
       className="c-secondary-500 cursor-pointer absolute z-30"
       style={{ right: '-22px', transform: 'translateY(-50%)' }}>
        <g transform="translate(0 .018293)" fill="none" fill-rule="evenodd">
        <rect fill="#FFF" transform="matrix(-1 0 0 1 40 0)" width="40" height="40" rx="20"> 
        </rect><rect stroke="currentColor" transform="matrix(-1 0 0 1 40 0)" x="0.5" y="0.5" width="39" height="39" rx="19.5"></rect>
        <path d="M20 26.2928932L19.4821068 25.775l5.4-5.4H13.5v-.75h11.3821068l-5.4-5.4L20 13.7071068 26.2928932 20 20 26.2928932z" stroke="currentColor"></path>
        </g>
        </svg>
        </div>
        
        <div className={`relative flex items-center overflow-x-auto overflow-y-hidden hide-scrollbar min-h-[260px] h-[${containerHeight}px]`}>
            <div className={`flex items-center min-h-[260px] h-[${containerHeight}px]`}>
                {/* aerophane front-portion*/}
                <div className='inline-flex'>
                    <svg
                        viewBox="0 0 240 236"
                        className="h-full"
                        height="auto"
                        style={{ transform: "rotate(0deg)", width: `${seatHeight}px` }}
                        >
                        <g fill="none" fillRule="evenodd">
                            <path fill="#F7F7F7" fillOpacity="0.01" d="M0 0h240v236H0z"></path>
                            <path
                            fill="#FFF"
                            d="M210.760609 234.096774S220.507073 234.731183 240 236V0c-19.492927 1.2688172-29.239391 1.90322581-29.239391 1.90322581C157.418708 1.90322581 40 62.1659084 40 118c0 55.834092 117.418708 116.096774 170.760609 116.096774z"
                            ></path>
                            <g fill="#E6E6E6">
                            <path d="M135.161 66.612L158 70.419l-15.226 43.774h-22.839zM171.322 45.677h3.807l-15.226 20.935-22.839-3.806zM119.935 121.806h22.839L158 165.58l-22.839 3.807zM137.064 173.193l22.839-3.806 15.226 20.935h-3.807z"></path>
                            </g>
                        </g>
                    </svg>
                </div>

                <div className='inline-flex'>
                    <div className='relative bg-white w-full inline-flex flex-nowrap py-5 px-4'>
                        <svg
                            viewBox="0 0 40 44"
                            width="40"
                            height="44"
                            className="absolute left-0"
                            style={{ transform: "translateY(-50%)", top: "50%", left: "-40px" }}
                            >
                            <path
                                fill="#E6E6E6"
                                fillRule="evenodd"
                                d="M40 31.429V12.571H21.538V0L0 22l21.538 22V31.429z"
                            ></path>
                        </svg>
                         <div className='flex flex-col justify-between nmy-5 flex-nowrap'>
                              <div className='rounded-br-sm flightbg px-1'>
                                   <svg width="20" height="8" className="fill-gray-400">
                                    <path
                                        d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z"
                                        fillRule="nonzero"
                                    />
                                    </svg>
                              </div>
                              <div className='rounded-br-sm flightbg px-1'>
                                   <svg width="20" height="8" className="fill-gray-400">
                                    <path
                                        d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z"
                                        fillRule="nonzero"
                                    />
                                    </svg>
                              </div>
                         </div>

                         <div className='flex flex-col flex-nowrap sticky bg-white z-20 nmy-5 py-5 pl-2 left-0'>
                            {seats.map((name, index) => (
                                <div key={index} className='fs-2 text-neutral-400 flex justify-center items-center m-[2px] mx-[6px] h-[24px] w-[24px]'>
                                  {name}
                                </div>
                              ))}
                        </div>

    <div className="relative flex" ref={seatContainerRef}>
      {classnames.map((className) => (
        <div key={className}>
          {/* Container for each class */}
          <div className="flex">
            {Array.from({ length: rowCount[`${className}-row-count`] }).map((_, rowIndex) => (
               <div className="relative flex flex-col flex-nowrap left-0" key={`${className}-${rowIndex}`}>
                {/* Container for each row */}
                {seats.map((seat, columnIndex) => {
                  const seatIdentifier = `${rowNumber}${seat}`;   
                //   const priceIndex = rowIndex * seats.length + columnIndex; // Assuming seats array contains column identifiers (e.g., ['A', 'B', 'C'])
                const priceSetup=getSeatPriceFromSeat(seatPrice,seatIdentifier)
                  console.log(seatIdentifier,priceSetup)
                  const isSelected = markedSeats.has(seatIdentifier);
                  const isbooked=isSeatBooked(seatIdentifier);
                   const price = getSeatPrice(className.toLowerCase(), seatType[columnIndex].toLowerCase())
                  return (
                    <div
                      key={`${className}-${rowIndex}-${columnIndex}`} // Unique key using className, rowIndex, and columnIndex
                      className={`text-neutral-400 flex justify-center items-center m-[2px] mx-[6px] h-[24px] w-[24px]  ${ role==='flightOwner' ? 
                        (disabledSeats.has(seatIdentifier) ? 'opacity-50 cursor-pointer' : 'cursor-pointer') :  (disabledSeats.has(seatIdentifier)  ? 'opacity-0 cursor-auto' : 'cursor-pointer' )}
                      }`}
                    >
                      <div className="w-full h-full">
 {seat !== " " ? (
    <Tippy
      content={
        !isbooked ?
       (<div>
          <div className='text-center'>{className.toUpperCase()}</div>
          <div className='text-center'>{seatType[columnIndex]}</div>
          
          <div className='text-center'>
              <div>Seat Price: ₹{priceSetup}</div>
            </div>
        </div>) : 
        (
          <div className='text-center'>Booked</div>
        )
      }
      placement="top"
    >
      <div
        className={`rounded-md w-full h-full flex items-center justify-center font-medium ${
          disabledSeats.has(seatIdentifier) 
            ? role === 'flightOwner' 
              ? 'bg-gray-400 text-gray-800' // Flight owner can see disabled seats
              : 'hidden' // User cannot see disabled seats
              : markedSeats.has(seatIdentifier) && !isbooked
              ? 'bg-green-500 text-white' // Selected seat style
              :  isbooked ? 'cursor-auto':('bg-[#471D36] text-white') // Available seat for all roles // Available seat for all roles
        }`}

     

        onClick={(event) => {
            if(!isbooked){
            handleSeatClick(seatIdentifier, className, event);
            }
            if (!disabledSeats.has(seatIdentifier) && !isbooked) {
                onSeatSelect(seatIdentifier, priceSetup); // Notify parent of seat selection
            }
        }}
      >
    {markedSeats.has(seatIdentifier) &&  !isbooked ? (

          <i class="fa-solid fa-check"></i> // You can use an icon library for a better tick mark
        ):''}
     {
      isbooked && (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="c-pointer c-success-500"><rect width="24" height="24" fill="#F7F7F7" rx="4" transform="matrix(1 0 0 -1 0 24)"></rect><path stroke="#D8D8D8" stroke-width="0.8" d="M.926 1.5l22 21M22.74 1.308L1.111 22.692"></path></svg>)
     }
       
      
      </div>
    </Tippy>
  ) : (
    <div className="h-full w-full cursor-auto"></div>
  )}
</div>
                    </div>
                  );
                })}
                {/* Render row number */}
                <div className="fs-2 text-neutral-400 flex justify-center items-center m-[2px] mx-[6px] h-[24px] w-[24px]">
                  {rowNumber++}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Popup rendered once based on selectedSeat */}
      {selectedSeat && (
        <div className="absolute top-0 left-0 p-4 bg-white border rounded shadow-md z-50" style={{ top: popupPosition.top, left: popupPosition.left }}>

     
      <button
        className="text-red-500 absolute right-3 top-1 text-lg font-bold"
        onClick={() => {
          setShowPopup(false); // Close the popup without modifying
          setSelectedSeat(null); // Reset the selected seat
        }}
      >
        X
      </button>

          <div className='text-lg '>Seat Number: <span className='font-bold bg-red-500 px-2 py-1 rounded-lg text-white'>{selectedSeat}</span></div>
          {/* {editingSeat === selectedSeat && role === 'flightOwner' && (
                                  <div>
                                    <input
                                      type="number"
                                      value={newPrice}
                                      onChange={(e) => setNewPrice(e.target.value)}
                                      placeholder="Set new price"
                                      className="mt-2 p-1 outline-none focus:ring-1 focus:ring-blue-500 rounded"
                                    />
                                    <button onClick={saveNewPrice} className="mt-2 bg-green-500 text-white px-2 py-1 rounded">
                                      Update Price
                                    </button>
                                  </div>
                                )} */}
          <button
            onClick={handleDeleteSeat}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>

                         <div className="m-0 pl-2 h-px w-px"></div>
                         <div className='flex flex-col justify-between nmy-5 flex-nowrap'>
                              <div className='rounded-br-sm flightbg px-1'>
                                   <svg width="20" height="8" className="fill-gray-400">
                                    <path
                                        d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z"
                                        fillRule="nonzero"
                                    />
                                    </svg>
                              </div>
                              <div className='rounded-br-sm flightbg px-1'>
                                   <svg width="20" height="8" className="fill-gray-400">
                                    <path
                                        d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z"
                                        fillRule="nonzero"
                                    />
                                    </svg>
                              </div>
                         </div>

                    </div>
                </div>
                <div className='inline-flex'>
                   <svg
                        viewBox="0 0 339 434"
                        className="h-[485.7336px] transform -translate-x-[1px]"
                    >
                        <g fill="none" fillRule="evenodd">
                        <path
                            fill="#F7F7F7"
                            fillOpacity="0.01"
                            d="M1 99h338v236H1z"
                        />
                        <path
                            fill="#FFF"
                            d="M29.231 334.654c41.03 0 194.354-90.319 194.354-117.89 0-27.571-153.323-117.89-194.354-117.89H.585v235.779h28.646z"
                        />
                        <path
                            fill="#FFF"
                            d="M240.053 0h40.575L165.02 216.765C85.035 210.66 30.341 206.375.938 203.907c-.353 0 .078-38.786.112-38.786C42.456 148.36 112.098 97.091 209.976 11.314 218.298 4.021 228.987 0 240.053 0zM.585 229.62c1.119-.095 55.931-4.38 164.435-12.855L280.628 433.53h-40.606c-11.048 0-21.72-4.008-30.037-11.28C111.804 336.408 42.003 285.106.585 268.345c-.078 0 0-38.725 0-38.725z"
                        />
                        <path
                            fill="#FFF"
                            d="M71.164 224.371c57.898 0 226.577-1.925 226.577-7.606s-168.678-7.606-226.577-7.606c0 0-40.423 3.624-40.423 7.487 0 3.862 40.423 7.725 40.423 7.725z"
                        />
                        <path
                            fill="#FFF"
                            d="M71.164 224.371c57.898 0 226.577-1.925 226.577-7.606 0-.119-267-.119-267-.119 0 3.862 40.423 7.725 40.423 7.725z"
                        />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        
    </div>
    </div>
  )
}

export default UserSeatLayout
