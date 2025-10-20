"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage, getLanguageName, getLiteracyLevelName } from "@/lib/utils";
import LocationInput from "@/components/LocationInput";
import ClimateCard from "@/components/ClimateCard";
import ExplanationPanel from "@/components/ExplanationPanel";
import ActionsList from "@/components/ActionsList";
import ClimateChart from "@/components/ClimateChart";
import axios from "axios";
import { Action } from "@/lib/actionEngine";

export default function Dashboard() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [literacyLevel, setLiteracyLevel] = useState("intermediate");
  const [location, setLocation] = useState<any>(null);
  const [climateData, setClimateData] = useState<any>(null);
  const [explanation, setExplanation] = useState("");
  const [actionTip, setActionTip] = useState("");
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user has onboarded
    const hasOnboarded = storage.getItem("hasOnboarded");
    if (!hasOnboarded) {
      router.push("/");
      return;
    }

    // Load preferences
    const savedLanguage = storage.getItem("language");
    const savedLiteracy = storage.getItem("literacyLevel");

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedLiteracy) setLiteracyLevel(savedLiteracy);
  }, [router]);

  const handleLocationSelect = (loc: any) => {
    setLocation(loc);
    setClimateData(null);
    setExplanation("");
    setActionTip("");
    setActions([]);
    setError("");
  };

  const handleFetchClimateData = async () => {
    if (!location) return;

    setIsLoading(true);
    setError("");

    try {
      // Step 1: Fetch climate data
      const climateResponse = await axios.post("/api/climate", {
        latitude: location.lat,
        longitude: location.lon,
      });

      if (!climateResponse.data.success) {
        throw new Error("Failed to fetch climate data");
      }

      const climate = climateResponse.data.data;
      setClimateData(climate);

      // Step 2: Get LLM explanation
      const explainResponse = await axios.post("/api/explain", {
        climate_data: climate.signals,
        language,
        literacy_level: literacyLevel,
        location: location.city || location.name,
      });

      if (!explainResponse.data.success) {
        throw new Error("Failed to generate explanation");
      }

      setExplanation(explainResponse.data.data.simplified_text);
      setActionTip(explainResponse.data.data.action_tip);

      // Step 3: Generate actions
      const actionsResponse = await axios.post("/api/actions", {
        climate_signals: climate.signals,
      });

      if (!actionsResponse.data.success) {
        throw new Error("Failed to generate actions");
      }

      setActions(actionsResponse.data.data.actions);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    storage.removeItem("hasOnboarded");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 p-4">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              🌍 Climate Dashboard
            </h1>
            <p className="text-gray-600">
              {location
                ? `Showing data for: ${location.city || location.name}`
                : "Select your location to get started"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="text-sm">
              <span className="font-semibold">Language:</span>{" "}
              {getLanguageName(language)}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Level:</span>{" "}
              {getLiteracyLevelName(literacyLevel)}
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
            >
              Change Settings
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Location Input */}
        {!location && (
          <div className="mb-6">
            <LocationInput onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {/* Get Climate Data Button */}
        {location && !climateData && (
          <div className="mb-6 text-center">
            <button
              onClick={handleFetchClimateData}
              disabled={isLoading}
              className="px-8 py-4 bg-linear-to-r from-blue-500 to-green-500 text-white rounded-lg font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "🔄 Loading Climate Data..." : "📊 Get Climate Data"}
            </button>
            <button
              onClick={() => handleLocationSelect(null)}
              className="ml-4 px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Change Location
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Main Content */}
        {climateData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Explanation */}
            <div>
              <ExplanationPanel
                explanation={explanation}
                actionTip={actionTip}
                language={language}
              />
            </div>

            {/* Right: Climate Card */}
            <div>
              <ClimateCard
                location={location.city || location.name}
                data={climateData.formatted}
              />
            </div>
          </div>
        )}

        {/* Climate Charts */}
        {climateData && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Visual Trends
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClimateChart
                type="temperature"
                data={climateData}
                location={location.city || location.name}
              />
              <ClimateChart
                type="rainfall"
                data={climateData}
                location={location.city || location.name}
              />
            </div>
          </div>
        )}

        {/* Actions List */}
        {actions.length > 0 && (
          <div className="mb-6">
            <ActionsList actions={actions} />
          </div>
        )}
      </div>
    </div>
  );
}
