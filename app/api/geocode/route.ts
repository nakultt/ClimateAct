// API Route: Geocoding service using Nominatim
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    // Forward geocoding (city name to coordinates)
    if (city) {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: city,
            format: "json",
            limit: 5,
            addressdetails: 1,
          },
          headers: {
            "User-Agent": "ClimateCommApp/1.0",
          },
        }
      );

      const results = response.data.map((item: any) => ({
        name: item.display_name,
        city:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          "",
        state: item.address?.state || "",
        country: item.address?.country || "",
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));

      return NextResponse.json({
        success: true,
        data: results,
      });
    }

    // Reverse geocoding (coordinates to city name)
    if (lat && lon) {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/reverse",
        {
          params: {
            lat,
            lon,
            format: "json",
            addressdetails: 1,
          },
          headers: {
            "User-Agent": "ClimateCommApp/1.0",
          },
        }
      );

      const data = response.data;

      return NextResponse.json({
        success: true,
        data: {
          name: data.display_name,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
      });
    }

    return NextResponse.json(
      { error: "Either city or coordinates required" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Geocode API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to geocode location" },
      { status: 500 }
    );
  }
}
