import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderGit2, Lightbulb, Compass, Search,
  FileText, Map, MessageSquareCode, FileCode, Activity,
  TrendingUp, Settings, Sparkles, ShieldAlert, ChevronDown, ChevronRight, User, BookOpen, GitFork, Database, GraduationCap
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();

  // Accordion state
  const [projectOpen, setProjectOpen] = useState(location.pathname.startsWith('/project') || location.pathname === '/ideas' || location.pathname === '/feasibility' || location.pathname === '/blueprint' || location.pathname === '/roadmap');
  const [researchOpen, setResearchOpen] = useState(location.pathname.startsWith('/research'));
  const [reviewOpen, setReviewOpen] = useState(location.pathname.startsWith('/review') || location.pathname === '/code-review' || location.pathname === '/health' || location.pathname === '/reality-check' || location.pathname === '/improvements');

  const closeMobile = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white/90 dark:bg-slate-950/95 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl flex flex-col transition-all duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tight leading-tight">ProjectReady</h1>
            <p className="text-[10px] text-brand-600 dark:text-brand-400 font-extrabold tracking-wide uppercase">Academic SaaS Platform</p>
          </div>
        </div>
      </div>

      {/* 5 Core Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {/* 1. DASHBOARD */}
        <NavLink
          to="/dashboard"
          onClick={closeMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? 'bg-brand-500/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        {/* 2. PROJECT (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setProjectOpen(!projectOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              location.pathname.startsWith('/project') || location.pathname === '/ideas' || location.pathname === '/feasibility' || location.pathname === '/blueprint' || location.pathname === '/roadmap'
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-4 h-4" />
              <span>Project Builder</span>
            </div>
            {projectOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {projectOpen && (
            <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 mt-1 space-y-1">
              <NavLink
                to="/project?tab=idea"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/ideas'
                      ? 'text-brand-600 dark:text-brand-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Ideas</span>
              </NavLink>
              <NavLink
                to="/project?tab=feasibility"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/feasibility'
                      ? 'text-brand-600 dark:text-brand-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Feasibility</span>
              </NavLink>
              <NavLink
                to="/project?tab=blueprint"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/blueprint'
                      ? 'text-brand-600 dark:text-brand-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>Blueprint</span>
              </NavLink>
              <NavLink
                to="/project?tab=roadmap"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/roadmap'
                      ? 'text-brand-600 dark:text-brand-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <Map className="w-3.5 h-3.5 text-emerald-500" />
                <span>Roadmap</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. RESEARCH (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setResearchOpen(!researchOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              location.pathname.startsWith('/research')
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" />
              <span>Research Hub</span>
            </div>
            {researchOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {researchOpen && (
            <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 mt-1 space-y-1">
              <NavLink
                to="/research?tab=papers"
                onClick={closeMobile}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Research Papers</span>
              </NavLink>
              <NavLink
                to="/research?tab=repos"
                onClick={closeMobile}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              >
                <GitFork className="w-3.5 h-3.5 text-purple-500" />
                <span>GitHub Repos</span>
              </NavLink>
              <NavLink
                to="/research?tab=datasets"
                onClick={closeMobile}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              >
                <Database className="w-3.5 h-3.5 text-amber-500" />
                <span>Datasets & APIs</span>
              </NavLink>
              <NavLink
                to="/research?tab=videos"
                onClick={closeMobile}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40"
              >
                <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
                <span>Learning Path</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. AI MENTOR */}
        <NavLink
          to="/mentor"
          onClick={closeMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? 'bg-brand-500/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`
          }
        >
          <MessageSquareCode className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span>AI Mentor</span>
        </NavLink>

        {/* 5. REVIEW & IMPROVE (Collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setReviewOpen(!reviewOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              location.pathname.startsWith('/review') || location.pathname === '/code-review' || location.pathname === '/health' || location.pathname === '/reality-check' || location.pathname === '/improvements'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Review & Health</span>
            </div>
            {reviewOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {reviewOpen && (
            <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 mt-1 space-y-1">
              <NavLink
                to="/review?tab=review"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/code-review'
                      ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <FileCode className="w-3.5 h-3.5 text-teal-500" />
                <span>Code Review</span>
              </NavLink>
              <NavLink
                to="/review?tab=health"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/health'
                      ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Project Health</span>
              </NavLink>
              <NavLink
                to="/review?tab=reality-check"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/reality-check'
                      ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Reality Check</span>
              </NavLink>
              <NavLink
                to="/review?tab=improvements"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive || location.pathname === '/improvements'
                      ? 'text-emerald-700 dark:text-emerald-300 font-semibold bg-slate-100 dark:bg-slate-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`
                }
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Improvements</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-2" />
        </div>

        {/* Profile */}
        <NavLink
          to="/profile"
          onClick={closeMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700/50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`
          }
        >
          <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Student Profile</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          onClick={closeMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-300 dark:border-slate-700/50'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`
          }
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>AI Settings</span>
        </NavLink>
      </div>

      {/* Active Project Footer Widget */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Active Project</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Survival Score 87%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">AI Retinopathy Diagnosis</p>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full w-3/4 rounded-full" />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Phase 6 of 10 • Ready for Review</p>
        </div>
      </div>
    </aside>
  );
};
