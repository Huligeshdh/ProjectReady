import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, label = 'Copy', className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-800/60 dark:bg-slate-800/80 text-slate-300 hover:bg-slate-700/60 dark:hover:bg-slate-700/80 border-slate-700/50 hover:text-white'
      } ${className}`}
      title={copied ? 'Copied to clipboard' : 'Copy code snippet'}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
