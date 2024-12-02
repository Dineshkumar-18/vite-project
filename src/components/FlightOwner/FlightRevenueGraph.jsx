import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FlightRevenueGraph = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Generate dummy data based on the selected period
  const getGraphData = () => {
    let labels = [];
    let data = [];
    const today = new Date();

    switch (selectedPeriod) {
      case "7days":
        for (let i = 6; i >= 0; i--) {
          let date = new Date(today);
          date.setDate(today.getDate() - i);
          labels.push(date.toLocaleDateString());
          data.push(Math.floor(Math.random() * 10000) + 5000); // Dummy revenue data
        }
        break;
      case "month":
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        for (let i = 11; i >= 0; i--) {
          labels.push(months[i]);
          data.push(Math.floor(Math.random() * 100000) + 50000); // Dummy revenue data
        }
        break;
      case "year":
        const years = ["2021", "2022", "2023", "2024"];
        for (let year of years) {
          labels.push(year);
          data.push(Math.floor(Math.random() * 1000000) + 500000); // Dummy revenue data
        }
        break;
      default:
        break;
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Revenue",
          data: data,
          borderColor: "#6366F1",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-lg font-semibold mb-4">Flight Revenue Over Time</h3>
      <div className="flex justify-between mb-4">
        <div className="text-md font-semibold">Revenue Data</div>
        <select
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="bg-gray-100 text-sm p-2 rounded-md border border-gray-300"
        >
          <option value="7days">Last 7 Days</option>
          <option value="month">Month-wise</option>
          <option value="year">Year-wise</option>
        </select>
      </div>
      {/* Container with fixed height */}
      <div style={{ position: 'relative', height: '350px' }}>
        <Line
          data={getGraphData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text:
                    selectedPeriod === "7days"
                      ? "Date"
                      : selectedPeriod === "month"
                      ? "Month"
                      : "Year",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Revenue (₹)",
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `$${tooltipItem.raw.toLocaleString()}`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default FlightRevenueGraph;
