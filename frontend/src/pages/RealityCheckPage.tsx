import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Zap, TrendingUp, Layers, Award } from 'lucide-react';
import { apiService } from '../services/api';
import { RealityCheckEvaluation } from '../types';
import { SurvivalScoreCard } from '../components/RealityCheck/SurvivalScoreCard';
import { ScoreRadarChart } from '../components/RealityCheck/ScoreRadarChart';
import { PanelAttackList } from '../components/RealityCheck/PanelAttackList';

export const RealityCheckPage: React.FC = () => {
  const [evaluation, setEvaluation] = useState<RealityCheckEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getRealityCheck();
      setEvaluation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAgain = async () => {
    setReanalyzing(true);
    try {
      const updated = await apiService.analyzeAgainRealityCheck();
      setEvaluation(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || !evaluation) {
    return <div className="p-8 text-slate-500 dark:text-slate-400">Evaluating Project Reality Check & Survival Score...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" /> COMPETITION READINESS EVALUATION
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Project Reality Check</h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
            “Don't just build your project. Test whether it can survive evaluation.”
          </p>
        </div>

        <button
          onClick={handleAnalyzeAgain}
          disabled={reanalyzing}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-500/20 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <RefreshCw className={`w-4 h-4 ${reanalyzing ? 'animate-spin' : ''}`} />
          <span>{reanalyzing ? 'Re-Evaluating Project...' : 'Analyze Again'}</span>
        </button>
      </div>

      {/* Dual Scores Comparison Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">AI Code Submission Score</span>
            <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-[10px] font-bold">6 Criteria</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
            82 <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Based on Code Quality, Security, Efficiency, Testing, Accessibility & Problem Alignment.</p>
          <NavLink to="/review?tab=review" className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-bold pt-1">
            <span>View Criteria Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Project Survival Score</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">Comprehensive</span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            87 <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Broader evaluation including research depth, feasibility, innovation, and panel attack points.</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Submission
          </span>
        </div>
      </div>

      {/* Hero Score Card */}
      <SurvivalScoreCard
        score={evaluation.overall_score}
        classification={evaluation.classification}
        plannedScore={evaluation.planned_score}
        implementedScore={evaluation.implemented_score}
        implementationGap={evaluation.implementation_gap}
        summary={evaluation.ai_summary}
        onAnalyzeAgain={handleAnalyzeAgain}
      />

      {/* 14-Dimension Score Visualization */}
      <ScoreRadarChart dimensions={evaluation.dimensions} />

      {/* Strengths & Failure Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 backdrop-blur-md shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Project Strengths
          </h3>
          <div className="space-y-2 text-xs">
            {evaluation.strengths.map((str, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Risks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 backdrop-blur-md shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Failure Risks & Mitigations
          </h3>
          <div className="space-y-3 text-xs">
            {evaluation.risks.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-200">{r.risk_title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.severity === 'Critical' || r.severity === 'High' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {r.severity} Risk
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{r.impact_description}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Mitigation: {r.mitigation_strategy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Attack Points & Contextual Questions */}
      <PanelAttackList
        attackPoints={evaluation.panel_attack_points}
        evaluatorQuestions={evaluation.evaluator_questions}
      />
    </div>
  );
};
