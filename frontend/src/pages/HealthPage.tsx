import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, ArrowUpRight, BarChart3, Info } from 'lucide-react';
import { apiService } from '../services/api';
import { ProjectHealth } from '../types';
import { ScoreGauge } from '../components/UI/ScoreGauge';

export const HealthPage: React.FC = () => {
  const [health, setHealth] = useState<ProjectHealth | null>(null);

  useEffect(() => {
    apiService.getProjectHealth().then(setHealth);
  }, []);

  if (!health) return <div className="p-8 text-slate-500 dark:text-slate-400">Loading Health Evaluation...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Project Health Evaluation
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Quantitative & Qualitative Audit</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Multi-dimensional breakdown distinguishing measured static analysis metrics from AI qualitative assessments.
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Overall Health Index
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{health.overall_score} / 100</h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {health.ai_qualitative_assessment}
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-slate-600 dark:text-slate-400">
            <span>Total Runs Analyzed: <strong className="text-slate-900 dark:text-white">{health.total_runs}</strong></span>
            <span>•</span>
            <span>Lines Audited: <strong className="text-slate-900 dark:text-white">3,840</strong></span>
          </div>
        </div>

        <ScoreGauge score={health.overall_score} size="lg" label="Overall Score" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Code Quality', val: health.metrics.code_quality, type: 'Measured' },
          { label: 'Architecture', val: health.metrics.architecture, type: 'AI Qualitative' },
          { label: 'Security', val: health.metrics.security, type: 'Measured' },
          { label: 'Testing', val: health.metrics.testing, type: 'Measured' },
          { label: 'Performance', val: health.metrics.performance, type: 'Measured' },
          { label: 'Maintainability', val: health.metrics.maintainability, type: 'Measured' },
          { label: 'Documentation', val: health.metrics.documentation, type: 'AI Qualitative' },
          { label: 'Innovation', val: health.metrics.innovation, type: 'AI Qualitative' },
          { label: 'Feasibility', val: health.metrics.feasibility, type: 'AI Qualitative' }
        ].map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-200">{m.label}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">{m.type}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{m.val}</span>
              <span className="text-xs text-slate-500 font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full rounded-full transition-all duration-1000" style={{ width: `${m.val}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
