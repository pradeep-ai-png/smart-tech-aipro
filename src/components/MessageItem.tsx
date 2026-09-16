import React, { useState } from "react";
import { Play, Square, Loader2, Copy, Check, User } from "lucide-react";
import { ChatMessage } from "../types";
import { SmartTechLogo } from "./SmartTechLogo";
import { CodeBox } from "./CodeBox";

interface MessageItemProps {
  message: ChatMessage;
  isPlayingThis: boolean;
  onPlayVoice: (message: ChatMessage) => void;
  onStopVoice: () => void;
  userPhotoURL?: string | null;
}

interface ContentSegment {
  type: "text" | "code";
  content: string;
  language?: string;
}

function parseSegments(text: string): ContentSegment[] {
  if (!text) return [];
  const segments: ContentSegment[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)(?:```|$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      if (plainText.trim()) {
        segments.push({ type: "text", content: plainText });
      }
    }

    const lang = match[1]?.trim() || "code";
    const code = match[2] || "";
    // Only treat as code block if there is content or closed tag
    if (code.length > 0 || match[0].includes("```")) {
      segments.push({
        type: "code",
        language: lang || "code",
        content: code,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const tailText = text.slice(lastIndex);
    if (tailText.trim()) {
      segments.push({ type: "text", content: tailText });
    }
  }

  if (segments.length === 0 && text.trim()) {
    segments.push({ type: "text", content: text });
  }

  return segments;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isPlayingThis,
  onPlayVoice,
  onStopVoice,
  userPhotoURL,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to highlight "Pradeep Shaw" if present in assistant text
  const renderFormattedText = (text: string) => {
    if (!isAssistant || !text.includes("Pradeep Shaw")) {
      return text;
    }

    const parts = text.split(/(Pradeep Shaw)/gi);
    return (
      <>
        {parts.map((part, index) => {
          if (part.toLowerCase() === "pradeep shaw") {
            return (
              <span
                key={index}
                className="font-semibold text-amber-300 bg-amber-950/70 border border-amber-600/50 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 mx-0.5 shadow-sm"
              >
                👑 {part}
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  const segments = isAssistant ? parseSegments(message.text) : [{ type: "text" as const, content: message.text }];

  return (
    <div
      id={`message-${message.id}`}
      className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} mb-4 transition-all`}
    >
      <div
        className={`flex items-end gap-2.5 max-w-[95%] sm:max-w-[85%] ${
          isAssistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Avatar */}
        {isAssistant ? (
          <div className="flex-shrink-0 mb-1">
            <SmartTechLogo size="sm" isSpeaking={isPlayingThis} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden bg-slate-700 text-slate-200 mb-1 border border-slate-600">
            {userPhotoURL ? (
              <img
                src={userPhotoURL}
                alt="User"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-4 h-4 text-slate-200" />
            )}
          </div>
        )}

        {/* Message Bubble Container */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all w-full ${
            isAssistant
              ? "bg-slate-800/95 text-slate-100 border border-slate-700/80 rounded-bl-sm"
              : "bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-br-sm shadow-amber-900/20"
          }`}
        >
          {/* Header metadata inside assistant card */}
          {isAssistant && (
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-700/50 text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400">Smart Tech AI</span>
              <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          )}

          {/* Message Content: Renders normal text + separate CodeBox */}
          <div className="space-y-2">
            {segments.map((seg, idx) => {
              const segKey = `${message.id}-seg-${idx}`;
              if (seg.type === "code") {
                return (
                  <CodeBox
                    key={segKey}
                    language={seg.language || "code"}
                    code={seg.content}
                  />
                );
              }
              return (
                <div key={segKey} className="whitespace-pre-wrap leading-6">
                  {renderFormattedText(seg.content)}
                </div>
              );
            })}
          </div>

          {/* Audio Action Footer for Assistant */}
          {isAssistant && (
            <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isPlayingThis ? (
                  <button
                    onClick={onStopVoice}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors font-medium"
                    title="Stop audio playback"
                  >
                    <Square className="w-3 h-3 fill-rose-300" />
                    <span>Stop</span>
                    <span className="flex gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-rose-400 animate-pulse rounded-full" />
                      <span className="w-1 h-3 bg-rose-400 animate-pulse delay-75 rounded-full" />
                      <span className="w-1 h-3 bg-rose-400 animate-pulse delay-150 rounded-full" />
                    </span>
                  </button>
                ) : message.isAudioLoading ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/60 text-amber-300 border border-slate-600 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Loading Voice...</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onPlayVoice(message)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25 transition-colors font-medium"
                    title="Speak message aloud in voice (skips code blocks)"
                  >
                    <Play className="w-3 h-3 fill-amber-300" />
                    <span>Speak Voice</span>
                  </button>
                )}
              </div>

              {/* Copy Full Message */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-slate-200 rounded transition-colors text-[11px] bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/50"
                title="Copy entire response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Message"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

