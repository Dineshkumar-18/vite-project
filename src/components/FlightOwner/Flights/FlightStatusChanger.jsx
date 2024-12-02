import { useEffect, useState } from "react";
import { FaInfoCircle, FaChevronDown, FaTimes, FaTimesCircle } from "react-icons/fa";
import { capitalizeOnlyFirstLetter } from "../../capitalizeOnlyFirstLetter";
import { getStatusColor } from "../../flightStatusColor";

// Define status options
const STATUS_OPTIONS = ["Scheduled", "Arrived", "Delayed", "Cancelled"];

const FlightStatusChanger = ({ schedule, onChangeStatus }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [previousStatus, setPreviousStatus] = useState("");
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("");
    const [isErrorVisible, setErrorVisible] = useState(false);


    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);


    useEffect(() => {
        if (schedule && schedule.flightStatus) {
            setPreviousStatus(capitalizeOnlyFirstLetter(schedule.flightStatus));
        }
    }, [schedule]);

    const handleStatusChange = (newStatus) => {
        

       console.log(previousStatus,newStatus)

        if(previousStatus==newStatus)
        {
            setDropdownOpen(false);
            return;
        }

        setCurrentStatus(newStatus)
        setDropdownOpen(false);
        setPopupOpen(true); 
    };

    const confirmStatusChange = () => {
        setPopupOpen(false);
        onChangeStatus(currentStatus); // Callback to change the status
    };

    const cancelStatusChange = () => {
        setPopupOpen(false);
        setCurrentStatus('');
    };
    const handleDisabledClick = () => {
        setErrorVisible(true);
    };

    const showError = () => {
        setErrorVisible(true);
    };

    const closeError = () => {
        setErrorVisible(false);
    };

    return (
        <div className="space-y-4">
            {/* Use DetailItem without modification */}
            {/* Change Status Button */}
            <div className="relative w-full">
            <button
                    onClick={capitalizeOnlyFirstLetter(schedule.flightStatus) === "Cancelled" ? showError : toggleDropdown}
                    className={`py-2 px-3 ${
                        capitalizeOnlyFirstLetter(schedule.flightStatus) === "Cancelled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-400"
                    } text-white rounded-lg flex items-center gap-5`}
                >
                    <span className="text-lg">Change Flight Status</span>
                    <FaChevronDown />
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 ${getStatusColor(status)} ${
                                    status === previousStatus ? "font-bold text-black bg-blue-400/40" : ""
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-5">
                        <h3 className="text-lg font-semibold">
                            Are you sure you want to change the flight status?
                        </h3>
                        <p className="text-gray-600">
                            <strong>Note: </strong> {previousStatus} → {currentStatus}
                        </p>
                        <div className="flex justify-center gap-4 mt-5">
                            <button
                                className="bg-green-600 hover:bg-green-500 text-white  py-3 px-8 rounded"
                                onClick={confirmStatusChange}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-500 text-white  py-3 px-8 rounded"
                                onClick={cancelStatusChange}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {isErrorVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center relative space-y-4">
                    <FaTimesCircle className="text-red-600 text-6xl mx-auto" />
                        <div className="flex justify-end absolute right-5 top-2">
                            <button onClick={closeError} className="text-gray-400 hover:text-gray-600 right-0">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold text-red-600">
                            Cannot change status after cancellation!
                        </h3>
                        <p className="text-gray-600">
                            The flight is marked as "Cancelled" and its status cannot be updated.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightStatusChanger;
