import React, { useState } from "react";

const aircraftData = {
  Airbus: ["A318", "A319", "A320", "A321", "A330", "A340", "A350", "A380"],
  Boeing: ["737-700", "737-800", "737 MAX", "747-400", "747-8", "757", "767", "777", "787 Dreamliner"],
  Embraer: ["ERJ 135", "ERJ 145", "E170", "E175", "E190", "E195", "E175-E2", "E190-E2", "E195-E2"],
  Bombardier: ["CRJ200", "CRJ700", "CRJ900", "CRJ1000", "C Series (A220)"],
  Mitsubishi: ["SpaceJet MRJ70", "SpaceJet MRJ90"],
  Sukhoi: ["Superjet 100"],
};


const AircraftSelector = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState("Airbus");
  const [selectedAircraft, setSelectedAircraft] = useState("");

  const handleManufacturerChange = (e) => {
    setSelectedManufacturer(e.target.value);
    setSelectedAircraft(""); // Reset aircraft selection when manufacturer changes
  };

  const handleAircraftChange = (e) => {
    setSelectedAircraft(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Manufacturer Dropdown */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-700">Select Manufacturer:</label>
        <select
          className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500  rounded-lg p-3"
          value={selectedManufacturer}
          onChange={handleManufacturerChange}
        >
          <option value="" disabled>
            -- Select Manufacturer --
          </option>
          {Object.keys(aircraftData).map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </select>
      </div>

      {/* Aircraft Type Dropdown */}
    
        <div className="">
          <label className="block text-lg font-semibold mb-2 text-gray-700">Select Aircraft Type:</label>
          <select
           className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-3"
            value={selectedAircraft}
            onChange={handleAircraftChange}
          >
            <option value="" disabled>
              -- Select Aircraft Type --
            </option>
            {aircraftData[selectedManufacturer].map((aircraft) => (
              <option key={aircraft} value={aircraft}>
                {aircraft}
              </option>
            ))}
          </select>
        </div>

      {/* Display Selection */}
      
    </div>
  );
};

export default AircraftSelector;
