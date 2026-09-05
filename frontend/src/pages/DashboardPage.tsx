import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity, Map, Lightbulb, TrendingUp, AlertTriangle, ShieldCheck,
  CheckCircle2, ArrowUpRight, Sparkles, FileCode, Search, MessageSquareCode, ShieldAlert, Compass, PlusCircle, Award
} from 'lucide-react';
import { ScoreGauge } from '../components/UI/ScoreGauge';
import { DashboardSkeleton } from '../components/UI/Skeleton';
import { apiService } from '../services/api';
import { ProjectHealth, RoadmapPhase } from '../types';

export const DashboardPage: React.FC = () => {
  const [health, setHealth] = useState<ProjectHealth | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [hData, rData] = await Promise.all([
          apiService.getProjectHealth(),
          apiService.getRoadmap()
        ]);
        setHealth(hData);
        setRoadmap(rData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const totalTasks = roadmap.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = roadmap.reduce((acc, p) => acc + p.tasks.filter(t => t.is_completed).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 65;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Glass Banner */}
      <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-8 backdrop-blur-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> ACTIVE ACADEMIC PROJECT
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">B.Tech Senior Year • 4 Months Timeline</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              AI Clinical Decision Support for Diabetic Retinopathy
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Deep learning retinal fundus image classification with Grad-CAM explainability heatmaps, PyTorch model training pipeline, and FastAPI backend architecture.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <div className="text-center px-4 py-2 border-r border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Survival Score</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">87<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/100</span></span>
            </div>
            <div className="text-center px-4 py-2">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Roadmap</span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400">65<span className="text-xs font-normal text-slate-400 dark:text-slate-500">%</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="space-y-2">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">Command Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <NavLink
            to="/project?tab=idea"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300">Generate Ideas</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Find topics</p>
            </div>
          </NavLink>

          <NavLink
            to="/review?tab=reality-check"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-300">Run Reality Check</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Survival score</p>
            </div>
          </NavLink>

          <NavLink
            to="/review?tab=review"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-500 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-300">Upload ZIP</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Scan codebase</p>
            </div>
          </NavLink>

          <NavLink
            to="/mentor"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-500 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-300">Ask AI Mentor</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Project context</p>
            </div>
          </NavLink>

          <NavLink
            to="/review?tab=improvements"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">Improvements</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Fix & re-analyze</p>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Score Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Health Audit Score</p>
            <ScoreGauge score={health?.overall_score || 82} size="sm" label="" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{health?.overall_score || 82} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span></h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +17 points after code fixes
          </p>
        </div>

        {/* Roadmap Progress Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roadmap Completion</p>
            <span className="text-xs font-black text-brand-600 dark:text-brand-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{completedTasks || 6} of {totalTasks || 10} milestones completed</p>
        </div>

        {/* Critical Issues Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attention Required</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">2</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Action Items</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400/90 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">JWT expiration check pending</span>
          </div>
        </div>

        {/* Project Survival Score Hero Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Survival Score</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Strong</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">87 <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span></h3>
          </div>
          <NavLink to="/review?tab=reality-check" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-bold flex items-center gap-1">
            View Reality Check Details <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* AI Code Submission Card (full width) */}
      <NavLink
        to="/review?tab=review"
        className="block p-6 rounded-3xl bg-gradient-to-r from-brand-600/5 via-indigo-500/5 to-brand-600/5 dark:from-brand-500/10 dark:via-indigo-500/10 dark:to-brand-500/10 border border-brand-500/20 dark:border-brand-500/30 backdrop-blur-xl shadow-sm hover:shadow-md transition-all group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">AI Code Submission</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">COMPETITION</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Estimated submission readiness based on the published evaluation criteria</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Latest Score</span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-300">82 <span className="text-xs font-normal text-slate-500">/100</span></span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs">
              {[
                { label: 'Quality', score: 88, color: 'text-slate-900 dark:text-slate-100' },
                { label: 'Security', score: 79, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Testing', score: 67, color: 'text-yellow-600 dark:text-yellow-400' },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{c.label}</span>
                  <span className={`text-sm font-black ${c.color}`}>{c.score}</span>
                </div>
              ))}
            </div>
            <ArrowUpRight className="w-5 h-5 text-brand-500 dark:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </NavLink>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Health Breakdown & AI Supervisor */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Technical Health Audit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quantitative metrics derived from static ZIP review</p>
              </div>
              <NavLink to="/review?tab=health" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-500 font-bold flex items-center gap-1">
                Full Metrics Audit <ArrowUpRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'Code Quality', score: health?.metrics.code_quality || 86 },
                { name: 'Architecture', score: health?.metrics.architecture || 83 },
                { name: 'Security', score: health?.metrics.security || 71 },
                { name: 'Testing', score: health?.metrics.testing || 68 },
                { name: 'Documentation', score: health?.metrics.documentation || 91 },
                { name: 'Innovation', score: health?.metrics.innovation || 88 },
              ].map((m) => (
                <div key={m.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{m.name}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">{m.score}</span>
                    <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-brand-600 dark:text-brand-400">AI Qualitative Summary: </span>
              {health?.ai_qualitative_assessment || "The codebase demonstrates solid modular structure (FastAPI + React). Key areas for academic distinction: adding automated integration tests in tests/ and validating JWT expiration handlers."}
            </div>
          </div>
        </div>

        {/* Right Column: Active Roadmap & Verified Research */}
        <div className="space-y-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Map className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Active Milestones
              </h3>
              <NavLink to="/project?tab=roadmap" className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                View Roadmap
              </NavLink>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Dataset Distribution Analysis', done: true, phase: 'Phase 1' },
                { title: 'FastAPI Backend Scaffold', done: true, phase: 'Phase 3' },
                { title: 'JWT Token Authentication', done: false, phase: 'Phase 4' },
                { title: 'React SaaS Interface', done: true, phase: 'Phase 5' },
                { title: 'EfficientNet Model Fine-Tuning', done: false, phase: 'Phase 6' },
              ].map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${t.done ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    <span className={t.done ? 'text-slate-400 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200 font-semibold'}>{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.phase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
