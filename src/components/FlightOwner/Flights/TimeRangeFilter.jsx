import React, { useState } from "react";

const TimeRangeFilter = ({ onFilterChange }) => {
  const [mode, setMode] = useState("TOTAL");
  const [unit, setUnit] = useState("DAYS");
  const [offset, setOffset] = useState(1);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificYear, setSpecificYear] = useState("");

  const handleApply = () => {
    let payload = {
      timeRange: mode,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      specificMonth: 0,
      specificYear: 0,
      offset: 0,
    };

    if (mode === "LAST" || mode === "PAST") {
      payload.timeRange = `${mode}X${unit}`;
      payload.offset = offset;
    }

    if (mode === "CUSTOM") {
      payload.timeRange = "CUSTOM";
      payload.startDate = new Date(customStart).toISOString();
      payload.endDate = new Date(customEnd).toISOString();
    }

    if (mode === "SPECIFIC_MONTH") {
      payload.timeRange = "SPECIFICMONTH";
      payload.specificMonth = parseInt(specificMonth);
      payload.specificYear = parseInt(specificYear);
    }

    if (mode === "SPECIFIC_YEAR") {
      payload.timeRange = "SPECIFICYEAR";
      payload.specificYear = parseInt(specificYear);
    }

    onFilterChange(payload);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", maxWidth: "400px" }}>
      <h3>Time Range Filter</h3>

      {/* Mode Selection */}
      <label>Mode:</label>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="TOTAL">Total</option>
        <option value="TODAY">Today</option>
        <option value="THIS_WEEK">This Week</option>
        <option value="THIS_MONTH">This Month</option>
        <option value="THIS_YEAR">This Year</option>
        <option value="LAST">Last X</option>
        <option value="PAST">Past X</option>
        <option value="SPECIFIC_MONTH">Specific Month</option>
        <option value="SPECIFIC_YEAR">Specific Year</option>
        <option value="CUSTOM">Custom Range</option>
      </select>

      {/* LAST / PAST inputs */}
      {(mode === "LAST" || mode === "PAST") && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="number"
            min="1"
            value={offset}
            onChange={(e) => setOffset(parseInt(e.target.value))}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="DAYS">Days</option>
            <option value="WEEKS">Weeks</option>
            <option value="MONTHS">Months</option>
            <option value="YEARS">Years</option>
          </select>
        </div>
      )}

      {/* Specific Month Picker */}
      {mode === "SPECIFIC_MONTH" && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="month"
            value={
              specificMonth && specificYear
                ? `${specificYear}-${String(specificMonth).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setSpecificYear(year);
              setSpecificMonth(month);
            }}
          />
        </div>
      )}

      {/* Specific Year Picker */}
      {mode === "SPECIFIC_YEAR" && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="number"
            min="2000"
            max="2100"
            value={specificYear}
            onChange={(e) => setSpecificYear(e.target.value)}
            placeholder="Enter year"
          />
        </div>
      )}

      {/* Custom range */}
      {mode === "CUSTOM" && (
        <div style={{ marginTop: "10px" }}>
          <label>Start Date:</label>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
        </div>
      )}

      <button style={{ marginTop: "10px" }} onClick={handleApply}>
        Apply Filter
      </button>
    </div>
  );
};

export default TimeRangeFilter;
