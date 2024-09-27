import { createContext, useState } from "react";

export const AppContext=createContext()

export const AppProvider=({children})=>
{
    const [fromLocation,setFromLocation]=useState("")
    const [toLocation,setToLocation]=useState("")

    const [tripType,setTripType]=useState("Oneway-trip")
    const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  })
   const [Class,setClass]=useState("Economy")
   const [departureDate,setDepartureDate]=useState("")
   const [returnDate,setReturnDate]=useState("")

    const value = {
        fromLocation,
        setFromLocation,
        toLocation,
        setToLocation,
        tripType,
        setTripType,
        passengers,
        setPassengers,
        departureDate,
        setDepartureDate,
        returnDate,
        setReturnDate,
        Class,
        setClass
      };
 return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

