// API Route: Fetch climate data from Open-Meteo
import { NextRequest, NextResponse } from "next/server";
import { fetchClimateData, formatClimateData } from "@/lib/climateService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Fetch climate data
    const climateData = await fetchClimateData(lat, lon);

    // Format for display
    const formatted = formatClimateData(climateData);

    return NextResponse.json({
      success: true,
      data: {
        signals: {
          temperature_trend: climateData.temperature_trend,
          hot_days_count: climateData.hot_days_count,
          rainfall_trend: climateData.rainfall_trend,
          avg_temp_current: climateData.avg_temp_current,
          avg_temp_future: climateData.avg_temp_future,
          avg_rainfall_current: climateData.avg_rainfall_current,
          avg_rainfall_future: climateData.avg_rainfall_future,
        },
        formatted,
      },
    });
  } catch (error: any) {
    console.error("Climate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch climate data" },
      { status: 500 }
    );
  }
}
