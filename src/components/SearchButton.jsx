const SearchButton = ({ onClick, disabled }) => (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-800"
      >
        Search Flights
      </button>
    </div>
  );
  export default SearchButton