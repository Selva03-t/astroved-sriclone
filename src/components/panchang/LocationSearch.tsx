import React, { useState, useEffect, useRef } from "react";

export const CITIES = [
  { name: "New Delhi, Delhi, India", lat: 28.6139, lon: 77.2090 },
  { name: "Mumbai, Maharashtra, India", lat: 19.0760, lon: 72.8777 },
  { name: "Bengaluru, Karnataka, India", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai, Tamil Nadu, India", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata, West Bengal, India", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad, Telangana, India", lat: 17.3850, lon: 78.4867 },
  { name: "Pune, Maharashtra, India", lat: 18.5204, lon: 73.8567 },
  { name: "Ahmedabad, Gujarat, India", lat: 23.0225, lon: 72.5714 },
  { name: "Jaipur, Rajasthan, India", lat: 26.9124, lon: 75.7873 },
  { name: "Surat, Gujarat, India", lat: 21.1702, lon: 72.8311 },
  { name: "Lucknow, Uttar Pradesh, India", lat: 26.8467, lon: 80.9462 },
  { name: "Kanpur, Uttar Pradesh, India", lat: 26.4499, lon: 80.3319 },
  { name: "Nagpur, Maharashtra, India", lat: 21.1458, lon: 79.0882 },
  { name: "Patna, Bihar, India", lat: 25.5941, lon: 85.1376 },
  { name: "Indore, Madhya Pradesh, India", lat: 22.7196, lon: 75.8577 },
  { name: "Thane, Maharashtra, India", lat: 19.2183, lon: 72.9781 },
  { name: "Bhopal, Madhya Pradesh, India", lat: 23.2599, lon: 77.4126 },
  { name: "Visakhapatnam, Andhra Pradesh, India", lat: 17.6868, lon: 83.2185 },
  { name: "Vadodara, Gujarat, India", lat: 22.3072, lon: 73.1812 },
  { name: "Varanasi, Uttar Pradesh, India", lat: 25.3176, lon: 82.9739 },
];

interface LocationSearchProps {
  onSelectLocation: (city: { name: string; lat: number; lon: number }) => void;
}

export default function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("Varanasi, Uttar Pradesh, India");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset to a valid city name if not matched exactly, for simplicity just let it be
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div className="flex items-center gap-2 w-full">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          className="bg-transparent text-[14px] font-medium text-gray-700 outline-none w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search location..."
        />
      </div>

      {isOpen && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, idx) => (
              <li
                key={idx}
                className="px-4 py-2 text-[14px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchTerm(city.name);
                  setIsOpen(false);
                  onSelectLocation(city);
                }}
              >
                {city.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-[14px] font-medium text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
