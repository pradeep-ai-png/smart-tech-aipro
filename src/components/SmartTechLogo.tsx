import React, { useState } from "react";
import smartTechLogoImg from "../assets/smart_tech_logo.png";

interface SmartTechLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  isSpeaking?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  className?: string;
}

export const SmartTechLogo: React.FC<SmartTechLogoProps> = ({
  size = "md",
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  className = "",
}) => {
  // Try imported asset first, then fallback to public base path, then svg
  const [imgSrc, setImgSrc] = useState<string>(smartTechLogoImg);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (imgSrc === smartTechLogoImg) {
      // Try BASE_URL public file
      const publicBase = import.meta.env.BASE_URL || "/";
      const fallbackUrl = `${publicBase.endsWith("/") ? publicBase : publicBase + "/"}smart_tech_logo.png`;
      setImgSrc(fallbackUrl);
    } else if (imgSrc !== "/smart_tech_logo.png") {
      setImgSrc("/smart_tech_logo.png");
    } else {
      setImgError(true);
    }
  };

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-28 h-28 sm:w-32 sm:h-32",
    xl: "w-36 h-36 sm:w-44 sm:h-44",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* Outer audio pulse wave animations */}
      {isSpeaking && (
        <>
          <div className="absolute -inset-3 rounded-full bg-amber-400/20 animate-ping" />
          <div className="absolute -inset-6 rounded-full border border-amber-400/40 animate-pulse" />
        </>
      )}

      {isListening && (
        <>
          <div className="absolute -inset-3 rounded-full bg-emerald-400/25 animate-ping" />
          <div className="absolute -inset-5 rounded-full border border-emerald-400/50 animate-pulse" />
        </>
      )}

      {isThinking && (
        <div className="absolute -inset-2 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      )}

      {/* Main Logo Container */}
      <div
        className={`relative ${currentSize} rounded-full overflow-hidden shadow-2xl transition-transform duration-300 ${
          isSpeaking
            ? "scale-105 ring-4 ring-amber-400/80 shadow-amber-500/40"
            : isListening
            ? "scale-105 ring-4 ring-emerald-400/80 shadow-emerald-500/40"
            : "ring-2 ring-amber-500/50 shadow-black/60"
        }`}
      >
        {!imgError ? (
          <img
            src={imgSrc}
            alt="Smart Tech Computer Education Logo"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
        ) : (
          /* High-Fidelity SVG Fallback with the ST Monogram and Gold/Blue ring */
          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center border-2 border-amber-400/80 rounded-full p-2 relative">
            <div className="absolute inset-1 rounded-full border border-amber-500/40" />
            <div className="relative z-10 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-amber-400 drop-shadow-md">
                S
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-blue-500 drop-shadow-md -ml-1">
                T
              </span>
            </div>
            <span className="text-[9px] font-bold tracking-wider text-amber-300 uppercase mt-0.5">
              Smart Tech
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
