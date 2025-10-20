"use client";

import { useState } from "react";
import { DEMO_CITIES } from "@/lib/utils";
import axios from "axios";

interface LocationInputProps {
  onLocationSelect: (location: {
    name: string;
    city: string;
    state: string;
    lat: number;
    lon: number;
  }) => void;
}

export default function LocationInput({
  onLocationSelect,
}: LocationInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError("");

    try {
      const response = await axios.get(
        `/api/geocode?city=${encodeURIComponent(searchQuery)}`
      );

      if (response.data.success && response.data.data.length > 0) {
        setSearchResults(response.data.data);
      } else {
        setError("No locations found. Try another search.");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Failed to search location. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `/api/geocode?lat=${latitude}&lon=${longitude}`
          );

          if (response.data.success) {
            onLocationSelect({
              name: response.data.data.name,
              city: response.data.data.city,
              state: response.data.data.state,
              lat: latitude,
              lon: longitude,
            });
          }
        } catch (err) {
          setError("Failed to get location details");
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        setError("Unable to detect location. Please search manually.");
        setIsDetecting(false);
      }
    );
  };

  const handleSelectLocation = (location: any) => {
    onLocationSelect({
      name: location.name,
      city: location.city,
      state: location.state,
      lat: location.latitude,
      lon: location.longitude,
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleDemoCity = (city: (typeof DEMO_CITIES)[0]) => {
    onLocationSelect({
      name: `${city.name}, ${city.state}`,
      city: city.name,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📍 Select Location
      </h2>

      {/* Auto-detect */}
      <button
        onClick={handleDetectLocation}
        disabled={isDetecting}
        className="w-full mb-4 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isDetecting ? "🔍 Detecting..." : "📍 Use My Current Location"}
      </button>

      <div className="text-center text-gray-500 mb-4">OR</div>

      {/* Manual Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search city (e.g., Chennai, Delhi)"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(result)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-800">{result.city}</div>
              <div className="text-sm text-gray-500">{result.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Demo Cities */}
      <div>
        <div className="text-sm text-gray-600 mb-2">
          Quick Select (Tamil Nadu):
        </div>
        <div className="flex gap-2 flex-wrap">
          {DEMO_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleDemoCity(city)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
