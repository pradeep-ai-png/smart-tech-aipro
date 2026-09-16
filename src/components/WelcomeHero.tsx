import React from "react";
import { Sparkles, Code2, Volume2, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useAuth } from "../context/AuthContext";
import { SmartTechLogo } from "./SmartTechLogo";

interface WelcomeHeroProps {
  onQuickPrompt: (promptText: string) => void;
  onOpenVoicePanel: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onQuickPrompt, onOpenVoicePanel }) => {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  const QUICK_PROMPTS = [
    {
      title: "HTML Button & Preview",
      desc: "Interactive button with CSS hover glow",
      prompt: "Create a modern animated HTML button with gradient colors and CSS hover effect.",
      badge: "HTML/CSS",
    },
    {
      title: "Tumhe kisne banaya?",
      desc: "Know the creator & owner",
      prompt: "Tumhe kisne banaya hai aur tumhara maalik kaun hai?",
      badge: "Identity",
    },
    {
      title: "Python Calculator",
      desc: "Clean functions with error handling",
      prompt: "Write a clean Python command line calculator with addition, subtraction, multiplication, and division.",
      badge: "Python",
    },
    {
      title: "Voice Assistant Guide",
      desc: "How line-by-line speech works",
      prompt: "Hello! Apne baare me batao aur tum kya kya kar sakte ho?",
      badge: "Voice",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Banner / Identity Glow */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-2xl overflow-hidden text-center">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-44 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-4">
            <SmartTechLogo size="lg" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-400 mb-3 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>OFFICIAL SMART TECH AI • SMART TECH TEAM • OWNER: PRADEEP SHAW</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight max-w-xl">
            Real-Time Voice & Intelligent Coding Assistant
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Fast, fluent line-by-line speech synthesis, dedicated code boxes with one-click copy, and interactive live HTML runner.
          </p>

          {/* First Page Google Login Card */}
          <div className="mt-6 w-full max-w-md p-4 rounded-2xl bg-slate-800/80 border border-amber-500/40 shadow-lg backdrop-blur-sm">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-left min-w-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Google User"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border-2 border-amber-400/80 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center font-bold">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-100 truncate">
                      Welcome, {user.displayName || "Smart Tech User"}!
                    </div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                      Google Account Connected
                    </div>
                  </div>
                </div>

                <GoogleAuthButton
                  user={user}
                  loading={loading}
                  onSignIn={signInWithGoogle}
                  onSignOut={signOutUser}
                  compact
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Sign in with Google to get started
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Firebase Authentication • Secure & Instant
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <GoogleAuthButton
                    user={user}
                    loading={loading}
                    onSignIn={signInWithGoogle}
                    onSignOut={signOutUser}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Feature Badges */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            <button
              onClick={onOpenVoicePanel}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Voice Pitch & Speed Controls</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Code Box & Copy</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Safe & Protected Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompt Cards */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
          <span>Popular Questions & Prompts</span>
          <span className="text-[10px] text-slate-500">Click to ask instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickPrompt(item.prompt)}
              className="group text-left p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-200 shadow-md hover:shadow-amber-500/5 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200 group-hover:text-amber-300 text-xs transition-colors">
                  {item.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-300 border border-slate-700 group-hover:border-amber-500/30 font-mono transition-colors">
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Ask now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
