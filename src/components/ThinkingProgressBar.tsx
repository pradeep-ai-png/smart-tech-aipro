import React from "react";
import { Sparkles, Square } from "lucide-react";

interface ThinkingProgressBarProps {
  isLoading: boolean;
  statusText?: string;
  onStop?: () => void;
}

export const ThinkingProgressBar: React.FC<ThinkingProgressBarProps> = ({
  isLoading,
  statusText = "Smart Tech AI is thinking...",
  onStop,
}) => {
  return (
    <div
      id="thinking-progress-container"
      className={`relative w-full z-20 transition-all duration-300 ease-in-out ${
        isLoading ? "opacity-100 max-h-12" : "opacity-0 max-h-0 pointer-events-none overflow-hidden"
      }`}
    >
      {/* Subtle Progress Track at the very top */}
      <div
        className="w-full h-0.5 sm:h-1 bg-slate-900/90 overflow-hidden relative border-b border-amber-500/20"
        role="progressbar"
        aria-busy={isLoading}
        aria-label="AI thinking progress"
      >
        {/* Animated glowing indeterminate bar */}
        <div className="absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 rounded-full animate-thinking-bar shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
      </div>

      {/* Subtle Status Line */}
      {isLoading && (
        <div className="flex items-center justify-between px-3 sm:px-6 py-1 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-medium text-slate-200 tracking-wide text-[11px] sm:text-xs">
              {statusText}
            </span>
          </div>

          {onStop && (
            <button
              id="stop-generation-btn"
              onClick={onStop}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 rounded border border-slate-800 hover:border-rose-800/60 transition-colors"
              title="Stop generating"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              <span>Stop</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
