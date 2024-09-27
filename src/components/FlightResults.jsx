import { useLocation } from 'react-router-dom';
import ScrollableDateRange from './ScrollableDateRange';
import FilterSidebar from './FilterSidebar';
import FlightTable from './FlightTable';
import SearchInput from './SearchInput';
import SearchFlights from './SearchFlights';

const FlightResults = () => {
  const location = useLocation();
  const { flightData } = location.state || {};

  console.log(flightData.outboundFlights)

  return (
    <div className="container mx-auto px-2">
      <SearchFlights/>  
      <SearchInput/>    
      <div className="grid grid-cols-6">
        {/* Sidebar for filters */}
        <aside className="col-span-1 p-4 bg-secondary">
          <FilterSidebar />
        </aside>
        {/* Main content area for flight schedule */}
        <main className="col-span-5">
          <ScrollableDateRange />
          <FlightTable flightData={flightData}/>
        </main>
      </div>
    </div>
  );
};

export default FlightResults;
