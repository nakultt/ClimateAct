// Text-to-Speech Service using Web Speech API

interface TTSOptions {
  language: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  getVoiceForLanguage(languageCode: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();

    // Map language codes to voice language codes
    const languageMap: { [key: string]: string[] } = {
      en: ["en-IN", "en-US", "en-GB", "en"],
      hi: ["hi-IN", "hi"],
      ta: ["ta-IN", "ta"],
      te: ["te-IN", "te"],
      bn: ["bn-IN", "bn-BD", "bn"],
      mr: ["mr-IN", "mr"],
      gu: ["gu-IN", "gu"],
      kn: ["kn-IN", "kn"],
      ml: ["ml-IN", "ml"],
      pa: ["pa-IN", "pa"],
      or: ["or-IN", "or"],
      as: ["as-IN", "as"],
      ur: ["ur-IN", "ur-PK", "ur"],
      sa: ["sa-IN", "sa"],
    };

    const targetLangs = languageMap[languageCode] || ["en-IN", "en"];

    // Try to find a voice that matches the language
    for (const targetLang of targetLangs) {
      const voice = voices.find((v) => v.lang.startsWith(targetLang));
      if (voice) return voice;
    }

    // Fallback to first available voice
    return voices[0] || null;
  }

  speak(text: string, options: TTSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      this.utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      const voice = this.getVoiceForLanguage(options.language);
      if (voice) {
        this.utterance.voice = voice;
      }

      // Set language
      const langMap: { [key: string]: string } = {
        en: "en-IN",
        hi: "hi-IN",
        ta: "ta-IN",
        te: "te-IN",
        bn: "bn-IN",
        mr: "mr-IN",
        gu: "gu-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        pa: "pa-IN",
        or: "or-IN",
        as: "as-IN",
        ur: "ur-IN",
        sa: "sa-IN",
      };

      this.utterance.lang = langMap[options.language] || "en-IN";
      this.utterance.rate = options.rate || 1;
      this.utterance.pitch = options.pitch || 1;
      this.utterance.volume = options.volume || 1;

      this.utterance.onend = () => resolve();
      this.utterance.onerror = (error) => reject(error);

      this.synth.speak(this.utterance);
    });
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

// Export singleton instance
export const ttsService = new TTSService();

// Helper function for easy use
export function speakText(
  text: string,
  language: string = "en"
): Promise<void> {
  return ttsService.speak(text, { language });
}

// Wait for voices to load (they load asynchronously)
export function waitForVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length > 0) {
      resolve();
      return;
    }

    // Wait for voices to load
    synth.onvoiceschanged = () => {
      resolve();
    };

    // Timeout after 2 seconds
    setTimeout(() => resolve(), 2000);
  });
}
