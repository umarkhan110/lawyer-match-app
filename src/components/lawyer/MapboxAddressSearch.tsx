import React, { useState } from 'react';
interface MapboxAddressSearchProps {
    setLocationInput: (data: any) => void;
  }
const MapboxAddressSearch: React.FC<MapboxAddressSearchProps> = ({setLocationInput}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxApiKey) {
  throw new Error('Mapbox API key is missing.');
}
const fetchSuggestions = async (searchText: string) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${mapboxApiKey}&autocomplete=true&limit=5`);
    
          if (!response.ok) {
            throw new Error(`Error fetching suggestions: ${response.statusText}`);
          }
    
          const data = await response.json();
          setSuggestions(data.features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelect = (place: any) => {
    const [lng, lat] = place.center;
    setSelectedLocation({ lat, lng });
    setQuery(place.place_name);
    setLocationInput({
        latitude: lat,
        longitude: lng,
        address: place.place_name
    })
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        placeholder="Search for an address..."
        className="p-2 border rounded w-full"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border rounded mt-2 shadow">
          {suggestions.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}

      {/* Selected Location
      {selectedLocation && (
        <div className="mt-4">
          <h3>Selected Location:</h3>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lng}</p>
        </div>
      )} */}
    </div>
  );
};

export default MapboxAddressSearch;
