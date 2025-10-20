// Rule-based Action Recommendation Engine

interface ClimateSignals {
  hot_days_count: number;
  rainfall_trend: string;
  temperature_trend: number;
}

export interface Action {
  id: string;
  title: string;
  description: string;
  rationale: string;
  category: "heat" | "water" | "energy" | "lifestyle" | "community";
  icon: string;
  difficulty: "easy" | "medium" | "hard";
}

export function generateActions(signals: ClimateSignals): Action[] {
  const actions: Action[] = [];

  // Heat-related actions
  if (signals.hot_days_count > 50) {
    actions.push(
      {
        id: "heat-1",
        title: "Plant shade trees",
        description:
          "Plant native trees around your home to reduce heat and provide cooling shade.",
        rationale: `Triggered by: ${signals.hot_days_count} hot days (>35°C) expected per year`,
        category: "heat",
        icon: "🌳",
        difficulty: "medium",
      },
      {
        id: "heat-2",
        title: "Use light-colored roofing",
        description:
          "Paint roofs white or use reflective materials to reduce indoor heat.",
        rationale: `Triggered by: Temperature increase of ${signals.temperature_trend.toFixed(
          1
        )}°C`,
        category: "heat",
        icon: "🏠",
        difficulty: "hard",
      },
      {
        id: "heat-3",
        title: "Stay hydrated",
        description:
          "Drink more water during hot days and avoid peak sun hours (12-3 PM).",
        rationale: `Triggered by: ${signals.hot_days_count} hot days expected`,
        category: "heat",
        icon: "💧",
        difficulty: "easy",
      }
    );
  }

  if (signals.hot_days_count > 30) {
    actions.push({
      id: "heat-4",
      title: "Use fans instead of AC",
      description:
        "Use ceiling fans and cross-ventilation when possible to save energy.",
      rationale: "Triggered by: Increasing hot days",
      category: "energy",
      icon: "🌀",
      difficulty: "easy",
    });
  }

  // Water conservation actions
  if (signals.rainfall_trend === "decreasing") {
    actions.push(
      {
        id: "water-1",
        title: "Harvest rainwater",
        description:
          "Install rainwater harvesting system to collect and store monsoon water.",
        rationale: "Triggered by: Decreasing rainfall trend",
        category: "water",
        icon: "🌧️",
        difficulty: "hard",
      },
      {
        id: "water-2",
        title: "Fix water leaks",
        description:
          "Check and repair all taps, pipes, and toilets to stop water waste.",
        rationale: "Triggered by: Decreasing rainfall trend",
        category: "water",
        icon: "🔧",
        difficulty: "easy",
      },
      {
        id: "water-3",
        title: "Use drip irrigation",
        description:
          "If you have plants or a garden, use drip irrigation to save water.",
        rationale: "Triggered by: Water scarcity concerns",
        category: "water",
        icon: "🌱",
        difficulty: "medium",
      }
    );
  }

  // Flood preparedness
  if (signals.rainfall_trend === "increasing") {
    actions.push(
      {
        id: "water-4",
        title: "Clear drainage systems",
        description:
          "Keep drains and gutters clean to prevent waterlogging during heavy rains.",
        rationale: "Triggered by: Increasing rainfall trend",
        category: "water",
        icon: "🚰",
        difficulty: "easy",
      },
      {
        id: "water-5",
        title: "Prepare emergency kit",
        description:
          "Keep emergency supplies ready: torch, battery radio, first aid, water.",
        rationale: "Triggered by: Higher flood risk from increased rainfall",
        category: "lifestyle",
        icon: "🎒",
        difficulty: "easy",
      }
    );
  }

  // Energy efficiency (always relevant)
  if (signals.temperature_trend > 1) {
    actions.push(
      {
        id: "energy-1",
        title: "Switch to LED bulbs",
        description:
          "Replace all bulbs with LED lights to reduce electricity use and heat.",
        rationale: "Triggered by: Rising temperatures increasing energy demand",
        category: "energy",
        icon: "💡",
        difficulty: "easy",
      },
      {
        id: "energy-2",
        title: "Use solar power",
        description:
          "Consider installing solar panels for water heating or electricity.",
        rationale: "Triggered by: Need to reduce carbon emissions",
        category: "energy",
        icon: "☀️",
        difficulty: "hard",
      }
    );
  }

  // Lifestyle actions (always included)
  actions.push(
    {
      id: "lifestyle-1",
      title: "Reduce plastic use",
      description:
        "Carry reusable bags, bottles, and containers to reduce plastic waste.",
      rationale: "General climate action",
      category: "lifestyle",
      icon: "♻️",
      difficulty: "easy",
    },
    {
      id: "lifestyle-2",
      title: "Eat local and seasonal",
      description:
        "Buy locally grown seasonal fruits and vegetables to reduce food miles.",
      rationale: "General climate action",
      category: "lifestyle",
      icon: "🍎",
      difficulty: "easy",
    }
  );

  // Community actions
  actions.push({
    id: "community-1",
    title: "Join local climate groups",
    description:
      "Connect with community groups working on climate awareness and action.",
    rationale: "Collective action amplifies impact",
    category: "community",
    icon: "👥",
    difficulty: "easy",
  });

  // Return top 10 actions (prioritize by difficulty - easy first)
  return actions
    .sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    })
    .slice(0, 10);
}

export function categorizeActions(actions: Action[]): Record<string, Action[]> {
  return actions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, Action[]>);
}
