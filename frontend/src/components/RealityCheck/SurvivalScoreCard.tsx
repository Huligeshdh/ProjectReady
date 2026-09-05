import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Sparkles, Layers } from 'lucide-react';
import { ScoreGauge } from '../UI/ScoreGauge';

interface SurvivalScoreCardProps {
  score: number;
  classification: string;
  plannedScore: number;
  implementedScore: number;
  implementationGap: number;
  summary: string;
  onAnalyzeAgain?: () => void;
}

export const SurvivalScoreCard: React.FC<SurvivalScoreCardProps> = ({
  score,
  classification,
  plannedScore,
  implementedScore,
  implementationGap,
  summary,
  onAnalyzeAgain
}) => {
  const getBadgeColor = (cls: string) => {
    if (cls.includes('Excellent') || cls.includes('Final-Ready'))
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (cls.includes('Strong'))
      return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
    if (cls.includes('Good'))
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950/40 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
      <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Project Survival Score Engine
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(classification)}`}>
              {classification}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            “Will your project survive evaluation?”
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {summary}
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Planned Score</span>
              <span className="text-base font-bold text-slate-200">{plannedScore} / 100</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Actual Implemented</span>
              <span className="text-base font-bold text-slate-200">{implementedScore} / 100</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Implementation Gap</span>
              <span className={`text-base font-bold ${implementationGap < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {implementationGap > 0 ? `+${implementationGap}` : implementationGap} pts
              </span>
            </div>
          </div>
        </div>

        <ScoreGauge score={score} size="lg" label="Survival Score" />
      </div>
    </div>
  );
};
