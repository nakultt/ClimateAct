"use client";

interface ClimateCardProps {
  location: string;
  data: {
    temperature: {
      current: string;
      future: string;
      change: string;
    };
    hotDays: {
      count: number;
      description: string;
    };
    rainfall: {
      trend: string;
      current: string;
      future: string;
      change: string;
    };
  };
}

export default function ClimateCard({ location, data }: ClimateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🌡️ Climate Data: {location}
      </h2>

      {/* Temperature */}
      <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center mb-2">
          <span className="text-3xl mr-2">🌡️</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Temperature Trend
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="text-sm text-gray-600">Current (1990-2020)</div>
            <div className="text-2xl font-bold text-gray-800">
              {data.temperature.current}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Projected (2020-2030)</div>
            <div className="text-2xl font-bold text-orange-600">
              {data.temperature.future}
            </div>
          </div>
        </div>
        <div className="mt-3 p-2 bg-orange-100 rounded text-center">
          <span className="text-lg font-bold text-orange-700">
            Change: {data.temperature.change}
          </span>
        </div>
      </div>

      {/* Hot Days */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center mb-2">
          <span className="text-3xl mr-2">☀️</span>
          <h3 className="text-lg font-semibold text-gray-800">Hot Days</h3>
        </div>
        <div className="text-center mt-3">
          <div className="text-4xl font-bold text-red-600">
            {data.hotDays.count}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {data.hotDays.description}
          </div>
        </div>
      </div>

      {/* Rainfall */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center mb-2">
          <span className="text-3xl mr-2">🌧️</span>
          <h3 className="text-lg font-semibold text-gray-800">
            Rainfall Pattern
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <div className="text-sm text-gray-600">Current</div>
            <div className="text-xl font-bold text-gray-800">
              {data.rainfall.current}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Projected</div>
            <div className="text-xl font-bold text-blue-600">
              {data.rainfall.future}
            </div>
          </div>
        </div>
        <div className="mt-3 p-2 bg-blue-100 rounded text-center">
          <span className="text-sm font-semibold text-blue-700">
            Trend: {data.rainfall.trend.toUpperCase()}
          </span>
          <div className="text-xs text-blue-600 mt-1">
            {data.rainfall.change}
          </div>
        </div>
      </div>

      {/* Data Source */}
      <div className="text-xs text-gray-500 text-center mt-4 p-3 bg-gray-50 rounded">
        <div className="font-semibold mb-1">📊 Data Source</div>
        <div>Open-Meteo Climate API (CMIP6 Projections)</div>
        <div>Based on IPCC Climate Models</div>
      </div>
    </div>
  );
}
