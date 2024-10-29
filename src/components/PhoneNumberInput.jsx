import React, { useEffect, useState } from 'react';

const countries = [
  { code: '+1', name: 'USA', minLength: 10, maxLength: 10 },
  { code: '+44', name: 'UK', minLength: 10, maxLength: 10 },
  { code: '+91', name: 'India', minLength: 10, maxLength: 10 },
  { code: '+49', name: 'Germany', minLength: 10, maxLength: 11 },
  { code: '+33', name: 'France', minLength: 9, maxLength: 10 },
  { code: '+81', name: 'Japan', minLength: 10, maxLength: 11 },
  { code: '+61', name: 'Australia', minLength: 9, maxLength: 10 },
  { code: '+55', name: 'Brazil', minLength: 10, maxLength: 11 },
  { code: '+86', name: 'China', minLength: 11, maxLength: 11 },
  { code: '+7', name: 'Russia', minLength: 10, maxLength: 15 },
];

const PhoneNumberInput = ({ value, onChange, styles = {}, errorMessage }) => {
  const [phoneNumber, setPhoneNumber] = useState(value.phoneNumber || '');
  const [countryCode, setCountryCode] = useState(value.countryCode || countries[0].code);
  const [error, setError] = useState('');


    useEffect(() => {
      const timer = setTimeout(() => {
        validatePhoneNumber();
      }, 1000); 
  
      return () => clearTimeout(timer); // Clear timeout on each keystroke
    }, [phoneNumber, countryCode]);
  

  useEffect(() => {
    setPhoneNumber(value.phoneNumber || '');
    setCountryCode(value.countryCode || countries[0].code);
  }, [value]);

  const validatePhoneNumber = () => {
    const selectedCountry = countries.find((country) => country.code === countryCode);
    if (
      phoneNumber.length < selectedCountry.minLength ||
      phoneNumber.length > selectedCountry.maxLength
    ) {
      const errorMsg = `Phone number must be between ${selectedCountry.minLength} and ${selectedCountry.maxLength} digits.`;
      setError(errorMsg);
      errorMessage({phoneNumber: errorMsg});

      return false;
    }
    setError('');
    errorMessage('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name,value)

    if (name === 'phoneNumber') {
        setPhoneNumber(value);
        onChange({ phoneNumber: value, countryCode });
      
    } else if (name === 'countryCode') {
      setCountryCode(value);
      onChange({ phoneNumber, countryCode: value });
    }
  };

  return (
    <div className={`flex space-x-2 ${styles.container}`}>
      <select
        name="countryCode"
        value={countryCode}
        onChange={handleChange}
        className={`border-gray-300 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${styles.select}`}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.code} {country.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
        className={`w-full border-gray-300 border rounded-lg p-3 focus:outline-none ${error ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'} ${styles.input}`}
      />
    </div>
  );
};

export default PhoneNumberInput;
