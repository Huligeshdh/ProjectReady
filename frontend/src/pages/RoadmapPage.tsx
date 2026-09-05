import React, { useState, useEffect } from 'react';
import { Map, CheckCircle2, Circle, Clock, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { RoadmapPhase } from '../types';

export const RoadmapPage: React.FC = () => {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getRoadmap().then(data => {
      setPhases(data);
      setLoading(false);
    });
  }, []);

  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    setPhases(prev =>
      prev.map(p => ({
        ...p,
        tasks: p.tasks.map(t => (t.id === taskId ? { ...t, is_completed: !currentStatus } : t))
      }))
    );
    await apiService.updateTaskStatus(taskId, !currentStatus);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5" /> 10-Phase Development Roadmap
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Milestone Execution Strategy</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Interactive task tracking for literature review, system design, backend services, frontend UI, model fine-tuning, and static analysis audits.
        </p>
      </div>

      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{phase.title}</h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {phase.tasks.filter(t => t.is_completed).length} / {phase.tasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {phase.tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id, t.is_completed)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    t.is_completed
                      ? 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${t.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-200'}`}>
                        {t.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.estimated_days}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
