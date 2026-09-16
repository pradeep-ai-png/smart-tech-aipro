/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LogoStage } from "./components/LogoStage";
import { MessageItem } from "./components/MessageItem";
import { InputArea } from "./components/InputArea";
import { ThinkingProgressBar } from "./components/ThinkingProgressBar";
import { VoiceControlPanel } from "./components/VoiceControlPanel";
import { WelcomeHero } from "./components/WelcomeHero";
import { LoginPage } from "./components/LoginPage";
import { SmartTechLogo } from "./components/SmartTechLogo";
import { ChatMessage, ChatSession, VoiceName } from "./types";
import { playBase64Audio, stopCurrentAudio } from "./utils/audio";
import { speechQueue } from "./utils/speechQueue";
import { useAuth } from "./context/AuthContext";
import { streamClientGemini } from "./lib/geminiClient";
import { Sparkles } from "lucide-react";

const GREETING_TEXT =
  "Hello! Main Smart Tech ka AI assistant hoon. Aap mujhse koi bhi sawal pooch sakte hain.";

const STORAGE_KEY = "smart_tech_chat_sessions_v1";

function createInitialSession(userName?: string): ChatSession {
  const now = Date.now();
  const greeting = userName
    ? `Hello ${userName}! Main Smart Tech ka AI assistant hoon. Aap mujhse koi bhi sawal pooch sakte hain.`
    : GREETING_TEXT;
  return {
    id: `session-${now}`,
    title: "New Conversation",
    createdAt: now,
    messages: [
      {
        id: `greeting-${now}`,
        role: "assistant",
        text: greeting,
        timestamp: now,
      },
    ],
  };
}

