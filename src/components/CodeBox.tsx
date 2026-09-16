import React, { useState } from "react";
import { Copy, Check, Code2, Eye, EyeOff } from "lucide-react";

interface CodeBoxProps {
  language: string;
  code: string;
}

export const CodeBox: React.FC<CodeBoxProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const cleanLang = (language || "code").toLowerCase().trim();
  const isHtml = cleanLang === "html" || cleanLang === "xml";

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      id={`code-box-${cleanLang}-${Math.random().toString(36).substring(2, 7)}`}
      className="my-3 rounded-xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-lg text-slate-200"
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono uppercase font-bold tracking-wider text-[11px] text-amber-300">
            {cleanLang || "CODE"}
          </span>
          <span className="text-[10px] text-slate-500">({lines.length} lines)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Preview Toggle for HTML */}
          {isHtml && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
              title={showPreview ? "View Raw Code" : "Preview HTML Output"}
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-3 h-3 text-amber-400" />
                  <span>View Code</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span>Preview</span>
                </>
              )}
            </button>
          )}

          {/* Dedicated Copy Code Button */}
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              copied
                ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50"
                : "bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-slate-700/80 hover:border-amber-500/50"
            }`}
            title="Copy code only"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-amber-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body or Live HTML Preview */}
      {showPreview && isHtml ? (
        <div className="p-3 bg-white text-slate-900 rounded-b-xl min-h-[140px] max-h-[350px] overflow-auto">
          <iframe
            title="HTML Live Preview"
            srcDoc={code}
            sandbox="allow-scripts"
            className="w-full min-h-[200px] border-0 rounded"
          />
        </div>
      ) : (
        <div className="relative font-mono text-xs sm:text-[13px] leading-6 overflow-x-auto max-h-[420px] p-3 text-slate-200 bg-slate-950/90 selection:bg-amber-500/30">
          <div className="flex min-w-full">
            {/* Line numbers */}
            <div className="select-none text-slate-600 pr-4 text-right border-r border-slate-800/80 font-mono text-xs flex flex-col">
              {lines.map((_, i) => (
                <span key={i} className="leading-6">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Code text */}
            <pre className="pl-4 font-mono whitespace-pre flex-1 text-amber-100/90 leading-6">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
