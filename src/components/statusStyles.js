export const getStatusStyles = (status) => {
    switch (status) {
        case "PENDING":
            return { bgColor: 'bg-yellow-700', textColor: 'text-yellow-100', text: 'Pending' };
        case "CONFIRMED":
            return { bgColor: 'bg-green-700', textColor: 'text-white', text: 'Confirmed' };
        case "CANCELLED":
            return { bgColor: 'bg-red-700', textColor: 'text-white', text: 'Cancelled' };
        case "PARTIALLY_CANCELLED":
            return { bgColor: 'bg-red-500', textColor: 'text-white', text: 'Partially Cancelled' };
        case "CANCELLED_BY_AIRLINE":
            return { bgColor: 'bg-red-700', textColor: 'text-white', text: 'Cancelled' };
        default:
            return { bgColor: 'bg-gray-700', textColor: 'text-gray-700', text: 'Unknown' };
    }
};
