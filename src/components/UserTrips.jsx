import React, { useEffect, useState } from "react";
import TripBlock from "./TripBlock";
import axiosInstance from "../utils/axiosInstance";

const UserTrips = () => {
  const [trips, setTrips] = useState(null);
  const [status, setStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get(
          `booking/user/trips?status=${status.toUpperCase()}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`
        );
        setTrips(response.data);
        console.log(response.da)
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrips();
  }, [status, sortOrder, page, pageSize]);

  return (
    <div className="h-screen flex flex-col p-4">

      {/* ✅ Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-3">
          {["All", "Confirmed", "Cancelled"].map((item) => (
            <button
              key={item}
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`px-3 py-2 rounded 
              ${status === item ? "bg-blue-600 text-white" : "bg-gray-300"}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Sort order toggle */}
        <button
          className="p-2 border rounded"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆ ASC" : "⬇ DESC"}
        </button>
      </div>

      {/* ✅ Scrollable list area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-5">
        {trips?.items?.length > 0 ? (
          <div className="space-y-4">
            {trips.items.map((trip) => (
              <TripBlock key={trip.bookingId} trip={trip} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 pt-10">No trips found</p>
        )}
      </div>


      

      ✅ Pagination footer always at bottom
      {trips && (
        <div className="flex items-center justify-center gap-2 py-3">

          <button
            disabled={!trips.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border disabled:opacity-40"
          >
            ◀ Prev
          </button>

          {Array.from({ length: trips.totalPages || 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border 
              ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={!trips.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border disabled:opacity-40"
          >
            Next ▶
          </button>

          {/* Page size */}
          <select
            className="border p-1 ml-3"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      )}

    </div>
  );
};

export default UserTrips;
