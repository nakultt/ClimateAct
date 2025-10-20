// Utility functions for the Climate Communication Platform

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृत" },
];

export const LITERACY_LEVELS = [
  {
    code: "child",
    name: "Child (5-10 years)",
    description: "Very simple words",
  },
  {
    code: "basic",
    name: "Basic (10-15 years)",
    description: "Simple explanations",
  },
  {
    code: "intermediate",
    name: "Intermediate (Adult)",
    description: "Standard language",
  },
  {
    code: "expert",
    name: "Expert (Professional)",
    description: "Technical terms",
  },
];

export const DEMO_CITIES = [
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lon: 78.1198 },
];

// LocalStorage helpers
export const storage = {
  setItem: (key: string, value: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  getItem: (key: string) => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Format temperature
export const formatTemperature = (temp: number): string => {
  return `${temp.toFixed(1)}°C`;
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calculate percentage change
export const calculatePercentageChange = (
  oldValue: number,
  newValue: number
): number => {
  return ((newValue - oldValue) / oldValue) * 100;
};

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get language name from code
export const getLanguageName = (code: string): string => {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.nativeName : "English";
};

// Get literacy level name from code
export const getLiteracyLevelName = (code: string): string => {
  const level = LITERACY_LEVELS.find((l) => l.code === code);
  return level ? level.name : "Intermediate";
};
