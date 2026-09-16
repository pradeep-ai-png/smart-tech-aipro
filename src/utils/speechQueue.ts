/**
 * Real-time sentence-by-sentence Speech Synthesizer
 * 100% Unlimited, Free, Zero-latency browser speech synthesis
 * Speaks lines & sentences in real-time as they stream from the AI!
 * Automatically filters out code blocks so code is NEVER read aloud.
 * Accurately stops when speech finishes.
 */

export interface SpeechQueueCallbacks {
  onStart?: () => void;
  onSentence?: (sentence: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceURI: string;
  presetId?: string;
}

export interface VoicePresetConfig {
  id: string;
  name: string;
  label: string;
  gender: "Female" | "Male";
  language: "Hindi" | "Hinglish / Indian";
  pitch: number;
  rate: number;
  description: string;
  filterKeywords: string[];
}

export const VOICE_PRESETS: VoicePresetConfig[] = [
  {
    id: "hi-female-swara",
    name: "Swara",
    label: "Swara (Hindi Female - Soft & Natural)",
    gender: "Female",
    language: "Hindi",
    pitch: 1.15,
    rate: 1.02,
    description: "Natural soft Hindi female voice",
    filterKeywords: ["swara", "lekha", "google हिन्दी", "hindi", "kalpana", "female"],
  },
  {
    id: "hi-female-pooja",
    name: "Pooja",
    label: "Pooja (Hindi Female - Clear & Fast)",
    gender: "Female",
    language: "Hindi",
    pitch: 1.25,
    rate: 1.10,
    description: "Bright & articulate Hindi female voice",
    filterKeywords: ["pooja", "lekha", "swara", "hindi", "female"],
  },
  {
    id: "hi-female-kavita",
    name: "Kavita",
    label: "Kavita (Hindi Female - Sweet & Gentle)",
    gender: "Female",
    language: "Hindi",
    pitch: 1.18,
    rate: 0.98,
    description: "Polite, soothing & sweet Hindi female tone",
    filterKeywords: ["kavita", "kalpana", "veena", "hindi", "female"],
  },
  {
    id: "hi-female-ananya",
    name: "Ananya",
    label: "Ananya (Hindi Female - Modern Assistant)",
    gender: "Female",
    language: "Hindi",
    pitch: 1.22,
    rate: 1.06,
    description: "Modern, dynamic and fluent Hindi female voice",
    filterKeywords: ["ananya", "shruti", "swara", "hindi", "female"],
  },
  {
    id: "hi-male-prabhat",
    name: "Prabhat",
    label: "Prabhat (Hindi Male - Deep & Calm)",
    gender: "Male",
    language: "Hindi",
    pitch: 0.86,
    rate: 1.00,
    description: "Confident & warm Hindi male voice",
    filterKeywords: ["prabhat", "hemant", "ravi", "google हिन्दी", "hindi", "male"],
  },
  {
    id: "hi-male-rohan",
    name: "Rohan",
    label: "Rohan (Hindi Male - Energetic)",
    gender: "Male",
    language: "Hindi",
    pitch: 0.95,
    rate: 1.10,
    description: "Youthful & fast Hindi male voice",
    filterKeywords: ["rohan", "prabhat", "hindi", "india", "male"],
  },
  {
    id: "hi-male-dev",
    name: "Dev",
    label: "Dev (Hindi Male - Teacher & Mentor)",
    gender: "Male",
    language: "Hindi",
    pitch: 0.88,
    rate: 1.02,
    description: "Articulate, polite teacher voice for computer coaching",
    filterKeywords: ["dev", "kalyan", "hemant", "prabhat", "hindi", "male"],
  },
  {
    id: "hi-male-vikram",
    name: "Vikram",
    label: "Vikram (Hindi Male - Clear & Authoritative)",
    gender: "Male",
    language: "Hindi",
    pitch: 0.82,
    rate: 0.98,
    description: "Deep, authoritative and clear Hindi male voice",
    filterKeywords: ["vikram", "ravi", "prabhat", "hindi", "male"],
  },
  {
    id: "in-female-neerja",
    name: "Neerja",
    label: "Neerja (Indian Accent Female)",
    gender: "Female",
    language: "Hinglish / Indian",
    pitch: 1.12,
    rate: 1.05,
    description: "Fluent Indian English & Hinglish female",
    filterKeywords: ["neerja", "heera", "aditi", "india", "en-in", "female"],
  },
  {
    id: "in-male-aakash",
    name: "Aakash",
    label: "Aakash (Indian Accent Male)",
    gender: "Male",
    language: "Hinglish / Indian",
    pitch: 0.92,
    rate: 1.08,
    description: "Fluent Indian English & Hinglish male",
    filterKeywords: ["aakash", "prabhat", "ravi", "india", "en-in", "male"],
  },
];

class SpeechQueueManager {
  private queue: string[] = [];
  private isPlaying = false;
  private isStreamDone = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: SpeechQueueCallbacks = {};
  private resumeTimer: any = null;
  private watchdogTimer: any = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private processedLength = 0;

