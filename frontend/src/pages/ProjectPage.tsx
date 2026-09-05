import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lightbulb, Compass, FileText, Map, ChevronRight } from 'lucide-react';

import { IdeaGeneratorPage } from './IdeaGeneratorPage';
import { FeasibilityPage } from './FeasibilityPage';
import { BlueprintPage } from './BlueprintPage';
import { RoadmapPage } from './RoadmapPage';

export const ProjectPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'idea';

  const tabs = [
    { id: 'idea', label: 'Idea Generation', icon: Lightbulb, desc: 'Generate & select AI project topics' },
    { id: 'feasibility', label: 'Feasibility Engine', icon: Compass, desc: 'Analyze technical & timeline feasibility' },
    { id: 'blueprint', label: 'Architecture Blueprint', icon: FileText, desc: 'Design system flow & database schema' },
    { id: 'roadmap', label: 'Development Roadmap', icon: Map, desc: 'Track phases, tasks & milestones' },
  ];

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 space-y-6 transition-colors">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <span>PROJECT BUILDER</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-600 dark:text-slate-300 capitalize">{currentTab}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Academic Project Builder</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">Transform raw academic ideas into a fully planned, feasible project blueprint and roadmap.</p>
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 whitespace-nowrap ${
                  active
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-400/30'
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

      {/* Internal Content View */}
      <div className="animate-fadeIn">
        {currentTab === 'idea' && <IdeaGeneratorPage />}
        {currentTab === 'feasibility' && <FeasibilityPage />}
        {currentTab === 'blueprint' && <BlueprintPage />}
        {currentTab === 'roadmap' && <RoadmapPage />}
      </div>
    </div>
  );
};
