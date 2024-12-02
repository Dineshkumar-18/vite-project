export const getStatusColor = (status) => {
    switch (status) {
        case 'SCHEDULING_PROCESS': return 'text-yellow-500 ';
        case ('SCHEDULED' || 'Scheduled') : return 'text-green-500';
        case 'ONTIME': return 'text-blue-500';
        case 'DELAYED': return 'text-orange-500';
        case 'CANCELLED': return 'text-red-500';
        case 'BOARDING': return 'text-purple-500';
        case 'GATE_CLOSED': return 'text-gray-500';
        case 'DEPARTED': return 'text-teal-500';
        case 'IN_AIR': return 'text-indigo-500';
        case 'LANDED': return 'text-green-700';
        case 'ARRIVED' || 'Arrived': return 'text-green-600';
        case 'DIVERTED': return 'text-pink-500';
        default: return 'text-gray-500';
    }
};