  // Configurable pitch, rate, volume
  private pitch = 1.15;
  private rate = 1.02;
  private volume = 1.0;
  private voiceURI = "";
  private presetId = "hi-female-swara";

  constructor() {
    try {
      this.loadSettings();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        this.initVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = () => this.initVoices();
        }
      }
    } catch (err) {
      console.warn("Speech synthesis initialization notice:", err);
    }
  }

  private loadSettings() {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("smart_tech_voice_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.pitch === "number") this.pitch = Math.max(0.5, Math.min(1.5, parsed.pitch));
        if (typeof parsed.rate === "number") this.rate = Math.max(0.7, Math.min(1.8, parsed.rate));
        if (typeof parsed.volume === "number") this.volume = Math.max(0, Math.min(1.0, parsed.volume));
        if (parsed.voiceURI) this.voiceURI = parsed.voiceURI;
        if (parsed.presetId) this.presetId = parsed.presetId;
      }
    } catch (e) {
      // ignore
    }
  }

  private saveSettings() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "smart_tech_voice_settings",
        JSON.stringify({
          pitch: this.pitch,
          rate: this.rate,
          volume: this.volume,
          voiceURI: this.voiceURI,
          presetId: this.presetId,
        })
      );
    } catch (e) {
      // ignore
    }
  }

  public getSettings(): VoiceSettings {
    return {
      pitch: this.pitch,
      rate: this.rate,
      volume: this.volume,
      voiceURI: this.voiceURI,
      presetId: this.presetId,
    };
  }

  public getPresetId(): string {
    return this.presetId;
  }

  public setVoicePreset(presetId: string) {
    const preset = VOICE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    this.presetId = preset.id;
    this.pitch = preset.pitch;
    this.rate = preset.rate;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        let matchedVoice: SpeechSynthesisVoice | undefined;
        for (const kw of preset.filterKeywords) {
          matchedVoice = voices.find(
            (v) =>
              v.name.toLowerCase().includes(kw) ||
              v.lang.toLowerCase().includes(kw)
          );
          if (matchedVoice) break;
        }

        if (!matchedVoice) {
          if (preset.language === "Hindi") {
            matchedVoice = voices.find((v) => v.lang.startsWith("hi"));
          } else {
            matchedVoice = voices.find((v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en"));
          }
        }

        if (matchedVoice) {
          this.selectedVoice = matchedVoice;
          this.voiceURI = matchedVoice.voiceURI;
        }
      }
    }

    this.saveSettings();
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(1.5, pitch));
    this.saveSettings();
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.7, Math.min(1.8, rate));
    this.saveSettings();
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1.0, volume));
    this.saveSettings();
  }

  public setVoiceURI(uri: string) {
    this.voiceURI = uri;
    this.saveSettings();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.voiceURI === uri);
      if (match) {
        this.selectedVoice = match;
      }
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
    return window.speechSynthesis.getVoices();
  }

  private initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    if (this.voiceURI) {
      const customMatch = voices.find((v) => v.voiceURI === this.voiceURI);
      if (customMatch) {
        this.selectedVoice = customMatch;
        return;
      }
    }

    // Prefer Hindi voice or Indian English voice for natural pronunciation
    const hindiVoice = voices.find(
      (v) =>
        v.lang.startsWith("hi") ||
        v.name.toLowerCase().includes("hindi") ||
        v.name.toLowerCase().includes("swara") ||
        v.name.toLowerCase().includes("lekha")
    );

    const indianEngVoice = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("heera") ||
        v.name.toLowerCase().includes("neerja") ||
        v.name.toLowerCase().includes("prabhat")
    );

    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("online"))
    );

    this.selectedVoice = hindiVoice || indianEngVoice || englishVoice || voices[0];
    if (this.selectedVoice && !this.voiceURI) {
      this.voiceURI = this.selectedVoice.voiceURI;
    }
  }

  public setCallbacks(cbs: SpeechQueueCallbacks) {
    this.callbacks = cbs;
  }

  /**
   * Reset tracking for a new streaming response
   */
  public resetStream() {
    this.stop();
    this.processedLength = 0;
    this.queue = [];
    this.isStreamDone = false;
  }

  /**
   * Strips all code blocks and syntax so that code is NEVER spoken out loud
   */
  private stripCodeForSpeech(text: string): string {
    // Strip completed code blocks ```lang ... ```
    let stripped = text.replace(/```[a-zA-Z0-9_-]*\n?[\s\S]*?```/g, " ");

    // Strip unclosed code block currently streaming
    stripped = stripped.replace(/```[\s\S]*$/g, "");

    // Strip inline code `...`
    stripped = stripped.replace(/`[^`\n]{1,120}`/g, " ");

    // Strip HTML tags like <div>, <p>, </html>
    stripped = stripped.replace(/<[^>]+>/g, " ");

    return stripped;
  }

  /**
   * Cleans text for natural speech reading
   */
  private cleanForSpeech(text: string): string {
    return text
      .replace(/[*_#`~[\]()]/g, " ")
      .replace(/https?:\/\/\S+/g, "link")
      .replace(/[<>{};=()[\]$#\/\\|]/g, " ")
      .replace(/[:\-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Called continuously as text streams in.
   * Extracts completed sentences and enqueues them for immediate speech!
   * Never speaks code blocks.
   */
  public feedStream(fullText: string, isFinal = false) {
    if (!("speechSynthesis" in window)) return;

    if (isFinal) {
      this.isStreamDone = true;
    }

    // Remove any code blocks so that code is NOT read out loud
    const speakableText = this.stripCodeForSpeech(fullText);

    const unprocessed = speakableText.slice(this.processedLength);
    if (!unprocessed && !isFinal) return;

    // Sentence break regex: matches . ! ? । or newlines followed by space or end
    const sentenceDelimiters = /([.?!।\n]+)(\s+|$)/g;

    let match: RegExpExecArray | null;
    let lastIndex = 0;

    while ((match = sentenceDelimiters.exec(unprocessed)) !== null) {
      const sentenceEnd = match.index + match[1].length;
      const sentence = unprocessed.slice(lastIndex, sentenceEnd).trim();

      if (sentence.length > 1) {
        const cleaned = this.cleanForSpeech(sentence);
        if (cleaned.length > 0) {
          this.enqueue(cleaned);
        }
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex > 0) {
      this.processedLength += lastIndex;
    }

    // If stream is finished, speak whatever remaining text is left
    if (isFinal) {
      const remaining = speakableText.slice(this.processedLength).trim();
      if (remaining.length > 0) {
        const cleaned = this.cleanForSpeech(remaining);
        if (cleaned.length > 0) {
          this.enqueue(cleaned);
        }
      }
      this.processedLength = speakableText.length;

      // If queue is already empty after finalization, trigger stop/onEnd cleanly
      if (this.queue.length === 0 && !this.currentUtterance) {
        this.finishSpeech();
      }
    }
  }

  /**
   * Add a sentence to the speak queue and start playing if not already
   */
  public enqueue(sentence: string) {
    if (!sentence || !sentence.trim()) return;
    this.queue.push(sentence);
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  /**
   * Speak a standalone full text
   */
  public speakFull(text: string, cbs?: SpeechQueueCallbacks) {
    if (cbs) this.callbacks = cbs;
    this.resetStream();
    this.feedStream(text, true);
  }

  private finishSpeech() {
    this.isPlaying = false;
    this.clearResumeTimer();
    this.clearWatchdog();
    this.currentUtterance = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    if (this.callbacks.onEnd) {
      this.callbacks.onEnd();
    }
  }

  private playNext() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (this.queue.length === 0) {
      // If the stream is finished, we are truly done!
      if (this.isStreamDone) {
        this.finishSpeech();
      } else {
        // Stream is still generating chunks, wait briefly
        this.isPlaying = false;
      }
      return;
    }

    const textToSpeak = this.queue.shift()!;
    this.isPlaying = true;

    if (!this.selectedVoice) {
      this.initVoices();
    }

    // Check if text has Devanagari Hindi characters
    const hasHindiChar = /[\u0900-\u097F]/.test(textToSpeak);
    const voices = window.speechSynthesis.getVoices();

    let voiceToUse = this.selectedVoice;
    const currentPreset = VOICE_PRESETS.find((p) => p.id === this.presetId);
    const targetGender = currentPreset?.gender;

    if (hasHindiChar) {
      if (!voiceToUse || !voiceToUse.lang.startsWith("hi")) {
        const hindiVoices = voices.filter(
          (v) => v.lang.startsWith("hi") || v.name.toLowerCase().includes("hindi")
        );
        if (hindiVoices.length > 0) {
          if (targetGender === "Male") {
            const maleHindi = hindiVoices.find((v) => {
              const n = v.name.toLowerCase();
              return n.includes("prabhat") || n.includes("hemant") || n.includes("male") || n.includes("ravi");
            });
            voiceToUse = maleHindi || hindiVoices[0];
          } else {
            const femaleHindi = hindiVoices.find((v) => {
              const n = v.name.toLowerCase();
              return n.includes("swara") || n.includes("lekha") || n.includes("kalpana") || n.includes("female") || n.includes("pooja");
            });
            voiceToUse = femaleHindi || hindiVoices[0];
          }
        }
      }
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang || (hasHindiChar ? "hi-IN" : "en-IN");
      } else {
        utterance.lang = hasHindiChar ? "hi-IN" : "en-IN";
      }

      utterance.rate = this.rate;
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      utterance.onstart = () => {
        if (this.callbacks.onStart) {
          this.callbacks.onStart();
        }
        if (this.callbacks.onSentence) {
          this.callbacks.onSentence(textToSpeak);
        }
      };

      utterance.onend = () => {
        this.clearWatchdog();
        this.currentUtterance = null;
        this.playNext();
      };

      utterance.onerror = (e) => {
        this.clearWatchdog();
        // Interrupted errors happen normally when canceled, don't trigger fatal error
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.warn("Speech synthesis notice:", e.error);
        }
        this.currentUtterance = null;
        this.playNext();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      this.startResumeTimer();
      this.startWatchdog();
    } catch (err) {
      console.warn("Speech playback error:", err);
      this.playNext();
    }
  }

  /**
   * Watchdog timer to prevent speech from hanging indefinitely on browser bug
   */
  private startWatchdog() {
    this.clearWatchdog();
    this.watchdogTimer = setTimeout(() => {
      if (this.isPlaying && this.currentUtterance) {
        console.warn("Speech utterance watchdog timeout, moving to next.");
        this.playNext();
      }
    }, 15000);
  }

  private clearWatchdog() {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  /**
   * Browser Chrome bug workaround: speechSynthesis can pause after 15 seconds
   */
  private startResumeTimer() {
    this.clearResumeTimer();
    this.resumeTimer = setInterval(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }

  private clearResumeTimer() {
    if (this.resumeTimer) {
      clearInterval(this.resumeTimer);
      this.resumeTimer = null;
    }
  }

  /**
   * Immediately cancel speech and clear pending queue
   */
  public stop() {
    this.queue = [];
    this.isPlaying = false;
    this.isStreamDone = true;
    this.clearResumeTimer();
    this.clearWatchdog();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.currentUtterance = null;
    if (this.callbacks.onEnd) {
      this.callbacks.onEnd();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isPlaying;
  }
}

export const speechQueue = new SpeechQueueManager();
