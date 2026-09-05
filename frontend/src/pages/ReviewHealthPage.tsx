import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileCode, Activity, ShieldAlert, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';

import { CodeReviewPage } from './CodeReviewPage';
import { HealthPage } from './HealthPage';
import { RealityCheckPage } from './RealityCheckPage';
import { ImprovementPage } from './ImprovementPage';

export const ReviewHealthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'review';

  const tabs = [
    { id: 'review', label: 'Code Review', icon: FileCode, desc: 'ZIP Upload & static code evaluation' },
    { id: 'health', label: 'Project Health', icon: Activity, desc: 'Architecture, security & quality metrics' },
    { id: 'reality-check', label: 'Reality Check', icon: ShieldAlert, desc: 'Project Survival Score & Panel Attack Points' },
    { id: 'improvements', label: 'Improvements & Re-Analysis', icon: TrendingUp, desc: 'Prioritized fixes & score boost' },
  ];

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 space-y-6 transition-colors">
      {/* Workflow Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>CODE & EVALUATION WORKFLOW</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-600 dark:text-slate-300 capitalize">{currentTab.replace('-', ' ')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Code Audit & Project Reality Check</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Continuous 6-step loop: Upload ZIP → Code Review → Project Health → Reality Check → Improvements → Re-Analyze.</p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md overflow-x-auto shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                type="button"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content View */}
      <div className="animate-fadeIn">
        {currentTab === 'review' && <CodeReviewPage />}
        {currentTab === 'health' && <HealthPage />}
        {currentTab === 'reality-check' && <RealityCheckPage />}
        {currentTab === 'improvements' && <ImprovementPage />}
      </div>
    </div>
  );
};
