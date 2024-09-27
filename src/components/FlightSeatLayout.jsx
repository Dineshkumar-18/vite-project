  import React, { useRef } from "react";



  // Function to generate column names (A, B, C, ...)

  
  const FlightSeatLayout = ({ classConfigs }) => {
    return (
      <div className="overflow-x-auto p-4 border bg-gray-50">
        <div className="inline-block">
          <table className="border-separate" style={{ borderSpacing: '10px' }}>
            <thead>
              <tr>
                <th></th>
                {/* Render column headers (A, B, C, ...) */}
                {classConfigs[0].columns.map((column, index) => (
                  <th key={index} className="text-center font-bold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classConfigs.map((classConfig, classIndex) =>
                classConfig.seatRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {/* Row numbers (1, 2, 3, ...) on the left */}
                    <td className="text-center font-bold">{row.row}</td>
                    {/* Render seats for each row */}
                    {classConfig.columns.map((column, columnIndex) => {
                      const seat = row.seats.find(
                        (seat) => seat.column === column
                      );
                      return seat ? (
                        <td
                          key={columnIndex}
                          onClick={() =>
                            alert(`Selected Seat: ${row.row}${column}`)
                          }
                          className={`w-12 h-12 bg-green-500 text-white text-center cursor-pointer`}
                        >
                          {`${row.row}${column}`}
                        </td>
                      ) : (
                        <td key={columnIndex} className="w-12 h-12"></td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  

  



  export default FlightSeatLayout