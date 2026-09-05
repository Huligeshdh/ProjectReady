import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Check, ArrowRight, ShieldAlert, Cpu, BarChart2 } from 'lucide-react';
import { apiService } from '../services/api';
import { ProjectIdea } from '../types';

export const IdeaGeneratorPage: React.FC = () => {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number>(1);

  useEffect(() => {
    apiService.generateIdeas().then((data) => {
      setIdeas(data);
      setLoading(false);
    });
  }, []);

  const selectedIdea = ideas.find(i => i.id === selectedId) || ideas[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Idea Engine
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Personalized Project Ideas</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Generated based on your profile constraints: Python, PyTorch, React, 4-month timeline, and 3 team members.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Idea List */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Project Candidate</h3>
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setSelectedId(idea.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedId === idea.id
                  ? 'bg-slate-50 dark:bg-slate-900 border-brand-500/50 shadow-lg shadow-brand-500/10'
                  : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  {idea.difficulty}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{idea.overall_score}/100 Fit</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">{idea.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{idea.one_liner}</p>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Detailed Idea Blueprint & Scores */}
        {selectedIdea && (
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedIdea.title}</h2>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">{selectedIdea.one_liner}</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Overall Fit Score</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{selectedIdea.overall_score} / 100</span>
                </div>
              </div>

              {/* Score Radar Grid */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Multi-Factor Scoring Engine</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Skill Match', val: selectedIdea.skill_match_score },
                    { label: 'Feasibility', val: selectedIdea.feasibility_score },
                    { label: 'Innovation', val: selectedIdea.innovation_score },
                    { label: 'Time Fit', val: selectedIdea.time_fit_score },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{s.label}</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{s.val} / 100</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-300">Problem Statement:</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{selectedIdea.problem_statement}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-300">Core Features:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {selectedIdea.core_features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-300">Dataset & API Requirements:</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{selectedIdea.dataset_api_requirements}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
