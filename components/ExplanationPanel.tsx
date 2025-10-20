"use client";

import { useState } from "react";
import { ttsService } from "@/lib/ttsService";

interface ExplanationPanelProps {
  explanation: string;
  actionTip: string;
  language: string;
}

export default function ExplanationPanel({
  explanation,
  actionTip,
  language,
}: ExplanationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlayVoice = async () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      const textToSpeak = `${explanation}\n\n${actionTip}`;
      await ttsService.speak(textToSpeak, { language });
      setIsPlaying(false);
    } catch (error) {
      console.error("TTS Error:", error);
      alert(
        "Voice playback failed. Your browser may not support this feature."
      );
      setIsPlaying(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    // For now, just use the same TTS
    // In production, you'd call a cloud TTS API here
    try {
      const textToSpeak = `${explanation}\n\n${actionTip}`;
      await ttsService.speak(textToSpeak, { language });
      alert(
        "Audio generated! (In production, this would create a downloadable MP3 file)"
      );
    } catch (error) {
      alert("Audio generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        💬 Simple Explanation
      </h2>

      {/* Explanation Text */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
          {explanation}
        </div>
      </div>

      {/* Action Tip */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-300">
        <div className="flex items-start">
          <span className="text-2xl mr-2">💡</span>
          <div>
            <div className="font-semibold text-green-800 mb-1">
              Quick Action:
            </div>
            <div className="text-gray-700">{actionTip}</div>
          </div>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlayVoice}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            isPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isPlaying ? "⏹️ Stop Voice" : "🔊 Play Voice"}
        </button>
        <button
          onClick={handleGenerateAudio}
          disabled={isGenerating}
          className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? "⏳ Generating..." : "🎵 Generate Audio"}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Voice playback uses your browser's built-in speech synthesis
      </div>
    </div>
  );
}
