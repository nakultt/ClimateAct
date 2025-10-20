"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, LITERACY_LEVELS, storage } from "@/lib/utils";

export default function Onboarding() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLiteracy, setSelectedLiteracy] = useState("intermediate");

  useEffect(() => {
    // Check if user has already onboarded
    const hasOnboarded = storage.getItem("hasOnboarded");
    if (hasOnboarded) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleContinue = () => {
    // Save preferences
    storage.setItem("language", selectedLanguage);
    storage.setItem("literacyLevel", selectedLiteracy);
    storage.setItem("hasOnboarded", true);

    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🌍 Climate Communication
          </h1>
          <p className="text-xl text-gray-600">
            Local climate facts → simple words → practical actions
          </p>
        </div>

        {/* Description */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Understand how climate change affects your local area with simple
            explanations in your language. Get practical actions you can take
            today to support sustainability.
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Select Your Language:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="font-semibold text-gray-800">
                  {lang.nativeName}
                </div>
                <div className="text-sm text-gray-500">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Literacy Level Selection */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Select Understanding Level:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LITERACY_LEVELS.map((level) => (
              <button
                key={level.code}
                onClick={() => setSelectedLiteracy(level.code)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLiteracy === level.code
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="font-semibold text-gray-800">{level.name}</div>
                <div className="text-sm text-gray-500">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-linear-to-r from-blue-500 to-green-500 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}
