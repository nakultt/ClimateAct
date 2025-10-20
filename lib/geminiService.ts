// Gemini 2.0 Flash API Service
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Use Gemini 2.0 Flash (latest model)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

interface ClimateData {
  location: string;
  temperature_trend: number;
  hot_days_count: number;
  rainfall_trend: string;
}

interface GeminiResponse {
  simplified_text: string;
  action_tip: string;
}

export async function callGemini(
  climateData: ClimateData,
  language: string,
  literacyLevel: string
): Promise<GeminiResponse> {
  const prompt = buildPrompt(climateData, language, literacyLevel);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the response to extract simplified text and action tip
    const parts = text.split("ACTION TIP:");
    const simplified_text = parts[0].replace("EXPLANATION:", "").trim();
    const action_tip = parts[1]
      ? parts[1].trim()
      : "Stay informed and take local action.";

    return {
      simplified_text,
      action_tip,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate explanation. Please try again.");
  }
}

function buildPrompt(
  data: ClimateData,
  language: string,
  literacyLevel: string
): string {
  const languageNames: { [key: string]: string } = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    bn: "Bengali",
    mr: "Marathi",
    gu: "Gujarati",
    kn: "Kannada",
    ml: "Malayalam",
    pa: "Punjabi",
    or: "Odia",
    as: "Assamese",
    ur: "Urdu",
    sa: "Sanskrit",
  };

  const literacyInstructions: { [key: string]: string } = {
    child:
      "Use very simple words like you are talking to a 5-10 year old child. Use examples like ice cream melting, playing outside in hot weather.",
    basic:
      "Use simple language for 10-15 year old students. Avoid technical terms. Use everyday examples.",
    intermediate:
      "Use standard language for adults. Some technical terms are okay but explain them simply.",
    expert:
      "Use professional language with technical and scientific terms. Provide detailed analysis.",
  };

  const targetLanguage = languageNames[language] || "English";
  const instruction =
    literacyInstructions[literacyLevel] || literacyInstructions.intermediate;

  return `You are a climate communication expert helping people understand local climate change impacts in India.

TASK: Explain the following climate data in ${targetLanguage} for someone at ${literacyLevel} literacy level.

CLIMATE DATA:
- Location: ${data.location}
- Temperature Trend: ${
    data.temperature_trend > 0 ? "+" : ""
  }${data.temperature_trend.toFixed(1)}°C change by 2030 compared to 1990-2020
- Hot Days (>35°C): ${data.hot_days_count} days per year by 2025-2030
- Rainfall Trend: ${data.rainfall_trend}

INSTRUCTIONS:
${instruction}

CULTURAL CONTEXT:
- Use examples relevant to Indian daily life (monsoons, festivals, farming, local foods)
- For Tamil Nadu: mention agriculture (rice, sugarcane), water management, coastal impacts if relevant
- Be culturally sensitive and encouraging
- Focus on practical, relatable impacts

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

EXPLANATION:
[Your simplified explanation here - 150-200 words maximum]

ACTION TIP:
[One practical action people can take right now - one sentence only]

IMPORTANT:
- Do NOT invent statistics
- Do NOT add extra data not provided
- Keep it encouraging and solution-oriented
- If language is not English, write the ENTIRE response in ${targetLanguage} including labels`;
}

export function buildSimplePrompt(text: string, language: string): string {
  return `Translate the following text to ${language}. Keep it simple and natural:\n\n${text}`;
}
