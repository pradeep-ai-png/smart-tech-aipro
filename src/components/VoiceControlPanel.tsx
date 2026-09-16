import React, { useState, useEffect } from "react";
import { Sliders, Volume2, VolumeX, Play, Square, RotateCcw, X, Check, User, Sparkles } from "lucide-react";
import { speechQueue, VOICE_PRESETS, VoicePresetConfig } from "../utils/speechQueue";

interface VoiceControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const VoiceControlPanel: React.FC<VoiceControlPanelProps> = ({
  isOpen,
  onClose,
  autoSpeak,
  onToggleAutoSpeak,
  isSpeaking,
  onStopSpeaking,
}) => {
  const [pitch, setPitchState] = useState(1.15);
  const [rate, setRateState] = useState(1.02);
  const [volume, setVolumeState] = useState(1.0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("hi-female-swara");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    const current = speechQueue.getSettings();
    setPitchState(current.pitch);
    setRateState(current.rate);
    setVolumeState(current.volume);
    setSelectedVoiceURI(current.voiceURI);
    if (current.presetId) {
      setSelectedPresetId(current.presetId);
    }

    const updateVoices = () => {
      const rawVoices = speechQueue.getAvailableVoices();
      // Deduplicate voices with identical voiceURI and language name
      const uniqueVoices: SpeechSynthesisVoice[] = [];
      const seen = new Set<string>();

      for (const v of rawVoices) {
        const identifier = `${v.voiceURI || v.name}___${v.lang}`;
        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueVoices.push(v);
        }
      }

      setAvailableVoices(uniqueVoices);
      if (!current.voiceURI && uniqueVoices.length > 0) {
        setSelectedVoiceURI(uniqueVoices[0].voiceURI);
      }
    };

    updateVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [isOpen]);

  const handleSelectPreset = (preset: VoicePresetConfig) => {
    setSelectedPresetId(preset.id);
    speechQueue.setVoicePreset(preset.id);
    const updated = speechQueue.getSettings();
    setPitchState(updated.pitch);
    setRateState(updated.rate);
    setSelectedVoiceURI(updated.voiceURI);
  };

  const handlePitchChange = (newPitch: number) => {
    setPitchState(newPitch);
    speechQueue.setPitch(newPitch);
  };

  const handleRateChange = (newRate: number) => {
    setRateState(newRate);
    speechQueue.setRate(newRate);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    speechQueue.setVolume(newVolume);
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    speechQueue.setVoiceURI(uri);
  };

  const handleResetDefaults = () => {
    handleSelectPreset(VOICE_PRESETS[0]);
    handleVolumeChange(1.0);
  };

  const handleTestVoice = (sampleText?: string) => {
    if (isSpeaking) {
      onStopSpeaking();
    }
    setIsTestingVoice(true);
    const text = sampleText || "Namaste! Main Smart Tech AI hoon. Main aapki padhai aur sawalon me madad ke liye taiyar hoon.";
    speechQueue.speakFull(text, {
      onEnd: () => {
        setIsTestingVoice(false);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-16 px-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto pb-10">
      <div
        className="w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden shadow-black/90 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                Smart Tech Voice Engine
                <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  Hindi & English
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Choose Male & Female Hindi voices with instant sentence speech</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Quick Voice Presets: Female & Male Hindi voices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Hindi Voice Profile (Male / Female)</span>
              </label>
              <span className="text-[10px] text-amber-400 font-medium">Click to activate</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VOICE_PRESETS.map((p) => {
                const isActive = selectedPresetId === p.id;
                const isFemale = p.gender === "Female";
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isActive
                        ? "bg-amber-500/20 border-amber-500/80 shadow-md shadow-amber-950/40 ring-1 ring-amber-400/50"
                        : "bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base" role="img" aria-label={p.gender}>
                        {isFemale ? "👩" : "👨"}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          isFemale
                            ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {p.gender}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{p.description}</div>
                    <div className="mt-1 text-[9px] text-amber-400 font-medium">{p.language}</div>

                    {isActive && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Voice Engine Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-300">Installed System Voice Engine</label>
              <span className="text-[10px] text-slate-500">
                {availableVoices.length > 0 ? `${availableVoices.length} voices ready` : "Auto-detecting"}
              </span>
            </div>
            <select
              value={selectedVoiceURI}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-500/60 transition-colors"
            >
              {availableVoices.length === 0 ? (
                <option key="default-system-voice" value="">
                  Default System Natural Voice
                </option>
              ) : (
                availableVoices.map((v, idx) => (
                  <option
                    key={`voice-opt-${idx}-${v.voiceURI || v.name}-${v.lang || ""}`}
                    value={v.voiceURI}
                  >
                    {v.name} {v.lang ? `(${v.lang})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Pitch Control Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">Voice Pitch (Sur / Tone)</label>
              <span className="font-mono text-amber-400 font-semibold">{pitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Deep Male (0.8x)</span>
              <span>Balanced (1.0x)</span>
              <span>Crisp Female (1.25x)</span>
            </div>
          </div>

          {/* Speed / Rate Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">Speaking Speed / Rate</label>
              <span className="font-mono text-amber-400 font-semibold">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.8"
              step="0.05"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Slow (0.8x)</span>
              <span>Natural (1.05x)</span>
              <span>Fast (1.4x)</span>
            </div>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-300">Volume</label>
              <span className="font-mono text-amber-400 font-semibold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Auto-Speak Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div>
              <div className="font-medium text-slate-200">Auto-Speak Live Streaming</div>
              <div className="text-[11px] text-slate-400">
                Speaks answers sentence-by-sentence in real time (never reads code blocks)
              </div>
            </div>
            <button
              onClick={onToggleAutoSpeak}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                autoSpeak
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "bg-slate-700/50 text-slate-400 border border-slate-700"
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeak ? "ON" : "OFF"}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => handleTestVoice()}
              disabled={isTestingVoice}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTestingVoice ? "Speaking sample..." : "Test Selected Voice"}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors font-medium"
                title="Stop Speech"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            )}

            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors font-medium"
              title="Reset to default voice settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-950/70 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5" /> Voice Ready: {VOICE_PRESETS.find((p) => p.id === selectedPresetId)?.name || "Swara"}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
