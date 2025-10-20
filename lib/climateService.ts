// Climate Data Service - Open-Meteo API Integration
import axios from "axios";

interface ClimateRawData {
  daily: {
    time: string[];
    temperature_2m_mean: number[];
    precipitation_sum: number[];
  };
}

interface ClimateSignals {
  temperature_trend: number;
  hot_days_count: number;
  rainfall_trend: string;
  avg_temp_current: number;
  avg_temp_future: number;
  avg_rainfall_current: number;
  avg_rainfall_future: number;
  raw_data: ClimateRawData;
}

export async function fetchClimateData(
  lat: number,
  lon: number
): Promise<ClimateSignals> {
  try {
    const response = await axios.get(
      "https://climate-api.open-meteo.com/v1/climate",
      {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: "1950-01-01",
          end_date: "2050-12-31",
          models: "MRI_AGCM3_2_S",
          daily: "temperature_2m_mean,precipitation_sum",
        },
      }
    );

    const rawData: ClimateRawData = response.data;
    const signals = computeSignals(rawData);

    return {
      ...signals,
      raw_data: rawData,
    };
  } catch (error) {
    console.error("Climate API Error:", error);
    throw new Error("Failed to fetch climate data. Please try again.");
  }
}

function computeSignals(
  data: ClimateRawData
): Omit<ClimateSignals, "raw_data"> {
  const { time, temperature_2m_mean, precipitation_sum } = data.daily;

  // Calculate baseline (1990-2020)
  const baselineStart = time.findIndex((t) => t.startsWith("1990"));
  const baselineEnd = time.findIndex((t) => t.startsWith("2020"));

  // Calculate future period (2020-2030)
  const futureStart = time.findIndex((t) => t.startsWith("2020"));
  const futureEnd = time.findIndex((t) => t.startsWith("2030"));

  // Average temperature for baseline
  const baselineTemps = temperature_2m_mean.slice(baselineStart, baselineEnd);
  const avg_temp_current = average(baselineTemps);

  // Average temperature for future
  const futureTemps = temperature_2m_mean.slice(futureStart, futureEnd);
  const avg_temp_future = average(futureTemps);

  // Temperature trend
  const temperature_trend = avg_temp_future - avg_temp_current;

  // Count hot days (>35°C) in future period
  const hot_days_count = futureTemps.filter((t) => t > 35).length / 10; // Average per year

  // Rainfall analysis
  const baselineRainfall = precipitation_sum.slice(baselineStart, baselineEnd);
  const futureRainfall = precipitation_sum.slice(futureStart, futureEnd);

  const avg_rainfall_current = average(baselineRainfall);
  const avg_rainfall_future = average(futureRainfall);

  const rainfallChange =
    ((avg_rainfall_future - avg_rainfall_current) / avg_rainfall_current) * 100;

  let rainfall_trend: string;
  if (rainfallChange > 5) {
    rainfall_trend = "increasing";
  } else if (rainfallChange < -5) {
    rainfall_trend = "decreasing";
  } else {
    rainfall_trend = "stable";
  }

  return {
    temperature_trend,
    hot_days_count: Math.round(hot_days_count),
    rainfall_trend,
    avg_temp_current,
    avg_temp_future,
    avg_rainfall_current,
    avg_rainfall_future,
  };
}

function average(arr: number[]): number {
  const validValues = arr.filter(
    (v) => v !== null && v !== undefined && !isNaN(v)
  );
  return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
}

export function formatClimateData(signals: ClimateSignals) {
  return {
    temperature: {
      current: `${signals.avg_temp_current.toFixed(1)}°C`,
      future: `${signals.avg_temp_future.toFixed(1)}°C`,
      change: `${
        signals.temperature_trend > 0 ? "+" : ""
      }${signals.temperature_trend.toFixed(1)}°C`,
    },
    hotDays: {
      count: signals.hot_days_count,
      description: `${signals.hot_days_count} days above 35°C per year`,
    },
    rainfall: {
      trend: signals.rainfall_trend,
      current: `${signals.avg_rainfall_current.toFixed(0)} mm/year`,
      future: `${signals.avg_rainfall_future.toFixed(0)} mm/year`,
      change:
        signals.rainfall_trend === "increasing"
          ? "More rainfall expected"
          : signals.rainfall_trend === "decreasing"
          ? "Less rainfall expected"
          : "Rainfall remains similar",
    },
  };
}
