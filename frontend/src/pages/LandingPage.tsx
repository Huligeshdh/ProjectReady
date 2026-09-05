import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldAlert, CheckCircle2, FileCode, MessageSquareCode,
  Map, Lightbulb, Compass, Search, TrendingUp, Layers, Award, ShieldCheck, XCircle, Check
} from 'lucide-react';
import { ThemeToggle } from '../components/UI/ThemeToggle';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">ProjectReady</span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-extrabold block -mt-1 tracking-wider uppercase">Academic SaaS</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-slate-900 dark:hover:text-slate-100 transition">
            How It Works
          </button>
          <button type="button" onClick={() => scrollToSection('criteria')} className="hover:text-slate-900 dark:hover:text-slate-100 transition">
            AI Evaluation
          </button>
          <button type="button" onClick={() => scrollToSection('reality-check')} className="hover:text-slate-900 dark:hover:text-slate-100 transition">
            Reality Check
          </button>
          <button type="button" onClick={() => scrollToSection('features')} className="hover:text-slate-900 dark:hover:text-slate-100 transition">
            Workspaces
          </button>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="px-4.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-extrabold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> BUILD IT. TEST IT. IMPROVE IT. MAKE IT FINAL-READY.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
              From Project Idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-500 dark:from-brand-400 dark:via-indigo-300 dark:to-emerald-400">Final-Ready.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              ProjectReady helps students choose the right project, validate the idea, find research and resources, plan the build, get AI guidance, analyze their actual code, and fix weaknesses before evaluation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition transform hover:scale-105 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-800 transition shadow-sm"
              >
                See How It Works
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>6 Competition Evaluation Criteria</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>AST Static Scanner & Masked Secrets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Project Survival Score Engine</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Preview Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-5 relative">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 ml-2">ProjectReady AI Submission</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  SCORE: 82/100
                </span>
              </div>

              {/* Survival Score Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">AI Code Submission Score</span>
                <div className="text-4xl font-black text-slate-900 dark:text-slate-100">
                  82 <span className="text-sm text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">+18 points after code review fixes</p>
              </div>

              {/* Score Breakdown List */}
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Accessibility (10%)', score: 91, color: 'bg-teal-500' },
                  { name: 'Code Quality (20%)', score: 88, color: 'bg-brand-500' },
                  { name: 'Problem Alignment (20%)', score: 86, color: 'bg-indigo-500' },
                  { name: 'Efficiency (15%)', score: 84, color: 'bg-emerald-500' },
                  { name: 'Security Scan (20%)', score: 79, color: 'bg-amber-500' },
                  { name: 'Testing Suite (15%)', score: 67, color: 'bg-yellow-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60">
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-200 text-[11px] w-6 text-right">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>3 Issues Need Attention</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-700 dark:text-amber-200 font-mono">High Priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Six Competition Criteria Showcase */}
      <section id="criteria" className="py-16 px-6 max-w-6xl mx-auto space-y-10 text-center">
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Competition Alignment</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            “Built for the way projects are actually evaluated.”
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            ProjectReady evaluates your ZIP code submission against the six official competition criteria, generating actionable diffs, evidence traces, and score re-analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { name: '1. Code Quality (20%)', desc: 'Evaluates readability, modularity, function length, dead code, and naming conventions.' },
            { name: '2. Security (20%)', desc: 'Masks hardcoded secrets (••••••••••••), checks CORS, SQL injection risks, and JWT expiration validation.' },
            { name: '3. Efficiency (15%)', desc: 'Identifies nested loops, duplicate database queries, and inefficient ML data pipelines.' },
            { name: '4. Testing (15%)', desc: 'Discovers unit/integration test files and identifies unverified edge-case coverage.' },
            { name: '5. Accessibility (10%)', desc: 'Audits frontend HTML5 semantics, ARIA attributes, keyboard focus rings, and contrast.' },
            { name: '6. Problem Alignment (20%)', desc: 'Compares your planned blueprint features against your actual detected code files.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2 backdrop-blur-md shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs mb-3">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works (5-Step Section) */}
      <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">End-to-End Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">How ProjectReady Works</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A structured 5-step lifecycle designed to take you from a blank screen to a final-ready submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', name: 'Choose', title: 'Idea & Feasibility', desc: 'Generate topics tailored to your skills, team size, timeline, and budget.' },
            { step: '02', name: 'Plan', title: 'Blueprint & Roadmap', desc: 'Build architecture diagrams, database schemas, feature sets, and phase milestones.' },
            { step: '03', name: 'Build', title: 'Contextual AI Mentor', desc: 'Get RAG-powered guidance grounded in your exact project code and tech stack.' },
            { step: '04', name: 'Review', title: 'ZIP Code Analysis', desc: 'Upload your source code ZIP for static AST scanning, security, and quality audit.' },
            { step: '05', name: 'Improve', title: 'Reality Check & Re-Analysis', desc: 'Receive your Project Survival Score, fix vulnerabilities, and re-analyze to boost score.' },
          ].map((s) => (
            <div key={s.step} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono block">{s.step}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 tracking-wider block mt-1">{s.name}</span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">{s.title}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5. Six Competition Criteria — Selling Point */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/30 text-xs font-extrabold">
            <Award className="w-3.5 h-3.5" /> AI CODE SUBMISSION EVALUATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            "Built for the way projects are actually evaluated."
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            ProjectReady evaluates your codebase against the six official competition criteria — so you know exactly where you stand before submission.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Code Quality', score: 88, weight: '20%', icon: '📐', desc: 'Readability, modularity, naming, complexity, architecture.' },
            { name: 'Security', score: 79, weight: '20%', icon: '🔒', desc: 'Secret detection, injection risks, auth validation, CORS.' },
            { name: 'Efficiency', score: 84, weight: '15%', icon: '⚡', desc: 'Algorithmic complexity, N+1 queries, memory patterns.' },
            { name: 'Testing', score: 67, weight: '15%', icon: '🧪', desc: 'Test discovery, coverage, edge-case tests, API tests.' },
            { name: 'Accessibility', score: 91, weight: '10%', icon: '♿', desc: 'ARIA labels, keyboard nav, semantic HTML, contrast.' },
            { name: 'Problem Alignment', score: 86, weight: '20%', icon: '🎯', desc: 'Did you actually build what you said you would build?' },
          ].map((c) => (
            <div key={c.name} className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xl">{c.icon}</span>
                <span className="text-[10px] font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">{c.weight}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{c.name}</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">{c.score}</span>
                <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: `${c.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 pt-4">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            Submit your code. See where it stands. Fix the weaknesses. Analyze again.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm transition shadow-xl shadow-brand-500/25"
          >
            <FileCode className="w-4 h-4" /> Try AI Code Submission <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Estimated submission readiness based on the published evaluation criteria.
          </p>
        </div>
      </section>

      {/* 5. Killer Feature Section: Project Reality Check */}
      <section id="reality-check" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold">
              <ShieldAlert className="w-3.5 h-3.5" /> KILLER FEATURE: PROJECT REALITY CHECK
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              “Don't just build your project. Test whether it can survive evaluation.”
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ProjectReady evaluates your codebase across 14 rigorous academic dimensions: technical complexity, research depth, security, testing, scalability, and panel attack points.
            </p>
          </div>

          {/* Before vs After Visual Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Before Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-rose-200 dark:border-rose-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
                <span>Initial Upload ZIP Scan</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">Needs Attention</span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
                67 <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Detected unvalidated JWT tokens, missing unit test coverage, and swallow exceptions in PyTorch preprocessing.
              </p>
            </div>

            {/* After Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>After Prioritized Fixes & Re-Analysis</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">+19 SCORE BOOST</span>
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                86 <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Vulnerabilities resolved, test suite passing, architecture clean, and evaluator defense questions prepared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature Workspaces Showcase */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">Unified Platform</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Five Powerful Workspaces</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Dashboard', icon: Layers, desc: 'Central command center with active project status, quick actions, survival score, and milestone progress.' },
            { name: 'Project Builder', icon: Compass, desc: 'Tabbed workspace for Idea generation, Feasibility scoring, Architecture Blueprint, and Roadmap.' },
            { name: 'Research Hub', icon: Search, desc: 'Curated research papers (Crossref/arXiv DOIs), GitHub repositories, datasets, and learning paths.' },
            { name: 'AI Mentor', icon: MessageSquareCode, desc: 'Context-aware AI supervisor grounded in your active project blueprint, tech stack, and code review.' },
            { name: 'Review & Health', icon: ShieldAlert, desc: 'ZIP upload code review, 6 competition criteria evaluation, Project Survival Score, and score re-analysis loop.' },
          ].map((w, idx) => {
            const Icon = w.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{w.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{w.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-slate-100 via-white to-brand-50 dark:from-brand-900/80 dark:via-slate-900 dark:to-indigo-900/80 border border-brand-500/30 backdrop-blur-2xl shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            “Your project doesn't have to be perfect on day one.”
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start with an idea. ProjectReady helps you turn it into something you can confidently submit, demonstrate and defend.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm shadow-xl shadow-brand-500/25 transition transform hover:scale-105 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              PR
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-slate-200">ProjectReady</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">Build it. Test it. Improve it. Make it final-ready.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <button type="button" onClick={() => scrollToSection('how-it-works')} className="hover:text-slate-900 dark:hover:text-slate-200">How It Works</button>
            <button type="button" onClick={() => scrollToSection('criteria')} className="hover:text-slate-900 dark:hover:text-slate-200">AI Evaluation</button>
            <button type="button" onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-slate-200">Sign In</button>
            <button type="button" onClick={() => navigate('/signup')} className="hover:text-slate-900 dark:hover:text-slate-200">Get Started</button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-500">© 2026 ProjectReady Academic SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
