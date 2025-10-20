// API Route: Generate action recommendations
import { NextRequest, NextResponse } from "next/server";
import { generateActions, categorizeActions } from "@/lib/actionEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { climate_signals } = body;

    if (!climate_signals) {
      return NextResponse.json(
        { error: "Climate signals are required" },
        { status: 400 }
      );
    }

    const { hot_days_count, rainfall_trend, temperature_trend } =
      climate_signals;

    if (
      hot_days_count === undefined ||
      !rainfall_trend ||
      temperature_trend === undefined
    ) {
      return NextResponse.json(
        { error: "Invalid climate signals" },
        { status: 400 }
      );
    }

    // Generate actions
    const actions = generateActions({
      hot_days_count,
      rainfall_trend,
      temperature_trend,
    });

    // Categorize actions
    const categorized = categorizeActions(actions);

    return NextResponse.json({
      success: true,
      data: {
        actions,
        categorized,
      },
    });
  } catch (error: any) {
    console.error("Actions API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate actions" },
      { status: 500 }
    );
  }
}
