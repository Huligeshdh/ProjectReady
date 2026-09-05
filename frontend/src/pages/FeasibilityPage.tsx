import React, { useState } from 'react';
import { Compass, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { apiService } from '../services/api';
import { FeasibilityVerdict } from '../types';

export const FeasibilityPage: React.FC = () => {
  const [customIdea, setCustomIdea] = useState('I want to build an AI system for medical diagnosis');
  const [verdict, setVerdict] = useState<FeasibilityVerdict | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIdea.trim()) return;
    setLoading(true);
    try {
      const res = await apiService.evaluateFeasibility(customIdea);
      setVerdict(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Project Feasibility Analyzer
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Custom Idea Scope Evaluator</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Enter your own project idea to analyze technical difficulty, dataset availability, risks, and automated scope narrowing recommendations.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Enter Your Project Proposal:</label>
        <textarea
          rows={3}
          value={customIdea}
          onChange={(e) => setCustomIdea(e.target.value)}
          placeholder="e.g. I want to build an AI system for medical diagnosis..."
          className="w-full p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-lg shadow-brand-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Evaluating Feasibility...' : 'Analyze Feasibility'}</span>
          </button>
        </div>
      </form>

      {verdict && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Feasibility Verdict</span>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  verdict.verdict === 'RECOMMENDED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                }`}>
                  {verdict.verdict.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">Overall Fit Score</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{verdict.scores.overall_fit} / 100</p>
            </div>
          </div>

          {/* Narrowed Scope Suggestion Box */}
          {verdict.suggested_narrowed_scope !== verdict.original_idea && (
            <div className="p-5 rounded-xl bg-brand-500/10 dark:bg-brand-950/40 border border-brand-500/30 space-y-2">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold">
                <ArrowRight className="w-4 h-4" /> Recommended Scope Narrowing:
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{verdict.suggested_narrowed_scope}</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2">{verdict.reasoning}</p>
            </div>
          )}

          {/* Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Technical & Dataset Risks
              </h4>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {verdict.risk_factors.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Ethical Considerations
              </h4>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {verdict.ethical_considerations.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