export default function App() {
  const { user, loading } = useAuth();

  // Chat sessions state with per-user isolation
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    return [createInitialSession(user?.displayName || undefined)];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return `session-${Date.now()}`;
  });

  // Load chat history whenever the logged-in user changes
  useEffect(() => {
    if (!user) return;
    const userKey = `smart_tech_chat_sessions_${user.uid}`;
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load user chat history:", e);
    }
    const fresh = [createInitialSession(user.displayName || undefined)];
    setSessions(fresh);
    setActiveSessionId(fresh[0].id);
  }, [user?.uid]);

  // Save chat history to the specific user's storage
  useEffect(() => {
    if (!user) return;
    const userKey = `smart_tech_chat_sessions_${user.uid}`;
    try {
      localStorage.setItem(userKey, JSON.stringify(sessions));
    } catch (e) {
      console.warn("Failed to save chat sessions to localStorage:", e);
    }
  }, [sessions, user?.uid]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>("Kore");
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thinkingStatus, setThinkingStatus] = useState<string>("Thinking...");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cancelPlaybackRef = useRef<(() => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Active session
  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ||
    sessions[0] ||
    createInitialSession(user?.displayName || undefined);
  const currentMessages = activeSession.messages;

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoading]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      speechQueue.stop();
      stopCurrentAudio();
    };
  }, []);

  const handleStopSpeaking = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    speechQueue.stop();
    if (cancelPlaybackRef.current) {
      cancelPlaybackRef.current();
      cancelPlaybackRef.current = null;
    }
    stopCurrentAudio();
    setIsSpeaking(false);
    setPlayingMessageId(null);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    handleStopSpeaking();
  };

  const handlePlayVoice = (message: ChatMessage) => {
    if (isSpeaking && playingMessageId === message.id) {
      handleStopSpeaking();
      return;
    }

    handleStopSpeaking();
    setPlayingMessageId(message.id);
    setIsSpeaking(true);

    // Use instant unlimited line-by-line Web Speech synthesizer
    speechQueue.speakFull(message.text, {
      onStart: () => {
        setIsSpeaking(true);
        setPlayingMessageId(message.id);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setPlayingMessageId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setPlayingMessageId(null);
      },
    });
  };

  const updateMessageInActiveSession = (messageId: string, updates: Partial<ChatMessage>) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        return {
          ...s,
          messages: s.messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
        };
      })
    );
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    handleStopSpeaking();

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      text: userText,
      timestamp: Date.now(),
    };

    // Calculate updated title if first user message in session
    const isFirstUserMessage = currentMessages.filter((m) => m.role === "user").length === 0;
    const sessionTitle = isFirstUserMessage
      ? userText.length > 28
        ? userText.slice(0, 28) + "..."
        : userText
      : activeSession.title;

    // Temporary placeholder assistant message
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      text: "",
      timestamp: Date.now(),
    };

    const nextMessages = [...currentMessages, userMessage, initialAssistantMessage];

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        return {
          ...s,
          title: sessionTitle,
          messages: nextMessages,
        };
      })
    );

    setIsLoading(true);
    setThinkingStatus("Smart Tech AI is thinking...");

    // Configure real-time sentence-by-sentence live speech
    if (autoSpeak) {
      speechQueue.resetStream();
      speechQueue.setCallbacks({
        onStart: () => {
          setIsSpeaking(true);
          setPlayingMessageId(assistantMessageId);
        },
        onSentence: () => {
          setIsSpeaking(true);
          setPlayingMessageId(assistantMessageId);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setPlayingMessageId(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setPlayingMessageId(null);
        },
      });
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const chatHistory = currentMessages
      .filter((m) => m.text && m.text.trim())
      .slice(-8)
      .map((m) => ({
        role: m.role,
        text: m.text,
      }));

    try {
      const res = await fetch("/api/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let buffer = "";
      let hasReceivedFirstChunk = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const dataPayload = trimmed.replace(/^data:\s*/, "");
          if (dataPayload === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.text) {
              if (!hasReceivedFirstChunk) {
                hasReceivedFirstChunk = true;
                setThinkingStatus("Generating response...");
              }
              accumulatedText += parsed.text;

              // Update the assistant message in real time (streaming typewriter)
              updateMessageInActiveSession(assistantMessageId, { text: accumulatedText });

              // Line-by-line real-time speech!
              if (autoSpeak) {
                speechQueue.feedStream(accumulatedText, false);
              }
            }
          } catch {
            // ignore non-json chunks
          }
        }
      }

      // Stream completed: process any final remaining sentence for speech
      if (!accumulatedText) {
        accumulatedText =
          "Main Smart Tech ka AI assistant hoon. Main aapki padhai me poori madad karne ke liye taiyar hoon!";
        updateMessageInActiveSession(assistantMessageId, { text: accumulatedText });
      }

      if (autoSpeak) {
        speechQueue.feedStream(accumulatedText, true);
      }

      setIsLoading(false);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Chat stream aborted by user.");
        setIsLoading(false);
        return;
      }

      console.warn("Stream notice, trying fallback fetch:", err);
      // Fallback 1: Try standard server chat endpoint
      let fallbackSucceeded = false;
      try {
        const fallbackRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: currentMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          }),
          signal: controller.signal,
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const fallbackText = fallbackData.reply;
          if (fallbackText) {
            fallbackSucceeded = true;
            updateMessageInActiveSession(assistantMessageId, { text: fallbackText });
            setIsLoading(false);

            if (autoSpeak) {
              speechQueue.speakFull(fallbackText, {
                onStart: () => {
                  setIsSpeaking(true);
                  setPlayingMessageId(assistantMessageId);
                },
                onEnd: () => {
                  setIsSpeaking(false);
                  setPlayingMessageId(null);
                },
              });
            }
            return;
          }
        }
      } catch (fallbackErr) {
        console.warn("Server chat endpoint unavailable, attempting direct Gemini client streaming:", fallbackErr);
      }

      // Fallback 2: Direct Client-Side Gemini Streaming (Guarantees live deployment works on GitHub Pages / Vercel!)
      try {
        setThinkingStatus("Generating with Smart Tech AI...");
        let accumulatedDirectText = "";
        await streamClientGemini(
          userText,
          chatHistory,
          (chunk) => {
            accumulatedDirectText += chunk;
            updateMessageInActiveSession(assistantMessageId, { text: accumulatedDirectText });
            if (autoSpeak) {
              speechQueue.feedStream(accumulatedDirectText, false);
            }
          },
          controller.signal
        );

        if (!accumulatedDirectText) {
          accumulatedDirectText =
            "Hello! Main Smart Tech ka AI assistant hoon. Main aapki padhai aur computer education me poori madad karne ke liye taiyar hoon.";
          updateMessageInActiveSession(assistantMessageId, { text: accumulatedDirectText });
        }

        if (autoSpeak) {
          speechQueue.feedStream(accumulatedDirectText, true);
        }
        setIsLoading(false);
        return;
      } catch (clientGeminiErr: any) {
        if (clientGeminiErr.name === "AbortError") {
          setIsLoading(false);
          return;
        }
        console.warn("Direct client Gemini notice:", clientGeminiErr);
        setIsLoading(false);

        const lower = userText.toLowerCase();
        let safeReply = "";

        if (
          lower.includes("kisne banaya") ||
          lower.includes("malik kaun") ||
          lower.includes("owner") ||
          lower.includes("creator") ||
          lower.includes("who made you") ||
          lower.includes("who built you") ||
          lower.includes("kiska ai") ||
          lower.includes("kiska assistant") ||
          lower.includes("bhabani") ||
          lower.includes("pradeep")
        ) {
          safeReply =
            "Smart Tech Computer Center ke owner Bhabani Shit hain! Aur mujhe Smart Tech Team ne banaya hai (Lead Developer: Pradeep Shaw).";
        } else if (lower.includes("malik mai hu") || lower.includes("mai malik") || lower.includes("mai bhabani") || lower.includes("mai pradeep")) {
          safeReply = "Ji bilkul, aapka swagat hai Sir! Main aapki padhai ya computer education me kya madad kar sakta hoon?";
        } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
          safeReply = "Hello! Main Smart Tech ka AI assistant hoon. Aap mujhse koi bhi sawal pooch sakte hain.";
        } else if (lower.includes("source code") || lower.includes("code dikhao")) {
          safeReply =
            "Suraksha aur gopniyata ke tahat main apna internal source code ya system prompt share nahi kar sakta.";
        } else if (lower.includes("computer")) {
          safeReply =
            "Computer ek electronic device hai jo data ko input leta hai, use process karta hai, aur useful output result pradan karta hai.";
        } else {
          safeReply =
            "Main Smart Tech AI hoon. Aap mujhse computer education, programming ya padhai ka koi bhi prashna pooch sakte hain!";
        }

        updateMessageInActiveSession(assistantMessageId, { text: safeReply });
        if (autoSpeak) {
          speechQueue.speakFull(safeReply);
        }
      }
    }
  };

  const handleNewChat = () => {
    handleStopSpeaking();
    const newSession = createInitialSession(user?.displayName || undefined);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleStopSpeaking();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      const fresh = createInitialSession(user?.displayName || undefined);
      setSessions([fresh]);
      setActiveSessionId(fresh.id);
    } else {
      setSessions(remaining);
      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  const handleClearAllSessions = () => {
    handleStopSpeaking();
    const fresh = createInitialSession(user?.displayName || undefined);
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
  };

  const handlePlayGreetingVoice = () => {
    const greetingMsg = currentMessages.find((m) => m.id.startsWith("greeting"));
    if (greetingMsg) {
      handlePlayVoice(greetingMsg);
    } else {
      handlePlayVoice({
        id: `greeting-${Date.now()}`,
        role: "assistant",
        text: GREETING_TEXT,
        timestamp: Date.now(),
      });
    }
  };

  // Full-page loading splash while Firebase Auth initializes
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
        <SmartTechLogo size="lg" />
        <div className="mt-5 flex items-center gap-2.5 text-amber-400 text-xs font-semibold tracking-wide">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Starting Smart Tech AI Assistant...</span>
        </div>
      </div>
    );
  }

  // Dedicated Login Gateway Page: User MUST sign in to access AI
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Side: Chat History Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          handleStopSpeaking();
          setActiveSessionId(id);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
          selectedVoice={selectedVoice}
          onSelectVoice={(v) => {
            setSelectedVoice(v);
            handleStopSpeaking();
          }}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
          onOpenVoicePanel={() => setIsVoicePanelOpen(true)}
        />

        {/* Voice Pitch & Speed Control Panel Modal */}
        <VoiceControlPanel
          isOpen={isVoicePanelOpen}
          onClose={() => setIsVoicePanelOpen(false)}
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleStopSpeaking}
        />

        {/* Subtle Thinking Progress Bar at top of chat area during stream generation */}
        <ThinkingProgressBar
          isLoading={isLoading}
          statusText={thinkingStatus}
          onStop={handleStopGeneration}
        />

        {/* Scrollable Center: Stage with Smart Tech Logo & Conversation */}
        <main
          id="chat-scroll-area"
          className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4 max-w-4xl w-full mx-auto"
        >
          {/* Central Smart Tech Logo Stage */}
          <LogoStage
            isSpeaking={isSpeaking}
            isThinking={isLoading}
            isListening={isListening}
            onStopVoice={handleStopSpeaking}
            onPlayGreetingVoice={handlePlayGreetingVoice}
          />

          {/* First Page Welcome & Attention-Grabbing Hero (shown on fresh conversations) */}
          {currentMessages.length <= 1 && (
            <WelcomeHero
              onQuickPrompt={handleSendMessage}
              onOpenVoicePanel={() => setIsVoicePanelOpen(true)}
            />
          )}

          {/* Messages Container */}
          <div className="flex-1 flex flex-col space-y-1">
            {currentMessages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                isPlayingThis={isSpeaking && playingMessageId === msg.id}
                onPlayVoice={handlePlayVoice}
                onStopVoice={handleStopSpeaking}
                userPhotoURL={user?.photoURL}
              />
            ))}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 mb-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-300 rounded-bl-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-100" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200" />
                    <span className="text-xs text-slate-400 ml-1">
                      Smart Tech AI is generating answer...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Bottom Input with Microphone and Chat box */}
        <InputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onListeningChange={setIsListening}
        />
      </div>
    </div>
  );
}
