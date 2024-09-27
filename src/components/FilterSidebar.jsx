import React from 'react';

const FilterSidebar = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Departure Date:</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Destination:</label>
        <select className="w-full p-2 border border-gray-300 rounded-md">
          <option value="">Select a Destination</option>
          <option value="NYC">New York City</option>
          <option value="LAX">Los Angeles</option>
          <option value="ORD">Chicago</option>
          <option value="IAH">Houston</option>
        </select>
      </div>
      <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
