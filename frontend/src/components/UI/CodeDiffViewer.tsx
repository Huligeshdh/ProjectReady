import React, { useState } from 'react';
import { Check, Copy, AlertTriangle, Shield, CheckCircle, Code2, HelpCircle } from 'lucide-react';

interface CodeDiffViewerProps {
  filePath: string;
  lineNumber: number;
  problem: string;
  whyItMatters: string;
  impact: string;
  recommendedFix: string;
  originalCode?: string;
  suggestedCode?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  filePath,
  lineNumber,
  problem,
  whyItMatters,
  impact,
  recommendedFix,
  originalCode = '',
  suggestedCode = '',
  severity
}) => {
  const [copied, setCopied] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const copyFix = () => {
    navigator.clipboard.writeText(suggestedCode || recommendedFix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
    }
  };

  return (
    <div className={`rounded-xl border transition-all ${resolved ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90'} overflow-hidden shadow-sm`}>
      {/* Issue Header Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getSeverityBadge()}`}>
            {severity}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-800 dark:text-slate-300 font-semibold">{filePath}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Line {lineNumber}</span>
            </div>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-200 mt-0.5">{problem}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showExplanation ? 'Hide Context' : 'Explain'}</span>
          </button>

          <button
            onClick={copyFix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 hover:bg-brand-600/20 dark:hover:bg-brand-600/30 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Fix'}</span>
          </button>

          <button
            onClick={() => setResolved(!resolved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              resolved
                ? 'bg-emerald-500 text-white dark:text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{resolved ? 'Resolved' : 'Mark Resolved'}</span>
          </button>
        </div>
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div className="p-4 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div>
            <span className="font-semibold text-brand-600 dark:text-brand-400">Why It Matters: </span>
            <span className="text-slate-700 dark:text-slate-300">{whyItMatters}</span>
          </div>
          <div>
            <span className="font-semibold text-rose-600 dark:text-rose-400">Impact: </span>
            <span className="text-slate-700 dark:text-slate-300">{impact}</span>
          </div>
          <div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Recommended Fix: </span>
            <span className="text-slate-700 dark:text-slate-300">{recommendedFix}</span>
          </div>
        </div>
      )}

      {/* IDE Code Diff Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 font-mono text-xs">
        {/* Original Code */}
        <div className="p-4 bg-rose-500/5 dark:bg-rose-950/10">
          <div className="flex items-center justify-between text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider mb-2">
            <span>Original Code</span>
            <span>- Current File</span>
          </div>
          <pre className="p-3 rounded-lg bg-rose-50/50 dark:bg-slate-950 border border-rose-200 dark:border-rose-900/30 text-rose-900 dark:text-rose-200/90 overflow-x-auto whitespace-pre-wrap">
            <code>{originalCode || '# No snippet captured'}</code>
          </pre>
        </div>

        {/* AI Suggested Code */}
        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-950/10">
          <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-2">
            <span>AI Suggested Correction</span>
            <span>+ Proposed Fix</span>
          </div>
          <pre className="p-3 rounded-lg bg-emerald-50/50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200/90 overflow-x-auto whitespace-pre-wrap">
            <code>{suggestedCode || recommendedFix}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
