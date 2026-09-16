import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Code2,
  Volume2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { SmartTechLogo } from "./SmartTechLogo";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const {
    signInWithGoogle,
    signInQuickProfile,
    error,
    clearError,
  } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [customName, setCustomName] = useState("Pradeep Shaw");
  const [showQuickLogin, setShowQuickLogin] = useState(false);

  const handleGoogleClick = async () => {
    setIsSigningIn(true);
    clearError();
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-5 py-4 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <SmartTechLogo size="sm" />
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              Smart Tech
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-1.5 py-0.5 rounded">
                AI
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Computer Education</div>
          </div>
        </div>

        <div className="text-[11px] font-medium text-amber-400/90 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Smart Tech Team</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Subtle card top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

          {/* Central Logo & Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 relative">
              <SmartTechLogo size="lg" />
              <div className="absolute -inset-1 rounded-full bg-amber-500/20 blur-sm -z-10 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-400 mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL SMART TECH GATEWAY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to Smart Tech AI
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm">
              Smart Tech Team ka intelligent voice & coding assistant • Owner: Pradeep Shaw
            </p>
          </div>

          {/* Clean User-Facing Notice if Auth encounter issue */}
          {error && (
            <div className="mt-5 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-rose-300">Sign-in Notice</div>
                <div className="text-[11px] text-rose-200/90 leading-relaxed mt-0.5">
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Actions Container */}
          <div className="mt-6 space-y-3">
            {/* Primary Google Sign In Button */}
            <button
              id="main-google-login-btn"
              onClick={handleGoogleClick}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all duration-200 shadow-lg shadow-black/40 hover:shadow-xl active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed group border border-slate-200"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isSigningIn ? "Signing in with Google..." : "Continue with Google"}</span>
            </button>

            {/* Direct / Instant Access Option */}
            <div className="pt-2">
              {!showQuickLogin ? (
                <button
                  onClick={() => setShowQuickLogin(true)}
                  className="w-full text-center text-xs text-slate-400 hover:text-amber-400 transition-colors py-1.5 flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Instant Access / Profile Login</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2.5 animate-in fade-in duration-200">
                  <div className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                    <span>Quick Profile Login</span>
                    <span className="text-[10px] text-amber-400">Owner & Student Access</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Enter name (e.g. Pradeep Shaw)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => signInQuickProfile(customName)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-semibold transition-all active:scale-95"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Feature Highlights Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Real-Time Voice</div>
              <div className="text-[11px] text-slate-500">Sentence speech synthesis</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <Code2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Code Box & Runner</div>
              <div className="text-[11px] text-slate-500">Interactive live HTML sandbox</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-200">Per-User History</div>
              <div className="text-[11px] text-slate-500">Saved to your account</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
