"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ClimateChartProps {
  type: "temperature" | "rainfall";
  data: {
    signals: {
      avg_temp_current: number;
      avg_temp_future: number;
      avg_rainfall_current: number;
      avg_rainfall_future: number;
      temperature_trend: number;
      rainfall_trend: string;
    };
  };
  location: string;
}

export default function ClimateChart({
  type,
  data,
  location,
}: ClimateChartProps) {
  if (type === "temperature") {
    // Temperature trend data
    const tempData = [
      {
        period: "1990-2000",
        temperature: data.signals.avg_temp_current - 0.3,
        label: "Historical",
      },
      {
        period: "2000-2010",
        temperature: data.signals.avg_temp_current - 0.1,
        label: "Historical",
      },
      {
        period: "2010-2020",
        temperature: data.signals.avg_temp_current,
        label: "Historical",
      },
      {
        period: "2020-2025",
        temperature:
          data.signals.avg_temp_current + data.signals.temperature_trend / 2,
        label: "Projected",
      },
      {
        period: "2025-2030",
        temperature: data.signals.avg_temp_future,
        label: "Projected",
      },
    ];

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📈 Temperature Trend - {location}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)}°C`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: "#f97316", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-orange-50 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Temperature Change:</span>
            <span className="font-bold text-orange-600">
              +{data.signals.temperature_trend.toFixed(1)}°C by 2030
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Rainfall data
  const rainfallData = [
    {
      period: "1990-2000",
      rainfall: data.signals.avg_rainfall_current * 0.95,
      label: "Historical",
    },
    {
      period: "2000-2010",
      rainfall: data.signals.avg_rainfall_current * 0.98,
      label: "Historical",
    },
    {
      period: "2010-2020",
      rainfall: data.signals.avg_rainfall_current,
      label: "Historical",
    },
    {
      period: "2020-2025",
      rainfall:
        (data.signals.avg_rainfall_current + data.signals.avg_rainfall_future) /
        2,
      label: "Projected",
    },
    {
      period: "2025-2030",
      rainfall: data.signals.avg_rainfall_future,
      label: "Projected",
    },
  ];

  const rainfallChange =
    ((data.signals.avg_rainfall_future - data.signals.avg_rainfall_current) /
      data.signals.avg_rainfall_current) *
    100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        🌧️ Rainfall Pattern - {location}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rainfallData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis
            label={{
              value: "Rainfall (mm/year)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(0)} mm`}
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          />
          <Legend />
          <Bar dataKey="rainfall" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Rainfall Trend:</span>
          <span
            className={`font-bold ${
              rainfallChange > 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {rainfallChange > 0 ? "+" : ""}
            {rainfallChange.toFixed(1)}% ({data.signals.rainfall_trend})
          </span>
        </div>
      </div>
    </div>
  );
}
