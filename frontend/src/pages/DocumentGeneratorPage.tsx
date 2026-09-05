import React, { useState } from 'react';
import { FileCheck2, Download, Copy, Check, Sparkles, FileText } from 'lucide-react';
import { apiService } from '../services/api';

export const DocumentGeneratorPage: React.FC = () => {
  const [docType, setDocType] = useState<string>('abstract');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (selectedType: string) => {
    setDocType(selectedType);
    setLoading(true);
    try {
      const res = await apiService.generateDocument(1, selectedType);
      setContent(res.markdown_content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5" /> Publication Document Generator
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Structured Academic Draft Exporter</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Generate structured drafts for Project Abstract, Introduction, System Methodology, and Technical Reports based on verified project specs.
        </p>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'abstract', label: 'Project Abstract' },
          { id: 'methodology', label: 'System Methodology' },
          { id: 'full_report', label: 'Technical Report' }
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => handleGenerate(d.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              docType === d.id
                ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading && <div className="p-8 text-xs text-brand-600 dark:text-brand-400 font-medium animate-pulse">Generating publication draft...</div>}

      {content && !loading && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">{docType} Draft</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 hover:bg-brand-600/20 dark:hover:bg-brand-600/30 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
};
