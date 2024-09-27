import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";

const PassengerSelector = () => {

  const{passengers,setPassengers}=useContext(AppContext)

  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const dropdownRef = useRef(null); // Ref to track the dropdown element
  const maxPassengers=9
  const totalPassengers = adultCount + childrenCount + infantCount;

  // Toggles the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Functions to increase and decrease passenger counts
  const increaseCount = (type) => {
    if (type === "adult") setAdultCount(adultCount + 1);
    if (type === "children") setChildrenCount(childrenCount + 1);
    if (type === "infant") setInfantCount(infantCount + 1);
  };

  const decreaseCount = (type) => {
    if (type === "adult" && adultCount > 1) setAdultCount(adultCount - 1);
    if (type === "children" && childrenCount > 0) setChildrenCount(childrenCount - 1);
    if (type === "infant" && infantCount > 0) setInfantCount(infantCount - 1);
  };

  // Close dropdown when clicking outside or clicking on the same component again
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPassengers({adults:adultCount,children:childrenCount,infants:infantCount})
        setIsDropdownOpen(false); // Close the dropdown if clicked outside
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [adultCount, childrenCount, infantCount, setPassengers]);

  return (
    <div className="relative z-10" ref={dropdownRef}>
      {/* Passenger Selector Button */}
      <div
        id="passenger-selector"
        className="flex gap-2 items-center border border-white p-2 rounded-md cursor-pointer"
        onClick={toggleDropdown}
      >
        <i className="fa-solid fa-user text-white"></i>
        <h1 className="text-white">{`Adult ${adultCount}${childrenCount>0 ? `, Children ${childrenCount}`  :''}${infantCount>0 ? `, Infant ${infantCount}`:""}`}</h1>
      </div>

      {/* Dropdown Content */}
      {isDropdownOpen && (
        <div className="absolute bg-gray-800 text-white mt-2 p-4 rounded-lg shadow-lg w-64">
          {/* Adult Section */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col">
            <span>Adult</span>
            <span className="text-sm opacity-40">12+ Years</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`${
                    adultCount === 1 ? "opacity-50" : "bg-gray-700"
                  } text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => decreaseCount("adult")
                }
                disabled={adultCount===1}
              >
                -
              </button>
              <span>{adultCount}</span>
              <button
                className={`${totalPassengers==maxPassengers ? 'opacity-50' : 'bg-gray-700'} text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => increaseCount("adult")}
                disabled={totalPassengers==maxPassengers}
              >
                +
              </button>
            </div>
          </div>

          {/* Children Section */}
          <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span>Children</span>
            <span className="text-sm opacity-40">2-12 Yrs</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`${
                    childrenCount === 0 ? "opacity-50" : "bg-gray-700"} text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => decreaseCount("children")}
                disabled={childrenCount===0}
              >
                -
              </button>
              <span>{childrenCount}</span>
              <button
                className={`${totalPassengers==maxPassengers ? 'opacity-50' : 'bg-gray-700'} text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => increaseCount("children")}
                disabled={totalPassengers==maxPassengers}
              >
                +
              </button>
            </div>
          </div>

          {/* Infant Section */}
          <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <span>Infant</span>
            <span className="text-sm opacity-40">Below 2 Yrs</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className={`${
                    infantCount === 0 ? "opacity-50" : "bg-gray-700"
                  } text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => decreaseCount("infant")}
                disabled={infantCount===0}
              >
                -
              </button>
              <span>{infantCount}</span>
              <button
                className={`${totalPassengers==maxPassengers ? 'opacity-50' : 'bg-gray-700'} text-white text-lg font-bold rounded-full w-4 h-4 flex items-center justify-center p-4`}
                onClick={() => increaseCount("infant")}
                disabled={totalPassengers==maxPassengers}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerSelector;
