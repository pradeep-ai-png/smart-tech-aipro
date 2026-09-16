import React, { useState } from "react";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { AppUser } from "../context/AuthContext";

interface GoogleAuthButtonProps {
  user: AppUser | null;
  loading: boolean;
  onSignIn: () => Promise<any>;
  onSignOut: () => Promise<any>;
  compact?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  loading,
  onSignIn,
  onSignOut,
  compact = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignInClick = async () => {
    try {
      setIsProcessing(true);
      await onSignIn();
    } catch (err) {
      console.warn("Google sign-in action notice:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOutClick = async () => {
    try {
      setIsProcessing(true);
      setShowMenu(false);
      await onSignOut();
    } catch (err) {
      console.warn("Sign out notice:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Google 4-color "G" logo SVG
  const GoogleGLogo = () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
  );

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span className="hidden sm:inline">Auth...</span>
      </div>
    );
  }

  // If user is signed in
  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-xs text-slate-200 transition-all shadow-sm"
          title={`Signed in as ${user.displayName || user.email}`}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-[10px]">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
            </div>
          )}

          <span className="hidden sm:inline font-medium max-w-[90px] truncate text-slate-200">
            {user.displayName ? user.displayName.split(" ")[0] : "User"}
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-2.5 pb-2.5 mb-2 border-b border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-amber-400/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-100 truncate text-sm">
                    {user.displayName || "Smart Tech User"}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user.email || "Google Account"}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 mb-2.5 px-1">
                Connected via Firebase Auth
              </div>

              <button
                onClick={handleSignOutClick}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors font-medium text-xs"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // If user is not signed in
  return (
    <button
      id="google-signin-btn"
      onClick={handleSignInClick}
      disabled={isProcessing}
      className={`flex items-center gap-2 py-1.5 px-3 rounded-xl font-medium text-xs transition-all shadow-sm ${
        compact
          ? "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200"
          : "bg-white hover:bg-slate-100 text-slate-800 active:scale-95 shadow-md shadow-black/20"
      }`}
      title="Sign in with Google via Firebase"
    >
      {isProcessing ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
      ) : (
        <GoogleGLogo />
      )}
      <span className="font-semibold text-slate-800">
        {isProcessing ? "Signing In..." : "Google Login"}
      </span>
    </button>
  );
};
