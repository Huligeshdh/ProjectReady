import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, ArrowUpRight, Zap, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { ProjectImprovement, ReanalysisComparison } from '../types';

export const ImprovementPage: React.FC = () => {
  const [improvements, setImprovements] = useState<ProjectImprovement[]>([]);
  const [comparison, setComparison] = useState<ReanalysisComparison | null>(null);
  const [projectLevel, setProjectLevel] = useState<string>('');
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await apiService.getImprovements();
    setImprovements(data.improvements);
    setComparison(data.comparison);
    setProjectLevel(data.project_level);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setImprovements(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus as any } : item))
    );
    await apiService.updateImprovementStatus(id, newStatus);
  };

  const handleAnalyzeAgain = async () => {
    setReanalyzing(true);
    setTimeout(async () => {
      await loadData();
      setReanalyzing(false);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Project Improvement Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Re-Analysis & Score Delta Tracker</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Actionable upgrade roadmap with before vs after comparison metrics after code refactoring.
          </p>
        </div>

        <button
          onClick={handleAnalyzeAgain}
          disabled={reanalyzing}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${reanalyzing ? 'animate-spin' : ''}`} />
          <span>{reanalyzing ? 'Re-Analyzing Codebase...' : 'Analyze Again'}</span>
        </button>
      </div>

      {/* Before vs After Re-Analysis Comparison Scorecard */}
      {comparison && (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-emerald-500/30 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Re-Analysis Impact Scorecard
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                Comparing Run #{comparison.previous_run_number} vs Run #{comparison.current_run_number}
              </h2>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg">
              +{comparison.overall_delta} Overall Improvement
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">BEFORE HEALTH</span>
              <span className="text-xl font-bold text-slate-600 dark:text-slate-400">{comparison.before_score}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">AFTER HEALTH</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{comparison.after_score}</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">RESOLVED ISSUES</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{comparison.resolved_issues_count} Fixed</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">CURRENT LEVEL</span>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 truncate block mt-1">{projectLevel}</span>
            </div>
          </div>

          {/* Metric Deltas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Security Score', delta: comparison.deltas.security_delta },
              { label: 'Testing Coverage', delta: comparison.deltas.testing_delta },
              { label: 'Code Quality', delta: comparison.deltas.code_quality_delta },
              { label: 'Architecture', delta: comparison.deltas.architecture_delta },
            ].map((d) => (
              <div key={d.label} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">{d.label}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{d.delta}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prioritized Improvements Task List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Actionable Improvement Tasks
        </h3>

        <div className="space-y-4">
          {improvements.map((imp) => (
            <div key={imp.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      imp.priority === 'CRITICAL' || imp.priority === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                    }`}>
                      {imp.priority} PRIORITY
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{imp.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">{imp.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{imp.problem_summary}</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={imp.status}
                    onChange={(e) => handleStatusChange(imp.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none ${
                      imp.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : imp.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Recommended Action: </span>
                {imp.recommended_action}
                <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">Estimated Effort: {imp.estimated_effort}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
