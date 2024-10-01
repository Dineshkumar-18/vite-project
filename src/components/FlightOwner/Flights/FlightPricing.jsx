import React from "react";

const FlightPricing = ({ formData, handleInputChange, nextStep, prevStep }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Flight Pricing</h2>
      <div>
        <label className="block mb-2">Base Price</label>
        <input
          type="number"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Seasonal Multiplier</label>
        <input
          type="number"
          name="seasonalMultiplier"
          value={formData.seasonalMultiplier}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Demand Multiplier</label>
        <input
          type="number"
          name="demandMultiplier"
          value={formData.demandMultiplier}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Discount</label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlightPricing;
