import { useEffect, useState } from 'react';
import { INDONESIAN_CITIES } from '../../utils/loadCities';
import { MapPin } from 'lucide-react';

interface CityComboboxProps {
  value?: string;
  onChange: (val: string) => void;
}

const CityCombobox: React.FC<CityComboboxProps> = ({ value, onChange }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value && value !== query) setQuery(value);
  }, [value]);

  const filtered =
    query === ''
      ? []
      : INDONESIAN_CITIES.filter((city) =>
          city.toLowerCase().includes(query.toLowerCase())
        );

  const isExactMatch = INDONESIAN_CITIES.includes(query);

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setShowDropdown(false);
  };

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
          if (query) setShowDropdown(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            if (!isExactMatch) {
              setQuery('');
              onChange('');
            }
            setShowDropdown(false);
          }, 100);
        }}
        placeholder="Type your city"
        className="block w-full pl-10 sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2 bg-white shadow-none"
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-auto text-sm">
          {filtered.map((city) => (
            <li
              key={city}
              onMouseDown={() => handleSelect(city)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-100"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityCombobox;
