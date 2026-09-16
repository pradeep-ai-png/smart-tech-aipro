import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "../lib/firebase";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInQuickProfile: (customName?: string) => void;
  signOutUser: () => Promise<void>;
  error: string | null;
  errorCode: string | null;
  clearError: () => void;
  isInIframe: boolean;
}

const LOCAL_USER_KEY = "smart_tech_auth_user_v1";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => false,
  signInQuickProfile: () => {},
  signOutUser: async () => {},
  error: null,
  errorCode: null,
  clearError: () => {},
  isInIframe: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  // Detect iframe on mount
  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  // Sync with Firebase Auth and fallback to local saved user
  useEffect(() => {
    let isMounted = true;

    // Check if a user was previously persisted locally
    try {
      const savedUserStr = localStorage.getItem(LOCAL_USER_KEY);
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.uid) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read local user:", e);
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!isMounted) return;
        if (firebaseUser) {
          const appUser: AppUser = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Smart Tech User",
            email: firebaseUser.email || null,
            photoURL:
              firebaseUser.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                firebaseUser.displayName || "Smart Tech"
              )}&background=f59e0b&color=000`,
            providerId: "google.com",
          };
          setUser(appUser);
          try {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
          } catch {}
        }
        setLoading(false);
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err: any) {
      console.warn("Firebase Auth listener error:", err);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async (): Promise<boolean> => {
    setError(null);
    setErrorCode(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const appUser: AppUser = {
          uid: result.user.uid,
          displayName: result.user.displayName || "Smart Tech User",
          email: result.user.email || null,
          photoURL:
            result.user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              result.user.displayName || "Smart Tech"
            )}&background=f59e0b&color=000`,
          providerId: "google.com",
        };
        setUser(appUser);
        try {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(appUser));
        } catch {}
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn("Google sign-in caught exception:", err);
      const code = err.code || "unknown_error";
      setErrorCode(code);

      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completing.");
      } else if (code === "auth/unauthorized-domain") {
        setError(
          `Domain "${window.location.hostname}" is not authorized in Firebase Console. Please add it to Authentication > Settings > Authorized domains.`
        );
      } else if (code === "auth/popup-blocked") {
        setError(
          "The browser or iframe blocked the Google login popup. Please click 'Open in New Tab' or enable popups."
        );
      } else if (code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is not enabled in your Firebase Console. Go to Authentication > Sign-in method and enable Google."
        );
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
      return false;
    }
  };

  /**
   * Fast Quick-Login to ensure user is never blocked
   * Stores user profile with persistent UID so chat history works 100%!
   */
  const signInQuickProfile = (customName?: string) => {
    const name = customName?.trim() || "Pradeep Shaw";
    // Create stable UID based on name
    const stableUid = `user-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const profile: AppUser = {
      uid: stableUid,
      displayName: name,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@smarttech.edu`,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=f59e0b&color=000&bold=true`,
      providerId: "quick-profile",
    };
    setUser(profile);
    setError(null);
    setErrorCode(null);
    try {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  };

  const signOutUser = async () => {
    try {
      setError(null);
      setErrorCode(null);
      await signOut(auth);
    } catch (err) {
      console.warn("Sign out notice:", err);
    } finally {
      setUser(null);
      try {
        localStorage.removeItem(LOCAL_USER_KEY);
      } catch {}
    }
  };

  const clearError = () => {
    setError(null);
    setErrorCode(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInQuickProfile,
        signOutUser,
        error,
        errorCode,
        clearError,
        isInIframe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
