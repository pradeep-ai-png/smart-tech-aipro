export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  audioBase64?: string;
  audioMimeType?: string;
  isAudioLoading?: boolean;
  audioError?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export type VoicePresetId =
  | "hi-female-swara"
  | "hi-female-pooja"
  | "hi-male-prabhat"
  | "hi-male-rohan"
  | "in-female-neerja"
  | "in-male-aakash";

export interface VoicePreset {
  id: VoicePresetId;
  name: string;
  gender: "Female" | "Male";
  language: "Hindi" | "Hinglish / Indian English";
  description: string;
  pitch: number;
  rate: number;
}

export type VoiceName = "Kore" | "Puck" | "Zephyr" | "Fenrir" | "Charon";

export interface VoiceOption {
  name: VoiceName;
  label: string;
  gender: "Female" | "Male" | "Neutral";
  description: string;
}

export interface OwnerProfile {
  center: string;
  owner: string;
  developer: string;
  team: string;
}
