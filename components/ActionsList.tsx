"use client";

import { Action } from "@/lib/actionEngine";

interface ActionsListProps {
  actions: Action[];
}

export default function ActionsList({ actions }: ActionsListProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      heat: "bg-orange-50 border-orange-200",
      water: "bg-blue-50 border-blue-200",
      energy: "bg-yellow-50 border-yellow-200",
      lifestyle: "bg-green-50 border-green-200",
      community: "bg-purple-50 border-purple-200",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-50 border-gray-200"
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return (
      badges[difficulty as keyof typeof badges] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ✅ Practical Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getCategoryColor(
              action.category
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start flex-1">
                <span className="text-3xl mr-3">{action.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    {action.description}
                  </p>
                  <div className="text-xs text-gray-500 italic">
                    {action.rationale}
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyBadge(
                  action.difficulty
                )}`}
              >
                {action.difficulty.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {actions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <div>No actions available. Please fetch climate data first.</div>
        </div>
      )}
    </div>
  );
}
