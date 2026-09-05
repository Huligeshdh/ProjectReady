import React, { useState, useEffect } from 'react';
import { FileText, Cpu, Database, Shield, CheckCircle, Layers } from 'lucide-react';
import { apiService } from '../services/api';
import { ProjectBlueprint } from '../types';

export const BlueprintPage: React.FC = () => {
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);

  useEffect(() => {
    apiService.getBlueprint().then(setBlueprint);
  }, []);

  if (!blueprint) return <div className="p-8 text-slate-500 dark:text-slate-400">Loading Blueprint...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Project Blueprint
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">System Architecture Specifications</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Comprehensive project blueprint detailing objectives, non-functional requirements, database design, and AI model pipeline.
        </p>
      </div>

      {/* Overview & Objectives */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Overview & Objectives</h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{blueprint.overview}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {blueprint.objectives.map((obj, i) => (
            <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Matrix */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Technology Stack Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(blueprint.tech_stack).map(([layer, tech]) => (
            <div key={layer} className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider">{layer}</span>
              <p className="font-semibold text-slate-900 dark:text-slate-200 mt-1">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-500 dark:text-brand-400" /> AI / ML Model Pipeline
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{blueprint.ai_ml_architecture}</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Database & Storage Schema
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{blueprint.database_architecture}</p>
        </div>
      </div>
    </div>
  );
};
