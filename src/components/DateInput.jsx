const DateInput = ({ label, value, setValue, required }) => (
    <div className="w-full">
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border-2 rounded-md p-2 bg-secondary text-customColor border-customColor outline-none font-bold"
        required={required}
      />
    </div>
  );

  export default DateInput
  