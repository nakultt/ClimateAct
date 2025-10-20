// API Route: Get LLM explanation from Gemini
import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/geminiService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { climate_data, language, literacy_level, location } = body;

    if (!climate_data || !language || !literacy_level || !location) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Call Gemini API
    const response = await callGemini(
      {
        location,
        temperature_trend: climate_data.temperature_trend,
        hot_days_count: climate_data.hot_days_count,
        rainfall_trend: climate_data.rainfall_trend,
      },
      language,
      literacy_level
    );

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Explain API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
